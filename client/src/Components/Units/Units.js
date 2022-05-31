import React, { useState, useEffect } from 'react';
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
import CreateUnits from './CreateUnit';
import SingleUnit from './SingleUnit';
import supabase from '../../client';

const mdTheme = createTheme();

function Units() {
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [user, setUser] = useState(null);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    async function fetchUnits() {
      let { email } = supabase.auth.user();
      const user = await supabase.from('HOAs').select('*').eq('email', email);
      setUser(user);
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

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: creatingUnit ? 'gray' : 'white',
        }}
      >
        <br />
        <Typography component="h1" variant="h4" sx={{ color: 'black' }}>
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
                  <div>
                    <SingleUnit theUnit={unit} creatingUnit={creatingUnit} />
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
