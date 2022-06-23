import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import supabase, { storage } from '../../client';
import { Context } from '../ContextProvider';

export default function CreateDocument({
  setCreatingDocument,
  newDocument,
  storageData,
  setStorageData,
  documents,
  setDocuments,
}) {
  let [documentName, setDocumentName] = useState('');
  let { state } = useContext(Context);
  let [file, setFile] = useState(null);
  let [description, setDescription] = useState('');
  let [project, setProject] = useState(null);
  let [relatedToProject, setRelatedToProject] = useState(false);

  async function createDocument() {
    if (!file) {
      alert('File is required!');
      return;
    }
    if (!documentName) {
      alert('Document name is required!');
      return;
    }
    const { data: documentData, error: documentError } = await supabase
      .from('Documents')
      .insert({
        name: documentName,
        description: description,
        project: project,
        relatedToProject: relatedToProject,
        HOA: state?.id,
      });
    const { data, error } = await supabase.storage
      .from(`${state?.id}`)
      .upload(`${documentName}`, file);

    setDocuments([...documents, documentData[0]]);

    setCreatingDocument(false);
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <CssBaseline />
      <Typography component="h1" variant="h4" sx={{ color: '#90caf9' }}>
        Create Document
      </Typography>
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
              <div id="form-inputs">
                <div className="display-column">
                  <div className="display-row">
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="documentName"
                        label="Document Name"
                        name="documentName"
                        autoComplete="1A"
                        onChange={(evt) => setDocumentName(evt.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {!file ? (
                        <Button variant="contained" component="label">
                          Upload File{' '}
                          <input
                            type="file"
                            accept=".jpg, .png, .pdf, .doc"
                            hidden
                            onChange={(evt) => setFile(evt.target.files[0])}
                          />
                        </Button>
                      ) : (
                        <Typography>{`${file?.name} - ${file?.type}`}</Typography>
                      )}
                    </Grid>
                  </div>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      id="beginDate"
                      name="beginDate"
                      autoComplete="Jimmy"
                      onChange={(evt) => setDescription(evt.target.value)}
                    />
                  </Grid>
                </div>
              </div>
            </Paper>
            <div id="form-input">
              <Button variant="contained" onClick={createDocument}>
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={() => setCreatingDocument(false)}
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
