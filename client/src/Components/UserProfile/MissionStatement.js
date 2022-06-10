import React, { useContext } from 'react';
import { Context } from '../ContextProvider';
import Title from '../Dashboard/Title';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';

export default function MissionStatement() {
  let { state } = useContext(Context);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 500,
      }}
    >
      <Title>
        <Typography sx={{ fontSize: '2rem' }}>Mission Statement</Typography>
      </Title>
      <Typography sx={{ fontSize: '1.5rem' }}>
        {state?.missionStatement || 'You have no mission statement yet.'}
      </Typography>
    </Paper>
  );
}
