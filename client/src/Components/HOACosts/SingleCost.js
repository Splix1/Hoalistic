import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { Typography, Button } from '@mui/material';
import supabase from '../../client';
import DeletingCost from './DeletingCost';
import { Context } from '../ContextProvider';
import { setCosts } from '../../Store/Costs';
import EditCost from './EditCost';
import DeleteCost from './DeletingCost';

export default function SingleCost({ theCost }) {
  let { state } = useContext(Context);

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
            <DeleteCost currentCost={theCost} />
          </div>
        </div>
      </Paper>
    </ThemeProvider>
  );
}
