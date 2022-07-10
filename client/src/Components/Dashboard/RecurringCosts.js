import React, { useState, useContext } from 'react';
import Title from './Title';
import { TextField } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@mui/material';
import supabase from '../../client';
import { Context } from '../ContextProvider';

export default function RecurringCosts({ user, setCosts }) {
  let [creatingCost, setCreatingCost] = useState(false);
  let [costName, setCostName] = useState('');
  let [costPrice, setCostPrice] = useState(0);
  let { dispatchCosts, stateCosts } = useContext(Context);

  async function createCost() {
    if (costName === '' || costPrice === 0) {
      alert('Name and price are required!');
      return;
    }
    let { data } = await supabase
      .from('HOA_costs')
      .insert({ name: costName, cost: costPrice, HOA: user.id });

    dispatchCosts(setCosts([...stateCosts, data[0]]));
    setCreatingCost(false);
  }

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <div>
      <Title>Recurring Costs</Title>
      {creatingCost ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            required
            id="name"
            label="Cost Name"
            name="name"
            autoComplete="Jimmy"
            onChange={(evt) => setCostName(evt.target.value)}
            style={{ marginBottom: '0.5rem' }}
          />
          <CurrencyInput
            id="input-example"
            name="input-name"
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
            onValueChange={(value) => setCostPrice(value)}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: '0.5rem',
            }}
          >
            <Button variant="contained" onClick={() => createCost()}>
              Add Cost
            </Button>
            <Button variant="contained" onClick={() => setCreatingCost(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outlined" onClick={() => setCreatingCost(true)}>
          Add a Monthly Cost
        </Button>
      )}
      {stateCosts.map((cost) => (
        <h4 key={cost.id} className="budget-item" style={{ height: '2rem' }}>
          {cost.name}: ${numberWithCommas(cost.cost)}
        </h4>
      ))}
    </div>
  );
}
