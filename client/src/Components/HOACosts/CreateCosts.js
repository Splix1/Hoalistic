import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Title from '../Dashboard/Title';
import TextField from '@mui/material/TextField';
import { Context } from '../ContextProvider';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import { setCosts } from '../../Store/Costs';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OccurrenceMenu from './OccurrenceMenu';
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

export default function CreateCost() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateCosts, dispatchCosts } = React.useContext(Context);
  const [name, setName] = React.useState(null);
  const [cost, setCost] = React.useState(null);
  const [occurrence, setOccurrence] = React.useState('monthly');
  const [exitColor, setExitColor] = React.useState('white');

  async function createCost() {
    if (!name) {
      alert('A name for your project is required!');
      return;
    }
    let { data: costData } = await supabase.from('HOA_costs').insert({
      name,
      cost,
      occurrence,
      HOA: state?.id,
    });

    dispatchCosts(setCosts([...stateCosts, costData[0]]));
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
        Add Cost
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
            <Title>Cost Name</Title>
            <TextField
              required
              id="scenarioName"
              label="Cost Name"
              name="scenarioName"
              style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
              onChange={(evt) => setName(evt.target.value)}
            />

            <div className="display-column" style={{ alignItems: 'center' }}>
              <Title>Amount</Title>
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

            <div
              className="display-column"
              style={{ alignItems: 'center', marginTop: '0.5rem' }}
            >
              <Title>Occurrence</Title>
              <OccurrenceMenu
                occurrence={occurrence}
                setOccurrence={setOccurrence}
              />
            </div>

            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={createCost}
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
