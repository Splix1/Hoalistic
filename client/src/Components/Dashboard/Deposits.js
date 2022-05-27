import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Button, TextField } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { setUser } from '../../Store/User';
import { Context } from '../ContextProvider';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  let [HOABalance, setHOABalance] = React.useState(0);
  let [HOABalanceField, setHOABalanceField] = React.useState(0);
  let { state, dispatch } = React.useContext(Context);

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <React.Fragment>
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
        step
        style={{ height: '3rem', fontSize: '1rem' }}
        onValueChange={(value) => setHOABalanceField(numberWithCommas(value))}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => {
          setHOABalance(HOABalanceField);
          dispatch(setUser({ ...state, HOABalance: HOABalanceField }));
        }}
      >
        Update Balance
      </Button>
      <Button fullWidth variant="contained">
        Run Chart
      </Button>
    </React.Fragment>
  );
}
