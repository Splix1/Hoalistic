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

export default function CreateDocument() {
  let [documentName, setDocumentName] = useState('');
  let { state, stateDocuments, dispatchDocuments } = useContext(Context);
  let [file, setFile] = useState(null);
  let [description, setDescription] = useState('');
  let [project, setProject] = useState(null);
  let [uploading, setUploading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [exitColor, setExitColor] = React.useState('white');

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
    setFile(null);
    setOpen(false);
  }

  return (
    <div>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="outlined"
        style={{
          marginBottom: '0.5rem',
          width: 'fit-content',
          marginTop: '1rem',
        }}
      >
        Add Document
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
              id="scenarioName"
              label="Document Name"
              name="scenarioName"
              style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
              onChange={(evt) => setDocumentName(evt.target.value)}
            />

            <div
              className="display-column"
              style={{ alignItems: 'center', marginBottom: '1rem' }}
            >
              <Title>File</Title>
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
            </div>

            <div className="display-column" style={{ alignItems: 'center' }}>
              <Title>Description</Title>
              <TextField
                id="scenarioName"
                label="Description"
                name="scenarioName"
                style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
                onChange={(evt) => setDescription(evt.target.value)}
              />
            </div>

            <div
              className="display-column"
              style={{ alignItems: 'center', marginTop: '0.5rem' }}
            >
              <Title>Project</Title>
              <ProjectList project={project} setProject={setProject} />
            </div>

            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={createDocument}
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
