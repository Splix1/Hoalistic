import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path) => {
    setAnchorEl(null);
    history.push(path);
  };

  const history = useHistory();

  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={(evt) => {
        if (!anchorEl) {
          handleClick(evt);
        }
      }}
      onMouseEnter={(evt) => {
        if (!anchorEl) {
          handleClick(evt);
        }
      }}
    >
      <MenuIcon
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        style={{ zIndex: 0 }}
      ></MenuIcon>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        style={{ zIndex: 0 }}
      >
        <MenuItem onClick={() => handleClose('/dashboard')}>Dashboard</MenuItem>
        <MenuItem onClick={() => handleClose('/profile')}>Profile</MenuItem>
        <MenuItem onClick={() => handleClose('/units')}>Units</MenuItem>
        <MenuItem onClick={() => handleClose('/projects')}>Projects</MenuItem>
        <MenuItem onClick={() => handleClose('/costs')}>Costs</MenuItem>
        <MenuItem onClick={() => handleClose('/documents')}>Documents</MenuItem>
      </Menu>
    </IconButton>
  );
}
