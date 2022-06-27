import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import supabase, { storage } from '../../client';
import { Context } from '../ContextProvider';
import ProjectList from './ProjectList';
import { setDocuments } from '../../Store/Documents';

export default function CreateDocument({ setCreatingDocument, documents }) {
  let [documentName, setDocumentName] = useState('');
  let { state, stateDocuments, dispatchDocuments } = useContext(Context);
  let [file, setFile] = useState(null);
  let [description, setDescription] = useState('');
  let [project, setProject] = useState(null);
  let [uploading, setUploading] = useState(false);

  async function createDocument() {
    if (!file) {
      alert('File is required!');
      return;
    }
    if (!documentName) {
      alert('Document name is required!');
      return;
    }
    setUploading(true);
    const { error } = await supabase.storage
      .from(`${state?.id}`)
      .upload(`${documentName}`, file);
    if (error) {
      alert('There was a problem uploading your file. Please try again.');
      return;
    }

    const { publicURL } = storage.storage
      .from(`${state?.id}`)
      .getPublicUrl(documentName);
    const { data: documentData } = await supabase.from('Documents').insert({
      name: documentName,
      description: description,
      project: project?.id || null,
      relatedToProject: project?.id ? true : false,
      HOA: state?.id,
      url: publicURL,
    });

    setUploading(false);
    dispatchDocuments(setDocuments([...stateDocuments, documentData[0]]));
    setCreatingDocument(false);
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <CssBaseline />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 'fit-content',
                justifyContent: 'flex-start',
              }}
            >
              <Typography component="h1" variant="h4" sx={{ color: '#90caf9' }}>
                Add Document
              </Typography>
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
                            accept="image/*, video/mp4,video/x-m4v,video/*, audio/*, .mkv, .pdf, .doc, .docx"
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
                  <Grid item xs={12} sm={6}>
                    <ProjectList project={project} setProject={setProject} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {!uploading ? null : <Typography>Uploading...</Typography>}
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
