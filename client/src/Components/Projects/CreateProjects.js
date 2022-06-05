import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import supabase from '../../client';
import CurrencyInput from 'react-currency-input-field';
import LightOrDark from '../LightOrDark';

const mdTheme = createTheme();

function CreateProjects({ setCreatingProject, creatingProject, newProject }) {
  let [projectCost, setProjectCost] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const projectName = data.get('projectName');

    if (projectCost < 0) {
      alert('Project cost cannot be negative!');
      return;
    }
    const beginDate = data.get('beginDate');

    let { email } = supabase.auth.user();
    const user = await supabase.from('HOAs').select('*').eq('email', email);
    let { data: unitData } = await supabase.from('Projects').insert({
      name: projectName,
      cost: projectCost,
      HOA: user.data[0].id,
      begin_date: beginDate,
    });
    newProject(unitData[0]);
    setCreatingProject(false);
  }

  return (
    <ThemeProvider theme={LightOrDark()}>
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Typography component="h1" variant="h4" sx={{ color: 'white' }}>
          Create Unit
        </Typography>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: 240,
                  justifyContent: 'flex-start',
                }}
              >
                <div id="form-inputs">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="projectName"
                      label="Project Name"
                      name="projectName"
                      autoComplete="1A"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CurrencyInput
                      id="projectCost"
                      name="projectCost"
                      prefix="$"
                      placeholder="Project Cost"
                      defaultValue={0}
                      decimalsLimit={2}
                      style={{ height: '3rem', fontSize: '1rem' }}
                      onValueChange={(value) => setProjectCost(value)}
                    />
                  </Grid>
                </div>
                <div id="form-inputs">
                  <Grid item xs={24} sm={12}>
                    <TextField
                      type={'date'}
                      required
                      fullWidth
                      id="beginDate"
                      name="beginDate"
                      autoComplete="Jimmy"
                    />
                  </Grid>
                </div>
              </Paper>
              <div id="form-input">
                <Button variant="contained" type="submit">
                  Submit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setCreatingProject(false)}
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default CreateProjects;
