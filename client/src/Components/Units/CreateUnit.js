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
import { setUnits } from '../../Store/Units';
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

export default function CreateUnit() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateUnits, dispatchUnits } = React.useContext(Context);
  const [tenant_name, setTenantName] = React.useState('');
  const [monthly_assessment, setMonthlyAssessment] = React.useState(null);
  const [unitID, setUnitID] = React.useState(null);
  const [dateMovedIn, setDateMovedIn] = React.useState(null);
  const [exitColor, setExitColor] = React.useState('white');

  async function createUnit() {
    if (!tenant_name) {
      alert('A name for your unit is required!');
      return;
    }
    let { data: unitData } = await supabase.from('Units').insert({
      tenant_name,
      monthly_assessment,
      unitID,
      HOA: state?.id,
      dateMovedIn,
    });

    dispatchUnits(setUnits([...stateUnits, unitData[0]]));
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
        Add Unit
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
            <Title>Unit ID</Title>
            <TextField
              required
              id="scenarioName"
              label="Unit #"
              name="scenarioName"
              style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
              onChange={(evt) => setUnitID(evt.target.value)}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <div className="display-column" style={{ alignItems: 'center' }}>
                <Title>Monthly Assessment</Title>
                <FormControl sx={{ m: 1 }} style={{ width: '14.6rem' }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    value={monthly_assessment}
                    defaultValue={0}
                    type="number"
                    onChange={(evt) => setMonthlyAssessment(evt.target.value)}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    label="Amount"
                  />
                </FormControl>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
              }}
            >
              <div className="display-column" style={{ alignItems: 'center' }}>
                <Title>Tenant Name</Title>
                <TextField
                  required
                  id="scenarioName"
                  label="Tenant Name"
                  name="scenarioName"
                  style={{ marginRight: '1rem' }}
                  onChange={(evt) => setTenantName(evt.target.value)}
                />
              </div>
              <div className="disply-column" style={{ alignItems: 'center' }}>
                <Title>Date Moved In</Title>
                <TextField
                  type={'date'}
                  required
                  fullWidth
                  id="beginDate"
                  name="beginDate"
                  autoComplete="Jimmy"
                  onChange={(evt) => setDateMovedIn(evt.target.value)}
                />
              </div>
            </div>
            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={createUnit}
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
