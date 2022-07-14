import React, { useState, useContext } from 'react';
import Title from './Title';
import { TextField } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@mui/material';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import CreateCost from '../../Components/HOACosts/CreateCosts';

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
      <CreateCost />
      {stateCosts.map((cost) => (
        <h4 key={cost.id} className="budget-item" style={{ height: '2rem' }}>
          {cost.name}: ${numberWithCommas(cost.cost)}
        </h4>
      ))}
    </div>
  );
}
