import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import supabase from '../../client';
import CurrencyInput from 'react-currency-input-field';

const mdTheme = createTheme();

export default function CreateCosts({
  setCreatingCost,

  newCost,
}) {
  let [cost, setCost] = useState(0);
  let [costName, setCostName] = useState('');

  async function createCost() {
    if (cost < 0) {
      alert('Cost cannot be negative!');
      return;
    }

    let { email } = supabase.auth.user();
    const user = await supabase.from('HOAs').select('*').eq('email', email);
    let { data: costData } = await supabase.from('HOA_costs').insert({
      name: costName,
      cost: cost,
      HOA: user.data[0].id,
    });
    newCost(costData[0]);
    setCreatingCost(false);
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Typography component="h1" variant="h4" sx={{ color: 'white' }}>
        Create Cost
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
                    id="costName"
                    label="Cost Name"
                    name="costName"
                    autoComplete="1A"
                    onChange={(evt) => setCostName(evt.target.value)}
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
                    onValueChange={(value) => setCost(value)}
                  />
                </Grid>
              </div>
            </Paper>
            <div id="form-input">
              <Button variant="contained" onClick={createCost}>
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={() => setCreatingCost(false)}
              >
                Cancel
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
