import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase, { storage } from '../../client';
import { Context } from '../ContextProvider';
import { NavLink } from 'react-router-dom';

const mdTheme = createTheme();

export default function SingleDocument({
  creatingDocument,
  theDocument,
  theStorageDocument,
  documents,
  setDocuments,
  files,
}) {
  let { name, description } = theDocument;
  let [newName, setNewName] = useState(name);
  let [newDescription, setNewDescription] = useState(description);
  let [editingDocument, setEditingDocument] = useState(false);
  let [currentDocument, setCurrentDocument] = useState(theDocument);
  let [deletingDocument, setDeletingDocument] = useState(false);
  let { state } = useContext(Context);
  let [url, setUrl] = useState('');
  let [project, setProject] = useState(null);
  let [fileType, setFileType] = useState('');

  useEffect(() => {
    async function fetchProject() {
      let { data } = await supabase
        .from('Projects')
        .select('*')
        .eq('id', theDocument?.project);
      setProject(data[0]);
    }
    if (theDocument?.project) fetchProject();
    let file = files?.filter(
      (currentFile) => currentFile.name === theDocument?.name
    );
    if (file[0]) setFileType(file[0].metadata.mimetype);

    const { publicURL } = storage.storage
      .from(`${state?.id}`)
      .getPublicUrl(theDocument?.name);
    setUrl(publicURL);
  }, []);

  //   async function updateCost() {
  //     if (!newName || !newCost) {
  //       alert('All fields must be fulfilled.');
  //       return;
  //     }
  //     let { data: updatedCost, error } = await supabase
  //       .from('HOA_costs')
  //       .update({
  //         name: newName,
  //         cost: newCost,
  //       })
  //       .eq('id', theDocument?.id);
  //     if (error) {
  //       alert('There was a problem updating this cost');
  //       return;
  //     }

  //     setCurrentDocument(updatedCost[0]);
  //     setEditingDocument(false);
  //   }

  //   async function deleteCost() {
  //     let { data } = await supabase
  //       .from('HOA_costs')
  //       .delete()
  //       .eq('id', theDocument?.id);
  //     setDocuments(documents.filter((cost) => cost.id !== data[0].id));
  //   }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: '604px',
          width: '950px',
        }}
      >
        {!editingDocument ? (
          <div className="single-cost">
            <Typography sx={{ fontSize: '1.5rem' }}>
              {currentDocument?.name} -{' '}
              <a href={url} target="_blank">
                Open file
              </a>
            </Typography>
            <Typography sx={{ fontSize: '1.5rem' }}>
              Description: {currentDocument?.description}
            </Typography>
            {project ? (
              <Typography sx={{ fontSize: '1.5rem' }}>
                Project: {project?.name}
              </Typography>
            ) : null}
            {fileType?.includes('image') ? (
              <img src={url} width="911px" />
            ) : fileType?.includes('video') ? null : (
              <embed src={url} height="460px" width="911px" />
            )}

            {/* <iframe
              data-src="https://www.youtube.com/embed/modXbqbsAvs?autoplay=1&amp;auto_play=true"
              frameborder="0"
              scrolling="no"
              allowfullscreen="true"
              allowtransparency="true"
              allow="autoplay; fullscreen"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-presentation"
              src="https://www.youtube.com/embed/modXbqbsAvs?autoplay=1&amp;auto_play=true"
            ></iframe> */}
            <div className="display-row">
              <Button
                variant="contained"
                onClick={() => setEditingDocument(true)}
              >
                edit
              </Button>
              <Button
                variant="contained"
                onClick={() => setDeletingDocument(true)}
              >
                delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="single-cost">
            <TextField
              required
              fullWidth
              id="documentName"
              label="Document Name"
              name="documentName"
              defaultValue={currentDocument?.name}
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
              defaultValue={currentDocument?.description}
              autoComplete="Jimmy"
              className="editing-document"
              onChange={(evt) => setNewDescription(evt.target.value)}
            />

            <div className="display-row">
              <Button variant="contained">Save</Button>
              <Button
                variant="contained"
                onClick={() => setEditingDocument(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {/* {deletingCost ? (
          <DeletingCost
            setDeletingCost={setDeletingCost}
            deleteCost={deleteCost}
          />
        ) : null} */}
      </Paper>
    </ThemeProvider>
  );
}
