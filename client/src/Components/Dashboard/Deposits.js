import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { setUser } from '../../Store/User';
import { Context } from '../ContextProvider';
import supabase from '../../client';

export default function Deposits({
  generateChartData,
  HOABalance,
  setHOABalance,
  user,
}) {
  let [HOABalanceField, setHOABalanceField] = React.useState(0);
  let { state, dispatch } = React.useContext(Context);

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  async function updateBalance(newBalance) {
    let { data: updatedBalance } = await supabase
      .from('HOAs')
      .update([{ balance: +newBalance }])
      .eq('id', user?.id);
    generateChartData(updatedBalance[0]);
  }

  return (
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
        style={{ height: '2rem', fontSize: '1rem' }}
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
      <Button fullWidth variant="contained" onClick={generateChartData}>
        Run Chart
      </Button>
    </div>
  );
}
