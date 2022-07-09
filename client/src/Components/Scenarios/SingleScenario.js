import React, { useState, useContext } from 'react';
import Title from '../Dashboard/Title';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CurrencyInput from 'react-currency-input-field';
import { Context } from '../ContextProvider';
import Button from '@mui/material/Button';
import supabase from '../../client';
import { setScenarios } from '../../Store/Scenarios';

export default function SingleScenario({ scenario }) {
  const [specialDateO, setSpecialDateO] = useState(
    scenario?.specialDate ? new Date(scenario.specialDate) : null
  );
  const [changeDateO, setChangeDateO] = useState(
    scenario.changeDate ? new Date(scenario.changeDate) : null
  );
  const [editingScenario, setEditingScenario] = useState(false);
  const [newName, setNewName] = useState(scenario?.name);
  const [specialAmount, setSpecialAmount] = useState(scenario?.specialAmount);
  const [specialDate, setSpecialDate] = useState(scenario?.specialDate);
  const [changeAmount, setChangeAmount] = useState(scenario?.changeAmount);
  const [changeDate, setChangeDate] = useState(scenario?.changeDate);
  const { state, stateScenarios, dispatchScenarios } = useContext(Context);

  async function updateScenario() {
    if (!newName) {
      alert('Name is required!');
      return;
    }

    let { data, error } = await supabase
      .from('Scenarios')
      .update({
        name: newName,
        specialAmount,
        specialDate,
        changeAmount,
        changeDate,
      })
      .eq('HOA', state?.id);

    if (error) {
      alert('There was a problem updating this scenario.');
      return;
    }

    dispatchScenarios(
      setScenarios(
        stateScenarios.map((scen) => {
          if (scen.id === data[0].id) return data[0];
          return scen;
        })
      )
    );
    setEditingScenario(false);
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'fit-content',
        width: '75vh',
        marginBottom: '1rem',
      }}
    >
      {!editingScenario ? (
        <Title>{scenario?.name}</Title>
      ) : (
        <TextField
          required
          id="scenarioName"
          label="Scenario Name"
          name="scenarioName"
          defaultValue={scenario?.name}
          style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
          onChange={(evt) => setNewName(evt.target.value)}
        />
      )}

      {!scenario?.specialAmount ? null : (
        <div
          className="display-column"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Title>Special Assessment</Title>
          {!editingScenario ? (
            <Typography style={{ fontSize: '1.3rem' }}>
              {`$${scenario?.specialAmount} on ${specialDateO.getMonth() + 1}/${
                specialDateO.getDate() + 1
              }/${specialDateO.getFullYear()}`}
            </Typography>
          ) : (
            <div className="display-row">
              <CurrencyInput
                prefix="$"
                placeholder="Special Assessment Amount"
                decimalsLimit={2}
                defaultValue={scenario?.specialAmount}
                style={{
                  height: '3.5rem',
                  fontSize: '1rem',
                  color: state?.theme === 'light' ? '#121212' : 'white',
                  marginRight: '1rem',
                  backgroundColor:
                    state?.theme === 'light' ? 'white' : '#121212',
                }}
                onValueChange={(value) => setSpecialAmount(value)}
              />
              <TextField
                type={'date'}
                required
                fullWidth
                defaultValue={scenario?.specialDate}
                id="beginDate"
                name="beginDate"
                autoComplete="Jimmy"
                onChange={(evt) => setSpecialDate(evt.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {!scenario.changeAmount ? null : (
        <div
          className="display-column"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Title>Assessments Change</Title>
          {!editingScenario ? (
            <Typography style={{ fontSize: '1.3rem' }}>
              {`$${scenario?.changeAmount} beginning ${
                changeDateO?.getMonth() + 1
              }/${changeDateO.getDate() + 1}/${changeDateO.getFullYear()}`}
            </Typography>
          ) : (
            <div className="display-row">
              <CurrencyInput
                prefix="%"
                placeholder="Change Assessments By %"
                decimalsLimit={0}
                defaultValue={scenario?.changeAmount}
                style={{
                  height: '3.5rem',
                  fontSize: '1rem',
                  color: state?.theme === 'light' ? '#121212' : 'white',
                  marginRight: '1rem',
                  backgroundColor:
                    state?.theme === 'light' ? 'white' : '#121212',
                }}
                onValueChange={(value) => setChangeAmount(value)}
              />
              <TextField
                type={'date'}
                required
                fullWidth
                defaultValue={scenario?.changeDate}
                id="beginDate"
                name="beginDate"
                autoComplete="Jimmy"
                onChange={(evt) => setChangeDate(evt.target.value)}
              />
            </div>
          )}
        </div>
      )}
      <div className="display-row" style={{ marginTop: '1rem' }}>
        {!editingScenario ? (
          <Button
            variant="contained"
            style={{ marginRight: '1rem' }}
            onClick={() => setEditingScenario(true)}
          >
            edit
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{ marginRight: '1rem' }}
            onClick={updateScenario}
          >
            save
          </Button>
        )}

        {!editingScenario ? (
          <Button variant="contained">delete</Button>
        ) : (
          <Button variant="contained" onClick={() => setEditingScenario(false)}>
            cancel
          </Button>
        )}
      </div>
    </Paper>
  );
}
