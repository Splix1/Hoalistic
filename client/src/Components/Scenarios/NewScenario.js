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
import { setScenarios } from '../../Store/Scenarios';

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

export default function NewScenario() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateScenarios, dispatchScenarios } =
    React.useContext(Context);
  const [name, setName] = React.useState('');
  const [specialDate, setSpecialDate] = React.useState(null);
  const [specialAmount, setSpecialAmount] = React.useState(null);
  const [changeAmount, setChangeAmount] = React.useState(null);
  const [changeDate, setChangeDate] = React.useState(null);

  async function createScenario() {
    if (!name) {
      alert('A name for your scenario is required!');
      return;
    }
    let { data: scenarioData } = await supabase.from('Scenarios').insert({
      name,
      specialDate,
      specialAmount,
      changeAmount,
      changeDate,
      HOA: state?.id,
    });

    dispatchScenarios(setScenarios([...stateScenarios, scenarioData[0]]));
    setOpen(false);
  }

  return (
    <div>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="contained"
        style={{ marginBottom: '0.5rem' }}
      >
        Add Scenario
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
            <Title>Scenario Name</Title>
            <TextField
              required
              id="scenarioName"
              label="Scenario Name"
              name="scenarioName"
              style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
              onChange={(evt) => setName(evt.target.value)}
            />

            <Title>Special Assessment</Title>
            <Typography style={{ fontStyle: 'italic' }}>
              special assessments are one time payments made by unit owners to
              the HOA
            </Typography>
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
              <div className="display-column">
                <Title>Amount</Title>
                <CurrencyInput
                  prefix="$"
                  placeholder="Special Assessment Amount"
                  decimalsLimit={2}
                  style={{
                    height: '3.5rem',
                    fontSize: '1rem',
                    color: state?.theme === 'light' ? '#121212' : 'white',
                    marginRight: '1rem',
                    backgroundColor:
                      state?.theme === 'light' ? 'white' : '#121212',
                  }}
                  onValueChange={(value) => setSpecialAmount(value)}
                />
              </div>
              <div className="display-column">
                <Title>Date</Title>
                <TextField
                  type={'date'}
                  required
                  fullWidth
                  id="beginDate"
                  name="beginDate"
                  autoComplete="Jimmy"
                  onChange={(evt) => setSpecialDate(evt.target.value)}
                />
              </div>
            </div>
            <Title>Change Monthly Assessments</Title>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
              }}
            >
              <div className="display-column">
                <Title>% Change</Title>
                <CurrencyInput
                  prefix="%"
                  placeholder="Change Assessments By %"
                  decimalsLimit={0}
                  style={{
                    height: '3.5rem',
                    fontSize: '1rem',
                    color: state?.theme === 'light' ? '#121212' : 'white',
                    marginRight: '1rem',
                    backgroundColor:
                      state?.theme === 'light' ? 'white' : '#121212',
                  }}
                  onValueChange={(value) => setChangeAmount(value)}
                />
              </div>
              <div className="disply-column">
                <Title>Begin Date</Title>
                <TextField
                  type={'date'}
                  required
                  fullWidth
                  id="beginDate"
                  name="beginDate"
                  autoComplete="Jimmy"
                  onChange={(evt) => setChangeDate(evt.target.value)}
                />
              </div>
            </div>
            <div id="form-input" style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                style={{ marginRight: '1rem', marginTop: '1rem' }}
                onClick={createScenario}
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
