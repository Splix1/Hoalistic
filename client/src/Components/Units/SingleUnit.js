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
const dayjs = require('dayjs');

const mdTheme = createTheme();

function SingleUnit({ creatingUnit, theUnit }) {
  let [unit, setUnit] = useState(theUnit);
  let [deletingUnit, setDeletingUnit] = useState(false);
  let { state, stateUnits, dispatchUnits } = useContext(Context);
  let [unitDate, setUnitDate] = useState(dayjs(theUnit?.dateMovedIn));

  async function deleteUnit() {
    let { data } = await supabase.from('Units').delete().eq('id', unit?.id);
    dispatchUnits(
      setUnits(stateUnits.filter((unit) => unit.id !== data[0].id))
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
            <Button
              variant="contained"
              onClick={() => setDeletingUnit(true)}
              style={{ marginRight: '1rem', marginTop: '1rem' }}
            >
              delete
            </Button>
          </div>
        </div>

        {deletingUnit ? (
          <DeletingUnit
            setDeletingUnit={setDeletingUnit}
            deleteUnit={deleteUnit}
          />
        ) : null}
      </Paper>
    </ThemeProvider>
  );
}

export default SingleUnit;
