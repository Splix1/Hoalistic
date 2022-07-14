import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import SingleCost from './SingleCost';
import CreateCosts from './CreateCosts';
import { Context } from '../ContextProvider';
import { setCosts } from '../../Store/Costs';
import CreateCost from './CreateCosts';

const mdTheme = createTheme();
export default function HOACosts() {
  const [creatingCost, setCreatingCost] = useState(false);
  let { state, stateCosts, dispatchCosts } = useContext(Context);

  function newCost(cost) {
    dispatchCosts(setCosts([...stateCosts, cost]));
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
        <CreateCost />

        {stateCosts?.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {stateCosts.map((cost) => (
                  <div key={cost.id}>
                    <SingleCost theCost={cost} creatingCost={creatingCost} />
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
