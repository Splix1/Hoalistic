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
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import './Units.css';
import supabase from '../../client';
import { Context } from '../ContextProvider';

const mdTheme = createTheme();

function CreateUnits({ setCreatingUnit, creatingUnit, newUnit }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const unitNumber = data.get('unitNumber');
    const monthlyAssessment = data.get('monthlyAssessment');
    if (monthlyAssessment < 0) {
      alert('Monthly Assessment cannot be negative!');
      return;
    }
    const dateMovedIn = data.get('dateMovedIn');
    const name = data.get('name');
    let { email } = supabase.auth.user();
    const user = await supabase.from('HOAs').select('*').eq('email', email);
    let { data: unitData } = await supabase.from('Units').insert({
      tenant_name: name,
      monthly_assessment: monthlyAssessment,
      unitID: unitNumber,
      HOA: user.data[0].id,
      dateMovedIn: dateMovedIn,
    });
    await supabase.from('Tenants').insert({ name, unit: unitNumber });
    console.log('unitData', unitData);
    newUnit(unitData[0]);
    setCreatingUnit(false);
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: creatingUnit ? 'gray' : 'white',
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
                      id="unitNumber"
                      label="Unit #"
                      name="unitNumber"
                      autoComplete="1A"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type={'number'}
                      required
                      fullWidth
                      id="monthlyAssessment"
                      label="Monthly Assessment"
                      name="monthlyAssessment"
                      autoComplete="dollar"
                    />
                  </Grid>
                </div>
                <div id="form-inputs">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type={'date'}
                      required
                      fullWidth
                      id="dateMovedIn"
                      name="dateMovedIn"
                      autoComplete="Jimmy"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Tenant Name"
                      name="name"
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
                  onClick={() => setCreatingUnit(false)}
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

export default CreateUnits;
