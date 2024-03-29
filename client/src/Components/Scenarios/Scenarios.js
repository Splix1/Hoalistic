import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Context } from '../ContextProvider';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SingleScenario from './SingleScenario';

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
      <Button
        onClick={handleOpen}
        fullWidth
        variant="contained"
        style={{ width: 'fit-content', height: '1.5rem' }}
      >
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
              id="x"
              onMouseEnter={() => setExitColor('red')}
              onMouseLeave={() => setExitColor('white')}
              style={{
                color: exitColor,
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
                width: '65vw',
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
                  return (
                    <SingleScenario scenario={scenario} key={scenario.id} />
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
