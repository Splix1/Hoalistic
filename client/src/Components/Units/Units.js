import React, { useState, useEffect, useContext } from 'react';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import './Units.css';
import CreateUnit from './CreateUnit';
import SingleUnit from './SingleUnit';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import { setUnits } from '../../Store/Units';

const mdTheme = createTheme();

function Units() {
  const [creatingUnit, setCreatingUnit] = useState(false);
  let { state, stateUnits, dispatchUnits } = useContext(Context);

  function newUnit(unit) {
    dispatchUnits(setUnits([...stateUnits, unit]));
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
        <CreateUnit />

        {stateUnits?.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {stateUnits.map((unit) => (
                  <div key={unit.id}>
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
