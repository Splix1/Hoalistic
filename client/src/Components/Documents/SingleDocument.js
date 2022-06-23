import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase, { storage } from '../../client';
import { Context } from '../ContextProvider';

const mdTheme = createTheme();

export default function SingleDocument({
  creatingDocument,
  theDocument,
  theStorageDocument,
  documents,
  setDocuments,
}) {
  let { name, description } = theDocument;
  let [newName, setNewName] = useState(name);
  let [newDescription, setNewDescription] = useState(description);
  let [editingDocument, setEditingDocument] = useState(false);
  let [currentDocument, setCurrentDocument] = useState(theDocument);
  let [deletingDocument, setDeletingDocument] = useState(false);
  let { state } = useContext(Context);
  let [url, setUrl] = useState('');

  useEffect(() => {
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
          height: 'fit-content',
          justifyContent: 'flex-start',
        }}
      >
        {!editingDocument ? (
          <div className="single-cost">
            <Typography sx={{ fontSize: '1.5rem' }}>
              Name: {currentDocument?.name}
            </Typography>
            <Typography sx={{ fontSize: '1.5rem' }}>
              {currentDocument?.description}
            </Typography>
            <Typography sx={{ fontSize: '1.5rem' }}>
              <a href={url} target="_blank">
                Open file
              </a>
            </Typography>

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
