import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

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
    <div>
      <MenuIcon
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      ></MenuIcon>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleClose('/dashboard')}>Dashboard</MenuItem>
        <MenuItem onClick={() => handleClose('/units')}>Units</MenuItem>
        {/*<MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
}