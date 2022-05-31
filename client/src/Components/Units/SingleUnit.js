import React, { useState, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import './Units.css';

const mdTheme = createTheme();

function SingleUnit({ creatingUnit, theUnit }) {
  let { dateMovedIn, monthly_assessment, tenant_name, unitID } = theUnit;

  function col() {
    return creatingUnit ? 'black' : 'white';
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 200,
          justifyContent: 'flex-start',
          backgroundColor: creatingUnit ? 'white' : 'gray',
        }}
      >
        <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
          Unit: {unitID}
        </Typography>
        <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
          Tenant Name: {tenant_name}
        </Typography>
        <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
          Monthly Assessment: ${monthly_assessment}
        </Typography>
        <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
          Date moved in: {dateMovedIn}
        </Typography>
      </Paper>
    </ThemeProvider>
  );
}

export default SingleUnit;
