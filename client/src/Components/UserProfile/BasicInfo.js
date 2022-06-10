import React, { useContext } from 'react';
import { Context } from '../ContextProvider';
import Title from '../Dashboard/Title';
import { Typography } from '@mui/material';

export default function BasicInfo() {
  let { state } = useContext(Context);

  return (
    <div>
      <Title>
        <Typography sx={{ fontSize: '2rem' }}>{state?.name}</Typography>
      </Title>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Built in {state?.estYearBuilt}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>{state?.email}</Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>{state?.address}</Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>
            {state?.city}, {state?.state} {state?.zip}
          </Typography>
        </div>
      </div>
    </div>
  );
}
