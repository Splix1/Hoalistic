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

export default function EditUnit({ unit }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateUnits, dispatchUnits } = React.useContext(Context);
  const [tenant_name, setTenantName] = React.useState(unit?.tenant_name);
  const [monthly_assessment, setMonthlyAssessment] = React.useState(
    unit?.monthly_assessment
  );
  const [unitID, setUnitID] = React.useState(unit?.unitID);
  const [dateMovedIn, setDateMovedIn] = React.useState(unit?.dateMovedIn);
  const [exitColor, setExitColor] = React.useState('white');

  async function updateUnit() {
    if (
      !unitID ||
      !monthly_assessment ||
      !monthly_assessment ||
      !monthly_assessment
    ) {
      alert('All fields must be fulfilled.');
      return;
    }
    let { data: updatedUnit, error } = await supabase
      .from('Units')
      .update({
        unitID,
        monthly_assessment,
        tenant_name,
        dateMovedIn,
      })
      .eq('id', unit?.id);
    if (error) {
      alert('There was a problem updating this unit');
      return;
    }

    dispatchUnits(
      setUnits(
        stateUnits?.map((currentUnit) => {
          if (currentUnit.id === updatedUnit[0].id) return updatedUnit[0];
          return currentUnit;
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
        edit
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
              defaultValue={unit?.unitID}
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
                    defaultValue={unit?.monthly_assessment}
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
                  defaultValue={unit?.tenant_name}
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
                  defaultValue={unit?.dateMovedIn}
                  onChange={(evt) => setDateMovedIn(evt.target.value)}
                />
              </div>
            </div>
            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={updateUnit}
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
