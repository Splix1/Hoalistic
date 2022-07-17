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
import { setFiles } from '../../Store/Files';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
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

export default function DeleteDocument({ theDocument }) {
  let { state, stateDocuments, dispatchDocuments, stateFiles, dispatchFiles } =
    useContext(Context);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [exitColor, setExitColor] = React.useState('white');

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

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        style={{
          marginTop: '1rem',
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
      >
        Delete
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

            <div className="display-column">
              <Typography sx={{ fontSize: '1.5rem' }}>
                Delete {theDocument?.name}?
              </Typography>
              <div id="form-input" style={{ marginTop: '1rem' }}>
                <Button
                  variant="contained"
                  style={{ marginRight: '1rem', marginTop: '1rem' }}
                  onClick={deleteDocument}
                >
                  Confirm
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpen(false)}
                  style={{ marginRight: '1rem', marginTop: '1rem' }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
