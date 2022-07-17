import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import './Units.css';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import DeletingUnit from './DeletingUnit';
import { Context } from '../ContextProvider';
import { setUnits } from '../../Store/Units';
import EditUnit from './EditUnit';
import DeleteUnit from './DeletingUnit';
const dayjs = require('dayjs');

function SingleUnit({ theUnit }) {
  let [deletingUnit, setDeletingUnit] = useState(false);
  let { state } = useContext(Context);
  let [unitDate, setUnitDate] = useState(dayjs(theUnit?.dateMovedIn));

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
        <div className="single-unit">
          <Typography sx={{ fontSize: '1.5rem' }}>
            Unit: {theUnit?.unitID}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Tenant Name: {theUnit?.tenant_name}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Monthly Assessment: ${numberWithCommas(theUnit?.monthly_assessment)}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Date moved in:{' '}
            {`${unitDate?.$M + 1}/${unitDate?.$D}/${unitDate?.$y}`}
          </Typography>
          <div className="display-row">
            <EditUnit unit={theUnit} />
            <DeleteUnit unit={theUnit} />
          </div>
        </div>
      </Paper>
    </ThemeProvider>
  );
}

export default SingleUnit;
