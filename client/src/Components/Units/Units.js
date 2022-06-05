import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import './Units.css';
import CreateUnits from './CreateUnit';
import SingleUnit from './SingleUnit';
import supabase from '../../client';
import LightOrDark from '../LightOrDark';

const mdTheme = createTheme();

function Units() {
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    async function fetchUnits() {
      let { email } = supabase.auth.user();
      const user = await supabase.from('HOAs').select('*').eq('email', email);
      let units = await supabase
        .from('Units')
        .select('*')
        .eq('HOA', user.data[0].id);
      setUnits(units.data);
    }
    fetchUnits();
  }, []);

  function newUnit(unit) {
    setUnits([...units, unit]);
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <ThemeProvider theme={LightOrDark()}>
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
          Units
        </Typography>
        {creatingUnit ? (
          <CreateUnits
            setCreatingUnit={setCreatingUnit}
            creatingUnit={creatingUnit}
            newUnit={newUnit}
          />
        ) : null}
        {!creatingUnit ? (
          <Button
            variant="contained"
            sx={{ top: 50 }}
            onClick={() => setCreatingUnit(!creatingUnit)}
          >
            Create Unit
          </Button>
        ) : null}
        <br />
        <br />
        <br />

        {units.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {units.map((unit) => (
                  <div key={unit.id}>
                    <SingleUnit
                      theUnit={unit}
                      creatingUnit={creatingUnit}
                      units={units}
                      setUnits={setUnits}
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

export default Units;
