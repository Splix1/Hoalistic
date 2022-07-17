import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import supabase, { storage } from '../../client';
import { Context } from '../ContextProvider';
import ProjectList from './ProjectList';
import { setDocuments } from '../../Store/Documents';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Title from '../Dashboard/Title';
import Box from '@mui/material/Box';

const dayjs = require('dayjs');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65vw',
  height: 'fit-content',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function EditDocument({ theDocument, project }) {
  let { name, description } = theDocument;
  let [newName, setNewName] = useState(name);
  let { state, stateDocuments, dispatchDocuments } = useContext(Context);
  let [newFile, setNewFile] = useState(null);
  let [newDescription, setNewDescription] = useState(description);
  let [uploading, setUploading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [exitColor, setExitColor] = React.useState('white');
  let [documentDate, setDocumentDate] = useState(
    dayjs(theDocument?.created_at)
  );

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

    setNewFile(null);
    setOpen(false);
  }

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        style={{
          marginTop: '1rem',
          marginLeft: '0.5rem',
        }}
      >
        Edit
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <IconButton
              onClick={() => setOpen(false)}
              id="x"
              onMouseEnter={() => setExitColor('red')}
              onMouseLeave={() => setExitColor('white')}
              style={{
                color: exitColor,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Title>Name</Title>
            <TextField
              required
              id="documentName"
              label="Document Name"
              name="documentName"
              defaultValue={theDocument?.name}
              autoComplete="Jimmy"
              className="editing-document"
              onChange={(evt) => setNewName(evt.target.value)}
            />

            <div
              className="display-column"
              style={{ alignItems: 'center', marginBottom: '1rem' }}
            >
              <Title>File</Title>
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
            </div>

            <div className="display-column" style={{ alignItems: 'center' }}>
              <Title>Description</Title>
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
            </div>

            <div
              className="display-column"
              style={{ alignItems: 'center', marginTop: '0.5rem' }}
            >
              <Title>Project</Title>
              <ProjectList project={project} />
            </div>

            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={updateDocument}
              >
                Finish
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpen(false)}
                style={{ marginRight: '1rem', marginTop: '1rem' }}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
