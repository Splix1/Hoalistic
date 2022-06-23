import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Context } from '../ContextProvider';
import CreateDocument from './CreateDocument';

const mdTheme = createTheme();
export default function Documents() {
  const [costs, setCosts] = useState([]);
  const [user, setUser] = useState({});
  const [creatingDocument, setCreatingDocument] = useState(false);
  let { state } = useContext(Context);

  useEffect(() => {
    async function fetchCosts() {
      let { email } = supabase.auth.user();
      let { data: userData } = await supabase
        .from('HOAs')
        .select('*')
        .eq('email', email);
      setUser(userData[0]);
      let { data: CostsData, error } = await supabase
        .from('HOA_costs')
        .select('*')
        .eq('HOA', userData[0].id);
      setCosts(CostsData);
    }
    fetchCosts();
  }, []);

  function newDocument(cost) {
    setCosts([...costs, cost]);
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
          Documents
        </Typography>
        {creatingDocument ? (
          <CreateDocument
            setCreatingDocument={setCreatingDocument}
            creatingcost={creatingDocument}
            newDocument={newDocument}
          />
        ) : null}
        {!creatingDocument ? (
          <Button
            variant="contained"
            sx={{ top: 50 }}
            onClick={() => setCreatingDocument(!creatingDocument)}
          >
            Create Document
          </Button>
        ) : null}
        <br />
        <br />
        <br />

        {costs.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {costs.map((cost) => (
                  <div key={cost.id}>
                    {/* <SingleCost
                      theCost={cost}
                      creatingDocument={creatingDocument}
                      costs={costs}
                      setCosts={setCosts}
                    /> */}
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
