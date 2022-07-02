import React from 'react';
import { Button } from '@mui/material';

export default function DeletingCost({ setDeletingCost, deleteCost }) {
  return (
    <div id="deleting-cost" style={{ marginTop: '0.5rem' }}>
      <Button
        variant="contained"
        onClick={deleteCost}
        style={{ marginRight: '0.5rem' }}
      >
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingCost(false)}>
        Cancel
      </Button>
    </div>
  );
}
