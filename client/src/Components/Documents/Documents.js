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
import SingleDocument from './SingleDocument';

export default function Documents() {
  const [costs, setCosts] = useState([]);
  const [creatingDocument, setCreatingDocument] = useState(false);
  let { state } = useContext(Context);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function fetchDocuments() {
      let { data, error } = await supabase
        .from('Documents')
        .select('*')
        .eq('HOA', state?.id);

      setDocuments(data);
    }
    fetchDocuments();
  }, []);

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
            creatingDocument={creatingDocument}
            setDocuments={setDocuments}
            documents={documents}
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

        {documents.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {documents.map((document, i) => (
                  <div key={document.id}>
                    <SingleDocument
                      theDocument={document}
                      creatingDocument={creatingDocument}
                      documents={documents}
                      setDocuments={setDocuments}
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
