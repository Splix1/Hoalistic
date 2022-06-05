import React, { useState, useEffect, useContext, useReducer } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useHistory } from 'react-router-dom';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import { setUser } from '../../Store/User';
import BasicMenu from '../DropdownMenu/DropdownMenu';
import LightOrDark from '../LightOrDark';
import { ThemeProvider } from '@mui/material/styles';

export default function NavBar() {
  const history = useHistory();
  const { state, dispatch } = useContext(Context);

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch(setUser({}));
    history.push('/');
  };

  console.log(LightOrDark());

  return (
    <ThemeProvider theme={LightOrDark()}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <BasicMenu />
            </IconButton>
            <Typography
              variant="h4"
              component="div"
              sx={{ flexGrow: 1, color: '#90caf9' }}
            >
              Hoalistic
            </Typography>
            {!state?.id ? (
              <div>
                <Button color="inherit" onClick={() => history.push('/')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => history.push('/signup')}>
                  Sign Up
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h5>Hello, {state?.name}</h5>
                <Button color="inherit" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
