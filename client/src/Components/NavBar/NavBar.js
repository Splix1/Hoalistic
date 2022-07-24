import React, { useState, useEffect, useContext, useReducer } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useHistory, NavLink } from 'react-router-dom';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import { setUser } from '../../Store/User';
import BasicMenu from '../DropdownMenu/DropdownMenu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { createTheme } from '@mui/material/styles';
import { setCosts } from '../../Store/Costs';
import { setFiles } from '../../Store/Files';
import { setDocuments } from '../../Store/Documents';
import { setProjects } from '../../Store/Projects';
import { setScenarios } from '../../Store/Scenarios';
import { setUnits } from '../../Store/Units';
import { setPlaid } from '../../Store/Plaid';

export default function NavBar() {
  const history = useHistory();
  const {
    state,
    dispatch,
    dispatchUnits,
    dispatchProjects,
    dispatchCosts,
    dispatchFiles,
    dispatchDocuments,
    dispatchScenarios,
    dispatchPlaid,
  } = useContext(Context);

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch(setUser({}));
    dispatchUnits(setUnits([]));
    dispatchProjects(setProjects([]));
    dispatchCosts(setCosts([]));
    dispatchFiles(setFiles([]));
    dispatchDocuments(setDocuments([]));
    dispatchScenarios(setScenarios([]));
    dispatchPlaid(setPlaid({}));
    history.push('/');
  };

  async function updateTheme() {
    let newTheme = state.theme === 'light' ? 'dark' : 'light';
    await supabase
      .from('HOAs')
      .update({ theme: newTheme })
      .eq('email', state.email);
    dispatch(
      setUser({
        ...state,
        theme: newTheme,
        mdTheme: createTheme({ palette: { mode: newTheme } }),
      })
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <BasicMenu />

          <IconButton sx={{ ml: 1 }} onClick={updateTheme} color="inherit">
            {state.theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
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
              <h4>
                <NavLink
                  to="/profile"
                  style={{ color: 'inherit', textDecoration: 'inherit' }}
                >
                  Hello, {state?.name?.split(' ')[0]}
                </NavLink>
              </h4>
              <Button id="sign-out-button" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
