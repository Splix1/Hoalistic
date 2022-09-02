import React, { useContext } from 'react';
import { Context } from '../ContextProvider';
import Title from '../Dashboard/Title';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';

export default function BasicInfo() {
  let { state } = useContext(Context);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 550,
      }}
    >
      <div style={{ marginTop: '2rem' }}>
        {' '}
        <Title>
          <Typography sx={{ fontSize: '2rem', marginBottom: '1rem' }}>
            {state?.name}
          </Typography>
        </Title>
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#90caf9',
                }}
              >
                Built in
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#90caf9',
                }}
              >
                Email
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#90caf9',
                }}
              >
                Street Address
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#90caf9',
                }}
              >
                City, State & ZIP
              </Typography>
            </div>
            <div>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                }}
              >
                {state?.estYearBuilt}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                }}
              >
                {state?.email}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                }}
              >
                {state?.address}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                }}
              >
                {state?.city}, {state?.state} {state?.zip}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}
