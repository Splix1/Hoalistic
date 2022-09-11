import React from 'react';
import './stepOne.css';

const StepOne = () => {
  return (
    <div className="stepOne stack">
      <div className="header stack">
        <h1>Add your units, projects and any costs you may have!</h1>
      </div>
      <div className="create-container stack">
        <div className="start-text">
          <div className="start-header">
            <h3>Add a unit </h3>
          </div>
          <div className="start-content">
            <h3>Fill out a simple form to add any of the units you own!</h3>
          </div>
        </div>
        <div className="create-img">
          <img className="proj-form-img" src="addUnit.png" alt="" />
        </div>
      </div>
      <div className="create-container stack">
        <div className="start-text">
          <div className="start-header">
            <h3>Add a project </h3>
          </div>
          <div className="start-content">
            <h3>Fill out a simple form to add any projects for your units!</h3>
          </div>
        </div>
        <div className="create-img">
          <img className="proj-form-img" src="addProject.png" alt="" />
        </div>
      </div>

      <div className="create-container stack">
        <div className="start-text">
          <div className="start-header">
            <h3>Add a cost </h3>
          </div>
          <div className="start-content">
            <h3>Fill out a simple form to keep track of all of your costs!</h3>
          </div>
        </div>
        <div className="create-img">
          <img className="proj-form-img" src="addCost.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default StepOne;
