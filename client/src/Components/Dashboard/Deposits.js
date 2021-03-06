import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { setUser } from '../../Store/User';
import { Context } from '../ContextProvider';
import supabase from '../../client';
import CssBaseline from '@mui/material/CssBaseline';
import Scenarios from '../Scenarios/Scenarios';
import NewScenario from '../Scenarios/NewScenario';

export default function Deposits({ generateChartData, HOABalance, user }) {
  let [HOABalanceField, setHOABalanceField] = React.useState(0);
  let { state, dispatch } = React.useContext(Context);

  async function updateBalance(newBalance) {
    let { data: updatedBalance } = await supabase
      .from('HOAs')
      .update([{ balance: +newBalance }])
      .eq('id', user?.id);
    generateChartData(updatedBalance[0]);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <CssBaseline />
      <div className="display-column" style={{ justifyContent: 'flex-start' }}>
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
            color: state?.theme === 'light' ? '#121212' : 'white',
            backgroundColor: state?.theme === 'light' ? 'white' : '#121212',
          }}
          onValueChange={(value) => setHOABalanceField(value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => {
            dispatch(setUser({ ...state, balance: HOABalanceField }));
            updateBalance(HOABalanceField);
          }}
        >
          Update Balance
        </Button>
        <NewScenario />
        <Scenarios />
      </div>
    </div>
  );
}
