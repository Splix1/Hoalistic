import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import SingleProject from './SingleProject';
import CreateProjects from './CreateProjects';
import { Context } from '../ContextProvider';
import { setProjects } from '../../Store/Projects';

const mdTheme = createTheme();
export default function Projects() {
  const [user, setUser] = useState({});
  const [creatingProject, setCreatingProject] = useState(false);
  let { state, stateProjects, dispatchProjects } = useContext(Context);

  function newProject(project) {
    dispatchProjects(setProjects([...stateProjects, project]));
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <br />
        <Typography component="h1" variant="h4" sx={{ color: '#90caf9' }}>
          Projects
        </Typography>
        {creatingProject ? (
          <CreateProjects
            setCreatingProject={setCreatingProject}
            creatingProject={creatingProject}
            newProject={newProject}
          />
        ) : null}
        {!creatingProject ? (
          <Button
            variant="contained"
            sx={{ top: 50 }}
            onClick={() => setCreatingProject(!creatingProject)}
          >
            Create Project
          </Button>
        ) : null}
        <br />
        <br />
        <br />

        {stateProjects?.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {stateProjects.map((project) => (
                  <div key={project.id}>
                    <SingleProject
                      theProject={project}
                      creatingProject={creatingProject}
                    />
                    <br />
                  </div>
                ))}
              </Grid>
            </Grid>
          </Container>
        ) : null}
      </Box>
    </ThemeProvider>
  );
}
