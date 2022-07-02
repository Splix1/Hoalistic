import React from 'react';
import { Button } from '@mui/material';

export default function DeletingProject({ setDeletingProject, deleteProject }) {
  return (
    <div id="deleting-project" style={{ marginTop: '0.5rem' }}>
      <Button
        variant="contained"
        onClick={deleteProject}
        style={{ marginRight: '0.5rem' }}
      >
        Confirm deletion
      </Button>
      <Button variant="contained" onClick={() => setDeletingProject(false)}>
        Cancel
      </Button>
    </div>
  );
}
