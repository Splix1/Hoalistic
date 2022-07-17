import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Title from '../Dashboard/Title';
import TextField from '@mui/material/TextField';
import { Context } from '../ContextProvider';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import { setProjects } from '../../Store/Projects';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

export default function DeleteProject({ project }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateProjects, dispatchProjects } = React.useContext(Context);
  const [name, setName] = React.useState(project?.name);
  const [cost, setCost] = React.useState(project?.cost);
  const [begin_date, setBeginDate] = React.useState(project?.begin_date);
  const [exitColor, setExitColor] = React.useState('white');

  async function deleteProject() {
    let { data } = await supabase
      .from('Projects')
      .delete()
      .eq('id', project?.id);
    dispatchProjects(
      setProjects(stateProjects.filter((project) => project.id !== data[0].id))
    );
  }

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        style={{
          width: 'fit-content',
          marginTop: '1rem',
          marginRight: '0.5rem',
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
                Delete {project?.name}?
              </Typography>
              <div id="form-input" style={{ marginTop: '1rem' }}>
                <Button
                  variant="contained"
                  style={{ marginRight: '1rem', marginTop: '1rem' }}
                  onClick={deleteProject}
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
