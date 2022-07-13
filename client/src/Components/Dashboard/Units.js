import React, { useState, useContext } from 'react';
import Title from './Title';
import { TextField } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@mui/material';
import supabase from '../../client';
import { Context } from '../ContextProvider';
const dayjs = require('dayjs');

export default function Units({
  monthlyAssessments,
  user,
  setMonthlyAssessments,
  setUnits,
}) {
  let [creatingUnit, setCreatingUnit] = useState(false);
  let [unitID, setUnitID] = useState(null);
  let [unitAssessment, setUnitAssessment] = useState(0);
  let [unitMovedIn, setUnitMovedIn] = useState('');
  let [unitTenantName, setUnitTenantName] = useState('');
  let { stateUnits, dispatchUnits } = useContext(Context);

  async function createUnit() {
    if (
      unitAssessment === 0 ||
      unitID === '' ||
      unitMovedIn === '' ||
      unitTenantName === ''
    ) {
      alert('All fields are required!');
      return;
    }
    let { data: unitData } = await supabase.from('Units').insert({
      tenant_name: unitTenantName,
      monthly_assessment: unitAssessment,
      unitID: unitID,
      HOA: user.id,
      dateMovedIn: unitMovedIn,
    });
    setMonthlyAssessments([...monthlyAssessments, unitData[0]]);
    dispatchUnits(setUnits([...stateUnits, unitData[0]]));
    setCreatingUnit(false);
  }
  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return (
    <div>
      <Title>Units</Title>
      {creatingUnit ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            required
            id="unitID"
            label="Unit ID"
            name="unitID"
            autoComplete="Jimmy"
            onChange={(evt) => setUnitID(evt.target.value)}
            style={{ marginBottom: '0.5rem' }}
          />

          <CurrencyInput
            id="unitAssessment"
            name="unitAssessment"
            prefix="$"
            placeholder="Please enter a number"
            defaultValue={0}
            decimalsLimit={2}
            style={{
              height: '3rem',
              fontSize: '1rem',
              backgroundColor: '#121212',
              color: 'white',
              marginBottom: '0.5rem',
            }}
            onValueChange={(value) => setUnitAssessment(value)}
          />
          <TextField
            type={'date'}
            required
            fullWidth
            id="dateMovedIn"
            name="dateMovedIn"
            autoComplete="Jimmy"
            onChange={(evt) => setUnitMovedIn(evt.target.value)}
            style={{ marginBottom: '0.5rem' }}
          />
          <TextField
            required
            fullWidth
            id="tenantName"
            name="tenantName"
            label="Tenant Name"
            autoComplete="Jimmy"
            style={{ marginBottom: '0.5rem' }}
            onChange={(evt) => setUnitTenantName(evt.target.value)}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: '0.5rem',
            }}
          >
            <Button variant="contained" onClick={() => createUnit()}>
              Add Unit
            </Button>
            <Button variant="contained" onClick={() => setCreatingUnit(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outlined" onClick={() => setCreatingUnit(true)}>
          Add a Unit
        </Button>
      )}
      {monthlyAssessments.map((assessment) => {
        let assessmentDate = dayjs(assessment.dateMovedIn);
        return (
          <h4
            key={assessment.id}
            className="budget-item"
            style={{ height: 'fit-content' }}
          >
            {assessment.unitID}
            <br />
            {assessment.tenant_name}: $
            {numberWithCommas(assessment.monthly_assessment)}
            <br />
            Moved in:{' '}
            {`${assessmentDate.$M + 1}/${assessmentDate.$D}/${
              assessmentDate.$y
            }`}
          </h4>
        );
      })}
    </div>
  );
}
