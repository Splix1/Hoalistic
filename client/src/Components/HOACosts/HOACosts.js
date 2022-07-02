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

const mdTheme = createTheme();
export default function HOACosts() {
  const [costs, setStateCosts] = useState([]);
  const [creatingCost, setCreatingCost] = useState(false);
  let { state, stateCosts, dispatchCosts } = useContext(Context);
  console.log(stateCosts);
  useEffect(() => {
    setStateCosts(stateCosts);
  }, [stateCosts]);

  function newCost(cost) {
    setStateCosts([...costs, cost]);
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
        <Typography component="h1" variant="h4" sx={{ color: '90caf9' }}>
          Costs
        </Typography>
        {creatingCost ? (
          <CreateCosts
            setCreatingCost={setCreatingCost}
            creatingcost={creatingCost}
            newCost={newCost}
          />
        ) : null}
        {!creatingCost ? (
          <Button
            variant="contained"
            sx={{ top: 50 }}
            onClick={() => setCreatingCost(!creatingCost)}
          >
            Create Cost
          </Button>
        ) : null}
        <br />
        <br />
        <br />

        {costs?.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {costs.map((cost) => (
                  <div key={cost.id}>
                    <SingleCost
                      theCost={cost}
                      creatingCost={creatingCost}
                      costs={costs}
                      setStateCosts={setStateCosts}
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
