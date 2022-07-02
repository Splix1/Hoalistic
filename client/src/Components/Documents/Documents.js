import React, { useState, useEffect, useContext } from 'react';
import supabase, { storage } from '../../client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Context } from '../ContextProvider';
import CreateDocument from './CreateDocument';
import SingleDocument from './SingleDocument';

export default function Documents() {
  const [creatingDocument, setCreatingDocument] = useState(false);
  let { state, stateDocuments } = useContext(Context);

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
          />
        ) : null}
        {!creatingDocument ? (
          <Button
            variant="contained"
            sx={{ top: 50 }}
            onClick={() => setCreatingDocument(!creatingDocument)}
          >
            Add Document
          </Button>
        ) : null}
        <br />
        <br />
        <br />

        {stateDocuments.length > 0 ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                {stateDocuments.map((document, i) => (
                  <div key={document.id}>
                    <SingleDocument
                      theDocument={document}
                      creatingDocument={creatingDocument}
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
