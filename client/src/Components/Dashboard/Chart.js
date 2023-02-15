import * as React from 'react';
import { Paper, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Context } from '../ContextProvider';
import Scenarios from '../Scenarios/Scenarios';
import NewScenario from '../Scenarios/NewScenario';
import App from '../../Plaid/App';
import supabase from '../../client';
import { setTransactions } from '../../Store/Transactions';
import Plot from 'react-plotly.js';
import { setPlaid } from '../../Store/Plaid';
import Transactions from './Transactions';
import ExportData from './ExportData';

export default function FutureProjections({
  data,
  monthsToAdd,
  setMonthsToAdd,
  setChartType,
  chartType,
}) {
  const {
    state,
    statePlaid,
    stateTransactions,
    dispatchTransactions,
    dispatchPlaid,
  } = React.useContext(Context);
  const [fetchingTransactions, setFetchingTransactions] = React.useState(false);

  function numberWithCommas(x) {
    if (!x) return;
    x = Math.trunc(x);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function isFutureProjections() {
    if (chartType === 'Future Projections') return 'outlined';
    return 'text';
  }

  function isTransactionHistory() {
    if (chartType === 'Transaction History') return 'outlined';
    return 'text';
  }

  async function fetchTransactions() {
    setFetchingTransactions(true);
    const response = await fetch('/api/transactions', { method: 'GET' });
    if (response?.status >= 400) {
      await supabase
        .from('access_tokens')
        .update({ access_token: '' })
        .eq('HOA', state?.id);
      dispatchPlaid(setPlaid({ ...statePlaid, accessToken: '' }));
      return;
    }
    const data = await response.json();

    if (data?.error?.error_code === 'ITEM_LOGIN_REQUIRED') {
      await supabase
        .from('access_tokens')
        .update({ access_token: '' })
        .eq('HOA', state?.id);
      await supabase.from('HOAs').update({ cursor: '' }).eq('id', state?.id);
      await fetch('/api/clear_cursor', { method: 'POST' });
      dispatchPlaid(setPlaid({ ...statePlaid, accessToken: '' }));
      return;
    }

    await supabase
      .from('HOAs')
      .update({ cursor: data?.cursor })
      .eq('id', state?.id);
    let transactionsToAdd = [];

    for (let i = 0; i < data?.latest_transactions?.length; i++) {
      let {
        amount,
        transaction_type,
        payment_channel,
        name,
        merchant_name,
        authorized_date,
        date,
        check_number,
        transaction_id,
        category,
        pending,
      } = data.latest_transactions[i];
      let { payee, payer } = data.latest_transactions[i].payment_meta;
      if (pending) continue;

      //need to cancel out duplicates, possible to grab same transaction with different ID
      let isDuplicateTransaction = false;
      for (let j = 0; j < stateTransactions?.length; j++) {
        let ID = stateTransactions[j].transaction_id;
        if (ID === transaction_id) {
          isDuplicateTransaction = true;
          break;
        }
      }
      for (let j = 0; j < transactionsToAdd.length; j++) {
        let ID = transactionsToAdd[j].transaction_id;
        if (ID === transaction_id) {
          isDuplicateTransaction = true;
          break;
        }
      }
      if (isDuplicateTransaction) continue;

      transactionsToAdd.push({
        amount,
        transaction_type,
        payment_channel,
        merchant_name,
        name,
        authorized_date,
        date,
        check_number,
        transaction_id,
        categories: category?.join(', '),
        payee,
        payer,
        HOA: state?.id,
      });
    }

    let { data: newTransactions } = await supabase
      .from('transactions')
      .insert(transactionsToAdd);

    dispatchTransactions(
      setTransactions([...stateTransactions, ...newTransactions])
    );
    setFetchingTransactions(false);
  }

  function fetchTransactionsButton() {
    switch (fetchingTransactions) {
      case false: {
        return (
          <Button
            fullWidth
            variant="contained"
            className="fetch-transactions"
            style={{ marginLeft: '0.5rem' }}
            onClick={fetchTransactions}
          >
            Fetch Transactions
          </Button>
        );
      }
      case true: {
        return (
          <Button
            fullWidth
            variant="contained"
            className="fetching-transactions"
            style={{ marginLeft: '0.5rem' }}
            disabled
          >
            Fetching transactions...
          </Button>
        );
      }
    }
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '550px',
      }}
      xs={24}
      sm={16}
      md={10}
    >
      <CssBaseline />
      <div className="display-row justify-center">
        <Button
          variant={isFutureProjections()}
          onClick={() => setChartType('Future Projections')}
          style={{ marginRight: '1rem' }}
        >
          Future Projections
        </Button>
        <Button
          variant={isTransactionHistory()}
          onClick={() => setChartType('Transaction History')}
        >
          Transaction History
        </Button>
      </div>

      {/* <Chart
        options={options}
        series={data}
        type="line"
        width="100%"
        height="300rem"
      /> */}
      <Plot
        data={data}
        layout={{
          title: chartType,
          width: 820,
        }}
      />
      <div
        className="display-row"
        style={{ justifyContent: 'space-between', marginTop: '0.5rem' }}
      >
        <div className="display-row">
          {chartType === 'Transaction History' ? (
            <div>
              <Transactions />
            </div>
          ) : null}

          {chartType === 'Transaction History' && statePlaid?.accessToken ? (
            <div>{fetchTransactionsButton()}</div>
          ) : chartType === 'Transaction History' ? (
            <App />
          ) : null}
        </div>

        {chartType === 'Future Projections' ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {monthsToAdd > 0 ? (
                <div
                  style={{
                    cursor: 'pointer',
                    marginRight: '1rem',
                  }}
                  onClick={() => setMonthsToAdd(monthsToAdd - 12)}
                >
                  <ArrowBackIcon />
                </div>
              ) : (
                <div
                  style={{
                    marginRight: '1rem',
                  }}
                >
                  <ArrowBackIcon style={{ color: 'gray' }} />
                </div>
              )}

              <div
                style={{ cursor: 'pointer' }}
                onClick={() => setMonthsToAdd(monthsToAdd + 12)}
              >
                <ArrowForwardIcon />
              </div>
            </div>
          </div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {data[0]?.x?.length > 0 ? <ExportData data={data} /> : null}

          <Scenarios />
          <NewScenario />
        </div>
      </div>
    </Paper>
  );
}
