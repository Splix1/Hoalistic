import * as React from 'react';
import { Paper, Button } from '@mui/material';
import Title from './Title';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Context } from '../ContextProvider';
import Chart from 'react-apexcharts';
import Scenarios from '../Scenarios/Scenarios';
import NewScenario from '../Scenarios/NewScenario';
import App from '../../Plaid/App';
import supabase from '../../client';
import { setTransactions } from '../../Store/Transactions';
import Plot from 'react-plotly.js';
import { setPlaid } from '../../Store/Plaid';
import Transactions from './Transactions';

export default function FutureProjections({
  data,
  monthsToAdd,
  setMonthsToAdd,
  years,
  setChartType,
  chartType,
  transactions,
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
    console.log('transactions', data);
    if (data?.error?.error_code === 'ITEM_LOGIN_REQUIRED') {
      await supabase
        .from('access_tokens')
        .update({ access_token: '' })
        .eq('HOA', state?.id);
      dispatchPlaid(setPlaid({ ...statePlaid, accessToken: '' }));
      return;
    }

    await supabase
      .from('HOAs')
      .update({ cursor: data?.cursor })
      .eq('id', state?.id);
    let transaction_ids = stateTransactions?.reduce((ids, transaction) => {
      ids.push(transaction.transaction_id);
      return ids;
    }, []);
    let transactionsToAdd = [];

    for (let i = 0; i < data?.latest_transactions?.length; i++) {
      let {
        amount,
        transaction_type,
        payment_channel,
        merchant_name,
        authorized_date,
        date,
        check_number,
        transaction_id,
        category,
      } = data.latest_transactions[i];
      let { payee, payer } = data.latest_transactions[i].payment_meta;

      if (transaction_ids.includes(transaction_id)) {
        continue;
      }
      transactionsToAdd.push({
        amount,
        transaction_type,
        payment_channel,
        merchant_name,
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
            style={{ width: '12rem', height: '1.5rem', marginLeft: '0.5rem' }}
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
            style={{ width: '9rem', height: '1.5rem', marginLeft: '0.5rem' }}
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
      <div className="display-row" style={{ justifyContent: 'center' }}>
        <Button
          variant={isFutureProjections()}
          style={{ marginRight: '1rem' }}
          onClick={() => setChartType('Future Projections')}
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
          <Scenarios />
          <NewScenario />
        </div>
      </div>
    </Paper>
  );
}
