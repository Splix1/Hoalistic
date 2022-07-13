import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import supabase, { storage } from '../../client';
import { Context } from '../ContextProvider';
import ProjectList from './ProjectList';
import Grid from '@mui/material/Grid';
import { setFiles } from '../../Store/Files';
import { setDocuments } from '../../Store/Documents';
import DeletingDocument from './DeletingDocument';
const dayjs = require('dayjs');

export default function SingleDocument({ theDocument }) {
  let { name, description } = theDocument;
  let [newName, setNewName] = useState(name);
  let [newDescription, setNewDescription] = useState(description);
  let [editingDocument, setEditingDocument] = useState(false);
  let [deletingDocument, setDeletingDocument] = useState(false);
  let { state, stateFiles, dispatchFiles, stateDocuments, dispatchDocuments } =
    useContext(Context);
  let [url, setUrl] = useState('');
  let [project, setProject] = useState(null);
  let [fileType, setFileType] = useState('');
  let [newFile, setNewFile] = useState(null);
  let [documentDate, setDocumentDate] = useState(
    dayjs(theDocument?.created_at)
  );

  useEffect(() => {
    async function fetchProject() {
      let { data } = await supabase
        .from('Projects')
        .select('*')
        .eq('id', theDocument?.project);
      setProject(data[0]);
    }
    if (theDocument?.project) fetchProject();

    let file = stateFiles?.filter(
      (currentFile) => currentFile.name === theDocument?.name
    );
    if (file[0]) setFileType(file[0].metadata.mimetype);

    const { publicURL } = storage.storage
      .from(`${state?.id}`)
      .getPublicUrl(theDocument?.name);
    setUrl(publicURL);
  }, [state]);

  async function updateDocument() {
    if (!newName) {
      alert('A name is required.');
      return;
    }

    if (newFile) {
      let { data: updatedFile, error: updateFileError } = await storage.storage
        .from(`${state?.id}`)
        .update(theDocument?.name, newFile, {
          cacheControl: '3600',
          upsert: false,
        });
    }

    if (newName !== theDocument?.name) {
      let { data, error: newFileName } = await storage.storage
        .from(`${state?.id}`)
        .move(theDocument?.name, newName);
      if (newFileName) {
        alert('There was a problem updating this file.');
        return;
      }
    }
    const { publicURL } = storage.storage
      .from(`${state?.id}`)
      .getPublicUrl(newName);
    let { data: updatedDocument, error: documentError } = await supabase
      .from('Documents')
      .update({
        name: newName,
        description: newDescription,
        url: publicURL,
      })
      .eq('id', theDocument?.id);

    dispatchDocuments(
      setDocuments(
        stateDocuments.map((document) => {
          if (document.id === updatedDocument[0].id) return updatedDocument[0];
          return document;
        })
      )
    );

    if (newFile) {
      alert(
        'New file uploaded! The link is updated but the display may take a few minutes to update.'
      );
    }
    setEditingDocument(false);
  }

  async function deleteDocument() {
    const { data: deletedFile, error } = await storage.storage
      .from(`${state?.id}`)
      .remove([`${theDocument?.name}`]);

    if (error) {
      alert('There was a problem deleting this file.');
      return;
    }

    const { data: deletedDocument } = await supabase
      .from('Documents')
      .delete()
      .eq('id', theDocument?.id);

    dispatchDocuments(
      setDocuments(
        stateDocuments.filter(
          (document) => document.id !== deletedDocument[0].id
        )
      )
    );
    const { data: storageFiles } = await storage.storage
      .from(`${state?.id}`)
      .list();
    dispatchFiles(setFiles(storageFiles));
  }

  async function downloadFile(theDocument) {
    const { data, error } = await storage.storage
      .from(`${state?.id}`)
      .download(`${theDocument.name}`);
    const b = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = b;
    link.setAttribute(
      'download',
      `${theDocument.name}.${data.type.split('/')[1]}`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'fit-content',
          width: '950px',
        }}
      >
        {!editingDocument ? (
          <div
            className="single-cost"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: '1.5rem' }}>
              {theDocument?.name} -{' '}
              <a href={url} target="_blank">
                Open file
              </a>
            </Typography>
            <Typography sx={{ fontSize: '1.5rem' }}>
              {`${documentDate?.$M + 1}/${documentDate?.$D}/${
                documentDate?.$y
              }`}
            </Typography>
            {!theDocument?.description ? null : (
              <Typography sx={{ fontSize: '1.5rem' }}>
                {theDocument?.description}
              </Typography>
            )}
            {project ? (
              <Typography sx={{ fontSize: '1.5rem' }}>
                Project: {project?.name}
              </Typography>
            ) : null}
            {fileType?.includes('image') ? (
              <img src={url} width="911px" height="460px" />
            ) : (
              <embed src={url} height="460px" width="911px" />
            )}

            <div className="display-row">
              <Button
                variant="contained"
                onClick={() => setEditingDocument(true)}
                style={{ marginRight: '1rem', marginTop: '1rem' }}
              >
                edit
              </Button>
              <Button
                variant="contained"
                onClick={() => setDeletingDocument(true)}
                style={{ marginRight: '1rem', marginTop: '1rem' }}
              >
                delete
              </Button>

              <Button
                variant="contained"
                onClick={() => downloadFile(theDocument)}
                style={{ marginRight: '1rem', marginTop: '1rem' }}
              >
                download
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="single-cost"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TextField
              required
              fullWidth
              id="documentName"
              label="Document Name"
              name="documentName"
              defaultValue={theDocument?.name}
              autoComplete="Jimmy"
              className="editing-document"
              onChange={(evt) => setNewName(evt.target.value)}
            />
            <br />
            <TextField
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              defaultValue={theDocument?.description}
              autoComplete="Jimmy"
              className="editing-document"
              onChange={(evt) => setNewDescription(evt.target.value)}
            />
            <Grid item xs={12} sm={6} style={{ marginTop: '1rem' }}>
              <ProjectList project={project} setProject={setProject} />
            </Grid>

            <Grid item xs={12} sm={6}>
              {!newFile ? (
                <Button
                  variant="contained"
                  component="label"
                  style={{ marginTop: '1rem' }}
                >
                  Upload File{' '}
                  <input
                    type="file"
                    accept="image/*, video/mp4,video/x-m4v,video/*, audio/*, .mkv, .pdf, .doc, .docx"
                    hidden
                    onChange={(evt) => setNewFile(evt.target.files[0])}
                  />
                </Button>
              ) : (
                <Typography>{`${newFile?.name} - ${newFile?.type}`}</Typography>
              )}
            </Grid>

            <div className="display-row">
              <Button
                variant="contained"
                onClick={updateDocument}
                style={{ marginRight: '1rem', marginTop: '1rem' }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={() => {
                  setEditingDocument(false);
                  setNewFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {deletingDocument ? (
          <DeletingDocument
            setDeletingDocument={setDeletingDocument}
            deleteDocument={deleteDocument}
          />
        ) : null}
      </Paper>
    </ThemeProvider>
  );
}
