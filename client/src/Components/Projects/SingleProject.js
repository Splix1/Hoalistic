import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Context } from '../ContextProvider';
import EditProject from './EditProject';
import DeleteProject from './DeletingProject';
const dayjs = require('dayjs');

export default function SingleProject({ theProject }) {
  let { state } = useContext(Context);
  let [projectDate] = useState(dayjs(theProject?.begin_date));

  function numberWithCommas(x) {
    if (!x) return;

    x = Math.trunc(x);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'fit-content',
          justifyContent: 'flex-start',
        }}
      >
        <div className="single-project">
          <Typography sx={{ fontSize: '1.5rem' }}>
            Name: {theProject?.name}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Cost: ${numberWithCommas(theProject?.cost)}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Begin Date:{' '}
            {`${projectDate?.$M + 1}/${projectDate?.$D}/${projectDate?.$y}`}
          </Typography>

          <div className="display-row">
            <EditProject project={theProject} />
            <DeleteProject project={theProject} />
          </div>
        </div>
      </Paper>
    </ThemeProvider>
  );
}
