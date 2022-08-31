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
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';

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

function formatNumber(num) {
  return `$${num}`;
}

export default function CreateProject() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateProjects, dispatchProjects } = React.useContext(Context);
  const [name, setName] = React.useState(null);
  const [cost, setCost] = React.useState(0);
  const [begin_date, setBeginDate] = React.useState(null);
  const [exitColor, setExitColor] = React.useState('white');

  async function createProject() {
    if (!name) {
      alert('A name for your project is required!');
      return;
    }
    let { data: projectData } = await supabase.from('Projects').insert({
      name,
      cost,
      HOA: state?.id,
      begin_date,
    });

    dispatchProjects(setProjects([...stateProjects, projectData[0]]));
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
        }}
      >
        Add Project
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
              style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
              onChange={(evt) => setName(evt.target.value)}
            />

            <div className="display-column" style={{ alignItems: 'center' }}>
              <Title>Project Cost</Title>

              <FormControl sx={{ m: 1 }} style={{ width: '14.6rem' }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Amount
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  value={cost}
                  defaultValue={0}
                  type="number"
                  onChange={(evt) => setCost(evt.target.value)}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
            </div>

            <Title style={{ marginTop: '0.5rem' }}>Date</Title>
            <TextField
              type={'date'}
              required
              fullWidth
              id="beginDate"
              name="beginDate"
              autoComplete="Jimmy"
              style={{ width: 'fit-content' }}
              onChange={(evt) => setBeginDate(evt.target.value)}
            />

            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={createProject}
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
