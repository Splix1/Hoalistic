import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import DeletingProject from './DeletingProject';
import { Context } from '../ContextProvider';
import { setProjects } from '../../Store/Projects';
import EditProject from './EditProject';
import DeleteProject from './DeletingProject';
const dayjs = require('dayjs');

const mdTheme = createTheme();

export default function SingleProject({ creatingProject, theProject }) {
  let { name, cost, begin_date } = theProject;
  let [newName, setNewName] = useState(name);
  let [newCost, setNewCost] = useState(cost);
  let [newBeginDate, setNewBeginDate] = useState(begin_date);
  let [editingProject, setEditingProject] = useState(false);
  let [project, setProject] = useState(theProject);
  let [deletingProject, setDeletingProject] = useState(false);
  let { state, stateProjects, dispatchProjects } = useContext(Context);
  let [projectDate, setProjectDate] = useState(dayjs(theProject?.begin_date));

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'fit-content',
          justifyContent: 'flex-start',
        }}
      >
        <div className="single-project">
          <Typography sx={{ fontSize: '1.5rem' }}>
            Name: {theProject?.name}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Cost: ${numberWithCommas(theProject?.cost)}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Begin Date:{' '}
            {`${projectDate?.$M + 1}/${projectDate?.$D}/${projectDate?.$y}`}
          </Typography>

          <div className="display-row">
            <EditProject project={theProject} />
            <DeleteProject project={theProject} />
          </div>
        </div>
      </Paper>
    </ThemeProvider>
  );
}
