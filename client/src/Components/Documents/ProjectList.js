import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TextField, Typography } from '@mui/material';
import { Context } from '../ContextProvider';

export default function ProjectList({ projects, setProject, project }) {
  const { stateProjects } = React.useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <TextField
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled
        value={project?.name || 'No Project'}
      ></TextField>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {!project ? (
          <MenuItem
            onClick={() => {
              setProject(null);
              handleClose();
            }}
          >
            No Project
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setProject(project);
              handleClose();
            }}
          />
        )}
        {project ? (
          <MenuItem
            onClick={() => {
              setProject(null);
              handleClose();
            }}
          >
            No Project
          </MenuItem>
        ) : null}
        {stateProjects?.map((project) => (
          <MenuItem
            onClick={() => {
              setProject(project);
              handleClose();
            }}
          >
            {project.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
