import React, { useState, useContext } from 'react';
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
import { Context } from '../ContextProvider';

const mdTheme = createTheme();

export default function CreateCosts({ setCreatingCost, newCost }) {
  let [cost, setCost] = useState(0);
  let [costName, setCostName] = useState('');
  let { state } = useContext(Context);

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
    <ThemeProvider theme={state?.mdTheme}>
      <CssBaseline />
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
              <Typography component="h1" variant="h4" sx={{ color: '#90caf9' }}>
                Create Cost
              </Typography>
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
                    style={{
                      height: '3rem',
                      fontSize: '1rem',
                      backgroundColor: '#121212',
                      color: 'white',
                    }}
                    onValueChange={(value) => setCost(value)}
                  />
                </Grid>
              </div>
            </Paper>
            <div id="form-input">
              <Button
                variant="contained"
                onClick={createCost}
                style={{ marginRight: '1rem', marginTop: '1rem' }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={() => setCreatingCost(false)}
                style={{ marginRight: '1rem', marginTop: '1rem' }}
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
