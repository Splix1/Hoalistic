import React from 'react';
import { Button } from '@mui/material';

export default function DeletingCost({ setDeletingCost, deleteCost }) {
  return (
    <div id="deleting-cost">
      <Button variant="contained" onClick={deleteCost}>
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingCost(false)}>
        Cancel
      </Button>
    </div>
  );
}
