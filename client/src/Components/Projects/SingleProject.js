import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import DeletingProject from './DeletingProject';

const mdTheme = createTheme();

export default function SingleProject({
  creatingProject,
  theProject,
  projects,
  setProjects,
}) {
  let { name, cost, begin_date } = theProject;
  let [newName, setNewName] = useState(name);
  let [newCost, setNewCost] = useState(cost);
  let [newBeginDate, setNewBeginDate] = useState(begin_date);
  let [editingProject, setEditingProject] = useState(false);
  let [project, setProject] = useState(theProject);
  let [deletingProject, setDeletingProject] = useState(false);

  function col() {
    return creatingProject ? 'black' : 'white';
  }

  async function updateProject() {
    if (!newName || !newCost || !newBeginDate) {
      alert('All fields must be fulfilled.');
      return;
    }
    let { data: updatedProject, error } = await supabase
      .from('Projects')
      .update({
        name: newName,
        cost: newCost,
        begin_date: newBeginDate,
      })
      .eq('id', theProject?.id);
    if (error) {
      alert('There was a problem updating this project');
      return;
    }

    setProject(updatedProject[0]);
    setEditingProject(false);
  }

  async function deleteProject() {
    let { data } = await supabase
      .from('Projects')
      .delete()
      .eq('id', project?.id);
    setProjects(projects.filter((project) => project.id !== data[0].id));
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'fit-content',
          justifyContent: 'flex-start',
          backgroundColor: creatingProject ? 'white' : 'gray',
        }}
      >
        {!editingProject ? (
          <div className="single-project">
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Name: {project?.name}
            </Typography>
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Cost: ${numberWithCommas(project?.cost)}
            </Typography>
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Begin Date: {project?.begin_date}
            </Typography>

            <div className="display-row">
              <Button
                variant="contained"
                onClick={() => setEditingProject(true)}
              >
                edit
              </Button>
              <Button
                variant="contained"
                onClick={() => setDeletingProject(true)}
              >
                delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="single-project">
            <TextField
              required
              fullWidth
              id="projectName"
              label="Project Name"
              name="projectName"
              defaultValue={project?.name}
              autoComplete="Jimmy"
              className="editing-unit"
              onChange={(evt) => setNewName(evt.target.value)}
            />
            <br />
            <CurrencyInput
              id="projectCost"
              name="projectCost"
              prefix="$"
              placeholder="Project Cost"
              defaultValue={project?.cost}
              decimalsLimit={2}
              style={{ height: '3rem', fontSize: '1rem' }}
              onValueChange={(value) => setNewCost(value)}
              className="editing-project"
            />
            <br />
            <TextField
              type={'date'}
              required
              fullWidth
              id="beginDate"
              label="Begin Date"
              name="beginDate"
              autoComplete="Jimmy"
              defaultValue={project?.begin_date}
              className="editing-project"
              onChange={(evt) => setNewBeginDate(evt.target.value)}
            />

            <div className="display-row">
              <Button variant="contained" onClick={updateProject}>
                Save
              </Button>
              <Button
                variant="contained"
                onClick={() => setEditingProject(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {deletingProject ? (
          <DeletingProject
            setDeletingProject={setDeletingProject}
            deleteProject={deleteProject}
          />
        ) : null}
      </Paper>
    </ThemeProvider>
  );
}
