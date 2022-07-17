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

export default function EditCost({ currentCost }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateCosts, dispatchCosts } = React.useContext(Context);
  const [name, setName] = React.useState(currentCost?.name);
  const [cost, setCost] = React.useState(currentCost?.cost);
  const [occurrence, setOccurrence] = React.useState(currentCost?.occurrence);
  const [exitColor, setExitColor] = React.useState('white');

  async function updateCost() {
    if (!name || !cost) {
      alert('All fields must be fulfilled.');
      return;
    }
    let { data: updatedCost, error } = await supabase
      .from('HOA_costs')
      .update({
        name,
        cost,
        occurrence,
      })
      .eq('id', currentCost?.id);
    if (error) {
      alert('There was a problem updating this cost');
      return;
    }

    dispatchCosts(
      setCosts(
        stateCosts?.map((curCost) => {
          if (curCost.id === updatedCost[0].id) return updatedCost[0];
          return curCost;
        })
      )
    );
    setOpen(false);
  }

  return (
    <div>
      <Button
        onClick={handleOpen}
        fullWidth
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
            <Title>Cost Name</Title>
            <TextField
              required
              id="scenarioName"
              label="Cost Name"
              name="scenarioName"
              defaultValue={currentCost?.name}
              style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
              onChange={(evt) => setName(evt.target.value)}
            />

            <div className="display-column" style={{ alignItems: 'center' }}>
              <Title>Amount</Title>
              <CurrencyInput
                prefix="$"
                placeholder="Amount"
                decimalsLimit={2}
                defaultValue={currentCost?.cost}
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
                onClick={updateCost}
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
