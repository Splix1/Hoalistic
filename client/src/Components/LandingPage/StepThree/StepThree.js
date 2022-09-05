import React from 'react';
import './stepThree.scss';

const StepThree = () => {
  return (
    <div className="stepThree">
      <div className="stepThree-header">
        <h1>Start tracking your budgets!</h1>
      </div>
      <div className="single-project-container">
        <div className="single-project-text">
          <div className="single-project-header">
            <h3>All set? Chart time!</h3>
          </div>
          <div className="single-project-content">
            <h3>
              Simply go to the dashboard and update your balance manually or
              letting Plaid do it for you. After you're done, use the chart to
              view your future projections or allow Plaid to fetch your
              transaction history and see it visually!
            </h3>
          </div>
        </div>
        <div className="single-project-img">
          <img src="viewProjections.png" alt="" />
        </div>
      </div>
      <div className="single-project-container">
        <div className="single-project-text">
          <div className="single-project-header">
            <h3>Imagine new scenarios!</h3>
          </div>
          <div className="single-project-content">
            <h3>
              Create new scenarios adjusting the monthly assessments or creating
              one-time payments and see a new plot on the chart!
            </h3>
          </div>
        </div>
        <div className="single-project-img">
          <img src="scenario.png" alt="" />
        </div>
      </div>

      <div className="repo-form-container"></div>
    </div>
  );
};

export default StepThree;
