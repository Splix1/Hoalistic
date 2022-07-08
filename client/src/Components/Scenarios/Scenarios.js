import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { setScenarios } from '../../Store/Scenarios';
import { Context } from '../ContextProvider';
import Paper from '@mui/material/Paper';
import Title from '../Dashboard/Title';
import { Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65vw',
  height: '75vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default function Scenarios() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state, stateScenarios } = React.useContext(Context);
  const [exitColor, setExitColor] = React.useState('white');

  return (
    <div>
      <Button onClick={handleOpen} fullWidth variant="contained">
        Scenarios
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
          <Box id="scenarios" sx={style}>
            <IconButton
              onClick={() => setOpen(false)}
              onMouseEnter={() => setExitColor('red')}
              onMouseLeave={() => setExitColor('white')}
              style={{
                left: '34.9rem',
                bottom: '3rem',
                color: exitColor,
                position: 'relative',
                zIndex: 3,
              }}
            >
              <CloseIcon />
            </IconButton>
            <div
              id="scenarios"
              className="display-column"
              style={{
                overflow: 'scroll',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '2rem',
                  color: '#90caf9',
                  marginBottom: '1rem',
                }}
              >
                Scenarios
              </Typography>
              <div className="display-column">
                {stateScenarios?.map((scenario) => {
                  let specialDateO = scenario.specialDate
                    ? new Date(scenario.specialDate)
                    : null;
                  let changeDateO = scenario.changeDate
                    ? new Date(scenario.changeDate)
                    : null;

                  return (
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 'fit-content',
                        width: '75vh',
                        marginBottom: '1rem',
                      }}
                    >
                      <Title>{scenario?.name}</Title>

                      {!scenario?.specialAmount ? null : (
                        <div
                          className="display-column"
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Title>Special Assessment</Title>
                          <Typography style={{ fontSize: '1.3rem' }}>
                            {`$${scenario?.specialAmount} on ${
                              specialDateO.getMonth() + 1
                            }/${
                              specialDateO.getDate() + 1
                            }/${specialDateO.getFullYear()}`}
                          </Typography>
                        </div>
                      )}

                      {!scenario.changeAmount ? null : (
                        <div
                          className="display-column"
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Title>Assessments Change</Title>
                          <Typography style={{ fontSize: '1.3rem' }}>
                            {`$${scenario?.changeAmount} beginning ${
                              changeDateO?.getMonth() + 1
                            }/${
                              changeDateO.getDate() + 1
                            }/${changeDateO.getFullYear()}`}
                          </Typography>
                        </div>
                      )}
                    </Paper>
                  );
                })}
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
