import React, { useState, useEffect } from 'react';
import supabase from '../../client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import SingleProject from './SingleProject';

const mdTheme = createTheme();
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState({});
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      let { email } = supabase.auth.user();
      let { data: userData } = await supabase
        .from('HOAs')
        .select('*')
        .eq('email', email);
      setUser(userData[0]);
      let { data: projectsData, error } = await supabase
        .from('Projects')
        .select('*')
        .eq('HOA', userData[0].id);
      setProjects(projectsData);
    }
    fetchProjects();
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: creatingProject ? 'gray' : 'white',
        }}
      >
        <br />
        <Typography component="h1" variant="h4" sx={{ color: 'black' }}>
          Projects
        </Typography>
        {/* {creatingUnit ? (
          <CreateUnits
            setCreatingUnit={setCreatingUnit}
            creatingUnit={creatingUnit}
            newUnit={newUnit}
          />
        ) : null} */}
        {/* {!creatingUnit ? (
          <Button
            variant="contained"
            sx={{ top: 50 }}
            onClick={() => setCreatingUnit(!creatingUnit)}
          >
            Create Unit
          </Button>
        ) : null} */}
        <br />
        <br />
        <br />

        {projects.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {projects.map((project) => (
                  <div key={project.id}>
                    <SingleProject
                      theProject={project}
                      creatingProject={creatingProject}
                      projects={projects}
                      setProjects={setProjects}
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
