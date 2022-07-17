import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import DeletingCost from './DeletingCost';
import { Context } from '../ContextProvider';
import { setCosts } from '../../Store/Costs';
import EditCost from './EditCost';

const mdTheme = createTheme();

export default function SingleCost({ theCost }) {
  let { name, cost } = theCost;

  let [deletingCost, setDeletingCost] = useState(false);
  let { state, stateCosts, dispatchCosts } = useContext(Context);

  async function deleteCost() {
    let { data } = await supabase
      .from('HOA_costs')
      .delete()
      .eq('id', theCost?.id);

    dispatchCosts(
      setCosts(stateCosts.filter((cost) => cost.id !== data[0].id))
    );
  }

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'fit-content',
          justifyContent: 'flex-start',
        }}
      >
        <div className="single-cost">
          <Typography sx={{ fontSize: '1.5rem' }}>
            Name: {theCost?.name}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Cost: ${numberWithCommas(theCost?.cost)}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Occurrence: {theCost?.occurrence}
          </Typography>

          <div className="display-row">
            <EditCost currentCost={theCost} />
            <Button
              variant="contained"
              onClick={() => setDeletingCost(true)}
              style={{ marginRight: '1rem', marginTop: '1rem' }}
            >
              delete
            </Button>
          </div>
        </div>

        {deletingCost ? (
          <DeletingCost
            setDeletingCost={setDeletingCost}
            deleteCost={deleteCost}
          />
        ) : null}
      </Paper>
    </ThemeProvider>
  );
}
