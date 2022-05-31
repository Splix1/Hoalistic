import React from 'react';
import { Button } from '@mui/material';

export default function DeletingUnit({ setDeletingUnit, deleteUnit }) {
  return (
    <div id="deleting-unit">
      <Button variant="contained" onClick={deleteUnit}>
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingUnit(false)}>
        Cancel
      </Button>
    </div>
  );
}
