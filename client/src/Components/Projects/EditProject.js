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

export default function EditProject({ project }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateProjects, dispatchProjects } = React.useContext(Context);
  const [name, setName] = React.useState(project?.name);
  const [cost, setCost] = React.useState(project?.cost);
  const [begin_date, setBeginDate] = React.useState(project?.begin_date);
  const [exitColor, setExitColor] = React.useState('white');

  async function updateProject() {
    if (!name || !cost || !begin_date) {
      alert('All fields must be fulfilled.');
      return;
    }
    let { data: updatedProject, error } = await supabase
      .from('Projects')
      .update({
        name,
        cost,
        begin_date,
      })
      .eq('id', project?.id);
    if (error) {
      alert('There was a problem updating this project');
      return;
    }

    dispatchProjects(
      setProjects(
        stateProjects?.map((proj) => {
          if (proj.id === updatedProject[0].id) return updatedProject[0];
          return proj;
        })
      )
    );
    setOpen(false);
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
            <Title>Project Name</Title>
            <TextField
              required
              id="scenarioName"
              label="Project Name"
              name="scenarioName"
              defaultValue={project?.name}
              style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
              onChange={(evt) => setName(evt.target.value)}
            />

            <div className="display-column" style={{ alignItems: 'center' }}>
              <Title>Project Cost</Title>
              <CurrencyInput
                prefix="$"
                placeholder="Project Cost"
                decimalsLimit={2}
                defaultValue={project?.cost}
                style={{
                  height: '3.5rem',
                  fontSize: '1rem',
                  color: state?.theme === 'light' ? '#121212' : 'white',
                  marginRight: '1rem',
                  backgroundColor:
                    state?.theme === 'light' ? 'white' : '#121212',
                }}
                onValueChange={(value) => setCost(value)}
              />
            </div>

            <Title style={{ marginTop: '0.5rem' }}>Date</Title>
            <TextField
              type={'date'}
              required
              fullWidth
              id="beginDate"
              name="beginDate"
              autoComplete="Jimmy"
              defaultValue={project?.begin_date}
              style={{ width: 'fit-content' }}
              onChange={(evt) => setBeginDate(evt.target.value)}
            />

            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={updateProject}
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
