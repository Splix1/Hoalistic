import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Units.css';
import supabase from '../../client';
import CurrencyInput from 'react-currency-input-field';
import { Context } from '../ContextProvider';

const mdTheme = createTheme();

function CreateUnits({ setCreatingUnit, creatingUnit, newUnit }) {
  let [monthlyAssessment, setMonthlyAssessment] = useState(0);
  let { state } = useContext(Context);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const unitNumber = data.get('unitNumber');

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
    newUnit(unitData[0]);
    setCreatingUnit(false);
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
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
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{ color: '#90caf9' }}
                >
                  Create Unit
                </Typography>
                <div id="form-inputs">
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{ marginBottom: '0.5rem', marginRight: '0.5rem' }}
                  >
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
                    <CurrencyInput
                      id="monthlyAssessment"
                      name="monthlyAssessment"
                      prefix="$"
                      placeholder="Monthly Assessment"
                      defaultValue={0}
                      decimalsLimit={2}
                      style={{
                        height: '3rem',
                        fontSize: '1rem',
                        backgroundColor: '#121212',
                        color: 'white',
                      }}
                      onValueChange={(value) => setMonthlyAssessment(value)}
                    />
                  </Grid>
                </div>
                <div id="form-inputs">
                  <Grid item xs={12} sm={6} style={{ marginRight: '1rem' }}>
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
                <Button
                  variant="contained"
                  type="submit"
                  style={{ marginRight: '1rem', marginTop: '1rem' }}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setCreatingUnit(false)}
                  style={{ marginRight: '1rem', marginTop: '1rem' }}
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
