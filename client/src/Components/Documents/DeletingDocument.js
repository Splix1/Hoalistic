import React from 'react';
import { Button } from '@mui/material';

export default function DeletingDocument({
  setDeletingDocument,
  deleteDocument,
}) {
  return (
    <div id="deleting-cost" style={{ marginTop: '0.5rem' }}>
      <Button
        variant="contained"
        onClick={deleteDocument}
        style={{ marginRight: '0.5rem' }}
      >
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingDocument(false)}>
        Cancel
      </Button>
    </div>
  );
}
