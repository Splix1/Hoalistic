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

export default function FutureProjections({
  data,
  monthsToAdd,
  setMonthsToAdd,
  years,
  setChartType,
  chartType,
}) {
  const { state, statePlaid, stateTransactions, dispatchTransactions } =
    React.useContext(Context);
  const [showLabels, setShowLabels] = React.useState(false);
  const [fetchingTransactions, setFetchingTransactions] = React.useState(false);
  const [connectingBank, setConnectingBank] = React.useState(false);

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: years,
    },
    theme: {
      mode: state?.theme,
      palette: 'palette1',
      monochrome: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: showLabels,
      formatter: function (val, opts) {
        val = Math.trunc(val);

        if (val < 0) return `-$${numberWithCommas(Math.abs(val))}`;
        return `$${numberWithCommas(val)}`;
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          val = Math.trunc(val);

          if (val < 0) return `-$${numberWithCommas(Math.abs(val))}`;

          return `$${numberWithCommas(val)}`;
        },
      },
    },
  };
  function numberWithCommas(x) {
    if (!x) return;
    x = Math.trunc(x);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function isFutureProjections() {
    if (chartType === 'FutureProjections') return 'outlined';
    return 'text';
  }

  function isPreviousBalances() {
    if (chartType === 'PreviousBalances') return 'outlined';
    return 'text';
  }

  async function fetchTransactions() {
    setFetchingTransactions(true);
    const response = await fetch('/api/transactions', { method: 'GET' });
    const data = await response.json();
    console.log('data', data);
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

  console.log('transactions', stateTransactions);

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

  function isConnectingBank() {
    switch (connectingBank) {
      case true: {
        return <App />;
      }
      case false: {
        return (
          <Button
            variant="contained"
            onClick={() => setConnectingBank(true)}
            style={{ width: '12rem', height: '1.5rem', marginLeft: '0.5rem' }}
          >
            Fetch Transactions
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
        height: '25rem',
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
          onClick={() => setChartType('FutureProjections')}
        >
          Future Projections
        </Button>
        <Button
          variant={isPreviousBalances()}
          onClick={() => setChartType('PreviousBalances')}
        >
          Previous Balances
        </Button>
      </div>

      <Chart
        options={options}
        series={data}
        type="line"
        width="100%"
        height="300rem"
      />
      <div className="display-row" style={{ justifyContent: 'space-between' }}>
        <div className="display-row">
          {!showLabels ? (
            <Button
              variant="contained"
              style={{ width: '9rem', height: '1.5rem' }}
              onClick={() => setShowLabels(true)}
            >
              show labels
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ width: '9rem', height: '1.5rem' }}
              onClick={() => setShowLabels(false)}
            >
              hide labels
            </Button>
          )}
          {chartType === 'PreviousBalances' ? (
            <div>
              {statePlaid?.accessToken &&
              state?.id !== 123 &&
              !statePlaid?.tokenExpired
                ? fetchTransactionsButton()
                : (!statePlaid?.accessToken &&
                    state?.id !== 123 &&
                    state?.id) ||
                  statePlaid?.tokenExpired
                ? isConnectingBank()
                : null}
            </div>
          ) : null}
        </div>

        {chartType === 'FutureProjections' ? (
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
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                  marginRight: '1rem',
                }}
                onClick={() => setMonthsToAdd(monthsToAdd + 12)}
              >
                <ArrowBackIcon />
              </div>

              {monthsToAdd > 0 ? (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => setMonthsToAdd(monthsToAdd - 12)}
                >
                  <ArrowForwardIcon />
                </div>
              ) : (
                <div style={{ cursor: 'pointer' }}>
                  <ArrowForwardIcon style={{ color: 'gray' }} />
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Scenarios />
          <NewScenario />
        </div>
      </div>
    </Paper>
  );
}
