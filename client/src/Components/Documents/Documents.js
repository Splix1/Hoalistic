import React, { useState, useEffect, useContext } from 'react';
import supabase, { storage } from '../../client';
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
  const [bucket, setBucket] = useState();
  let { state } = useContext(Context);

  const [urls, setUrls] = useState(null);

  useEffect(() => {
    async function fetchDocuments() {
      let { data, error } = await storage.storage.from(`${state?.id}`).list();
      if (error) {
        alert('Unable to retrieve documents.');
        return;
      }

      let bucketUrls = [];
      for (let i = 0; i < data.length; i++) {
        let { publicURL, error: publicURLError } = supabase.storage
          .from(`${state?.id}`)
          .getPublicUrl(`${data[i].name}`);
        if (publicURLError) {
          alert(`Unable to retrieve URL for ${data[i].name}`);
          continue;
        }
        bucketUrls.push(publicURL);
      }

      setUrls(bucketUrls);
    }
    fetchDocuments();
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
