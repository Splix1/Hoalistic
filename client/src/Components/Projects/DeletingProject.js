import React from 'react';
import { Button } from '@mui/material';

export default function DeletingProject({ setDeletingProject, deleteProject }) {
  return (
    <div id="deleting-project">
      <Button variant="contained" onClick={deleteProject}>
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingProject(false)}>
        Cancel
      </Button>
    </div>
  );
}
