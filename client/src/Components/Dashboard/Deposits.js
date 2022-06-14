import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { setUser } from '../../Store/User';
import { Context } from '../ContextProvider';
import supabase from '../../client';
import CssBaseline from '@mui/material/CssBaseline';

export default function Deposits({ HOABalance, setHOABalance, user }) {
  let [HOABalanceField, setHOABalanceField] = React.useState(0);
  let { state, dispatch } = React.useContext(Context);

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  async function updateBalance(newBalance) {
    await supabase
      .from('HOAs')
      .update([{ balance: +newBalance }])
      .eq('id', user?.id);
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row' }}
      xs={12}
      sm={8}
      md={5}
    >
      <CssBaseline />
      <div>
        <Title>Current HOA Balance</Title>
        <Typography component="h1" variant="h5">
          ${HOABalance}
        </Typography>
        <CurrencyInput
          id="input-example"
          name="input-name"
          prefix="$"
          placeholder="Please enter a number"
          decimalsLimit={2}
          style={{
            height: '2rem',
            fontSize: '1rem',
            backgroundColor: '#121212',
            color: 'white',
          }}
          onValueChange={(value) => setHOABalanceField(value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => {
            setHOABalance(numberWithCommas(HOABalanceField));
            dispatch(setUser({ ...state, HOABalance: HOABalanceField }));
            updateBalance(HOABalanceField);
          }}
        >
          Update Balance
        </Button>
      </div>
    </div>
  );
}
