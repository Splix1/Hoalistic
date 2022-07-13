import React, { useState, useContext } from 'react';
import Title from './Title';
import { TextField } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@mui/material';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import { setProjects } from '../../Store/Projects';
const dayjs = require('dayjs');

export default function UpcomingProjects({ projects, user, setStateProjects }) {
  let [creatingProject, setCreatingProject] = useState(false);
  let [projectName, setProjectName] = useState('');
  let [projectDate, setProjectDate] = useState('');
  let [projectCost, setProjectCost] = useState(0);
  let { dispatchProjects, stateProjects } = useContext(Context);

  async function createProject() {
    if (projectName === '' || projectCost === 0 || projectDate === '') {
      alert('All fields are required!');
      return;
    }
    let { data } = await supabase.from('Projects').insert({
      name: projectName,
      cost: projectCost,
      begin_date: projectDate,
      HOA: user.id,
    });
    setStateProjects([...projects, data[0]]);
    dispatchProjects(setProjects([...projects, data[0]]));
    setCreatingProject(false);
  }

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <div>
      <Title>Upcoming Projects</Title>
      {creatingProject ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            required
            id="name"
            label="Project Name"
            name="name"
            autoComplete="Jimmy"
            onChange={(evt) => setProjectName(evt.target.value)}
            style={{ marginBottom: '0.5rem' }}
          />
          <TextField
            type={'date'}
            required
            fullWidth
            id="dateMovedIn"
            name="dateMovedIn"
            autoComplete="Jimmy"
            onChange={(evt) => setProjectDate(evt.target.value)}
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
            onValueChange={(value) => setProjectCost(value)}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: '0.5rem',
            }}
          >
            <Button variant="contained" onClick={() => createProject()}>
              Add Project
            </Button>
            <Button
              variant="contained"
              onClick={() => setCreatingProject(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outlined" onClick={() => setCreatingProject(true)}>
          Add a Project
        </Button>
      )}

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
