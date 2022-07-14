import React, { useState, useContext } from 'react';
import Title from './Title';
import { TextField } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@mui/material';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import { setProjects } from '../../Store/Projects';
import CreateProject from '../Projects/CreateProjects';
const dayjs = require('dayjs');

export default function UpcomingProjects({ projects, user, setStateProjects }) {
  let [creatingProject, setCreatingProject] = useState(false);
  let [projectName, setProjectName] = useState('');
  let [projectDate, setProjectDate] = useState('');
  let [projectCost, setProjectCost] = useState(0);
  let { dispatchProjects, stateProjects } = useContext(Context);

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <div>
      <Title>Upcoming Projects</Title>
      <CreateProject />
      {projects.map((project) => {
        let projectDate = dayjs(project.begin_date);

        return (
          <div key={project.id} className="budget-item">
            <h4>
              {project.name}: ${numberWithCommas(project.cost)} <br />
              Begin:{' '}
              {`${projectDate.$M + 1}/${projectDate.$D}/${projectDate.$y}`}
            </h4>
          </div>
        );
      })}
    </div>
  );
}
