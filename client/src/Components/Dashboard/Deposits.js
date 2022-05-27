import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Button, TextField } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  let [HOABalance, setHOABalance] = React.useState(0);
  let [HOABalanceField, setHOABalanceField] = React.useState(0);

  function numberWithCommas(x) {
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
        defaultValue={0}
        decimalsLimit={2}
        style={{ height: '3rem', fontSize: '1rem' }}
        onValueChange={(value) => setHOABalanceField(numberWithCommas(value))}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => setHOABalance(HOABalanceField)}
      >
        Update Balance
      </Button>
      <Button fullWidth variant="contained">
        Run Graph
      </Button>
    </React.Fragment>
  );
}
