import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { setUser } from '../../Store/User';
import { Context } from '../ContextProvider';
import supabase from '../../client';
import CssBaseline from '@mui/material/CssBaseline';
import App from '../../Plaid/App';
import { setPlaid } from '../../Store/Plaid';
const dayjs = require('dayjs');

export default function Deposits({
  generateChartData,
  HOABalance,
  user,
  generatePreviousBalances,
  chartType,
}) {
  let [HOABalanceField, setHOABalanceField] = React.useState(0);
  let { state, dispatch, statePlaid, dispatchPlaid } =
    React.useContext(Context);
  let [fetchingBalance, setFetchingBalance] = React.useState(false);
  let [inputType, setInputType] = React.useState('manual');

  async function updateBalance(newBalance) {
    let { data: updatedBalance, error: updatedBalanceError } = await supabase
      .from('HOAs')
      .update([{ balance: +newBalance }])
      .eq('id', user?.id);

    dispatch(setUser({ ...state, balance: updatedBalance[0]?.balance }));
    if (chartType === 'FutureProjections') {
      generateChartData(updatedBalance[0]);
    } else {
      generatePreviousBalances(updatedBalance[0]);
    }
  }

  async function fetchBalance() {
    setFetchingBalance(true);
    const response = await fetch('/api/accounts', { method: 'GET' });
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
    let newBalance = data?.accounts?.reduce((balance, account) => {
      balance += account?.balances?.available;
      return balance;
    }, 0);
    setFetchingBalance(false);
    updateBalance(newBalance);
  }

  function updateFromBankButton() {
    switch (fetchingBalance) {
      case false: {
        return (
          <Button
            fullWidth
            variant="contained"
            style={{ marginBottom: '1rem' }}
            onClick={fetchBalance}
          >
            Update From Bank
          </Button>
        );
      }
      case true: {
        return (
          <Button
            fullWidth
            variant="contained"
            style={{ marginBottom: '1rem' }}
            disabled
          >
            Fetching balances...
          </Button>
        );
      }
    }
  }

  function isManualSelected() {
    if (inputType === 'manual') return 'outlined';
    return 'text';
  }

  function isBankSelected() {
    if (inputType === 'bank') return 'outlined';
    return 'text';
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <CssBaseline />
      <div className="display-column">
        <Title>Current HOA Balance</Title>
        <Typography component="h1" variant="h5">
          ${HOABalance || 0}
        </Typography>
        <div
          className="display-row"
          style={{ justifyContent: 'space-around', marginTop: '1rem' }}
        >
          <Button
            variant={isManualSelected()}
            onClick={() => setInputType('manual')}
          >
            Manual
          </Button>
          <Button
            variant={isBankSelected()}
            onClick={() => setInputType('bank')}
          >
            Bank
          </Button>
        </div>

        {inputType === 'manual' ? (
          <div style={{ marginTop: '1rem' }}>
            <CurrencyInput
              id="input-example"
              name="input-name"
              prefix="$"
              placeholder="Please enter a number"
              decimalsLimit={2}
              style={{
                height: '2rem',
                fontSize: '1rem',
                color: state?.theme === 'light' ? '#121212' : 'white',
                backgroundColor: state?.theme === 'light' ? 'white' : '#121212',
              }}
              onValueChange={(value) => setHOABalanceField(value)}
            />
            <Button
              fullWidth
              variant="contained"
              style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
              onClick={() => {
                dispatch(setUser({ ...state, balance: HOABalanceField }));
                updateBalance(HOABalanceField);
              }}
            >
              Update Balance
            </Button>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {statePlaid?.accessToken ? updateFromBankButton() : <App />}
          </div>
        )}
      </div>
    </div>
  );
}
