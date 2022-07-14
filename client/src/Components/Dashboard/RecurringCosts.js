import React, { useContext } from 'react';
import Title from './Title';
import { Context } from '../ContextProvider';
import CreateCost from '../../Components/HOACosts/CreateCosts';

export default function RecurringCosts() {
  let { stateCosts } = useContext(Context);

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
