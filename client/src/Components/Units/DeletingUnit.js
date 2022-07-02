import React from 'react';
import { Button } from '@mui/material';

export default function DeletingUnit({ setDeletingUnit, deleteUnit }) {
  return (
    <div id="deleting-unit" style={{ marginTop: '0.5rem' }}>
      <Button
        variant="contained"
        onClick={deleteUnit}
        style={{ marginRight: '0.5rem' }}
      >
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingUnit(false)}>
        Cancel
      </Button>
    </div>
  );
}
