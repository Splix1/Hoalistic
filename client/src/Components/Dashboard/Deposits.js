import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <React.Fragment>
      <Title>Recurrenting Payments</Title>
      <Typography component="p" variant="h4">
        $insert number
      </Typography>
    </React.Fragment>
  );
}
