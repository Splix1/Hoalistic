import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import './Units.css';
import CreateUnits from './CreateUnit';

const mdTheme = createTheme();

function Units() {
  const [creatingUnit, setCreatingUnit] = useState(false);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            backgroundColor: creatingUnit ? 'gray' : 'white',
          }}
        >
          {creatingUnit ? (
            <CreateUnits
              setCreatingUnit={setCreatingUnit}
              creatingUnit={creatingUnit}
            />
          ) : null}
          {!creatingUnit ? (
            <Button
              variant="contained"
              sx={{ top: 50 }}
              onClick={() => setCreatingUnit(!creatingUnit)}
            >
              Create Unit
            </Button>
          ) : null}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Units;
