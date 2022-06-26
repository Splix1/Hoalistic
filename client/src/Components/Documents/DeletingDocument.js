import React from 'react';
import { Button } from '@mui/material';

export default function DeletingDocument({
  setDeletingDocument,
  deleteDocument,
}) {
  return (
    <div id="deleting-cost">
      <Button variant="contained" onClick={deleteDocument}>
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingDocument(false)}>
        Cancel
      </Button>
    </div>
  );
}
