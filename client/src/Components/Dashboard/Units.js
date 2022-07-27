import React, { useState, useContext } from 'react';
import Title from './Title';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import CreateUnit from '../Units/CreateUnit';
const dayjs = require('dayjs');

export default function Units({ monthlyAssessments }) {
  function numberWithCommas(x) {
    if (!x) return;

    x = Math.trunc(x);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return (
    <div>
      <Title>Units</Title>
      <CreateUnit />
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
