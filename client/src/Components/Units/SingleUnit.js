import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import './Units.css';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';

const mdTheme = createTheme();

function SingleUnit({ creatingUnit, theUnit }) {
  let { dateMovedIn, monthly_assessment, tenant_name, unitID } = theUnit;
  let [newUnitID, setNewUnitID] = useState(unitID);
  let [tenantName, setTenantName] = useState(tenant_name);
  let [monthlyAssessment, setMonthlyAssessment] = useState(monthly_assessment);
  let [movedIn, setMovedIn] = useState(dateMovedIn);
  let [editingUnit, setEditingUnit] = useState(false);
  let [unit, setUnit] = useState(theUnit);

  function col() {
    return creatingUnit ? 'black' : 'white';
  }

  async function updateUnit() {
    if (!newUnitID || !monthlyAssessment || !tenantName || !movedIn) {
      alert('All fields must be fulfilled.');
      return;
    }
    let { data: updatedUnit, error } = await supabase
      .from('Units')
      .update({
        unitID: newUnitID,
        monthly_assessment: monthlyAssessment,
        tenant_name: tenantName,
        dateMovedIn: movedIn,
      })
      .eq('id', theUnit?.id);
    if (error) {
      alert('There was a problem updating this unit');
      return;
    }

    setUnit(updatedUnit[0]);
    setEditingUnit(false);
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'fit-content',
          justifyContent: 'flex-start',
          backgroundColor: creatingUnit ? 'white' : 'gray',
        }}
      >
        {!editingUnit ? (
          <div className="single-unit">
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Unit: {unit?.unitID}
            </Typography>
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Tenant Name: {unit?.tenant_name}
            </Typography>
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Monthly Assessment: ${unit?.monthly_assessment}
            </Typography>
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Date moved in: {unit?.dateMovedIn}
            </Typography>
            <div className="display-row">
              <Button variant="contained" onClick={() => setEditingUnit(true)}>
                edit
              </Button>
              <Button variant="contained">delete</Button>
            </div>
          </div>
        ) : (
          <div className="single-unit">
            <TextField
              required
              fullWidth
              id="unitNumber"
              label="Unit #"
              name="unitNumber"
              defaultValue={unit?.unitID}
              autoComplete="1A"
              className="editing-unit"
              onChange={(evt) => setNewUnitID(evt.target.value)}
            />
            <TextField
              required
              fullWidth
              id="name"
              label="Tenant Name"
              name="name"
              autoComplete="Jimmy"
              defaultValue={unit?.tenant_name}
              className="editing-unit"
              onChange={(evt) => setTenantName(evt.target.value)}
            />
            <CurrencyInput
              id="monthlyAssessment"
              name="monthlyAssessment"
              prefix="$"
              placeholder="Monthly Assessment"
              defaultValue={unit?.monthly_assessment}
              decimalsLimit={2}
              style={{ height: '3rem', fontSize: '1rem' }}
              onValueChange={(value) => setMonthlyAssessment(value)}
              className="editing-unit"
            />
            <TextField
              type={'date'}
              required
              fullWidth
              id="dateMovedIn"
              name="dateMovedIn"
              autoComplete="Jimmy"
              defaultValue={unit?.dateMovedIn}
              className="editing-unit"
              onChange={(evt) => setMovedIn(evt.target.value)}
            />
            <div className="display-row">
              <Button variant="contained" onClick={updateUnit}>
                Save
              </Button>
              <Button variant="contained" onClick={() => setEditingUnit(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Paper>
    </ThemeProvider>
  );
}

export default SingleUnit;
