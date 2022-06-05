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
import User, { setUser } from '../../Store/User';
import BasicMenu from '../DropdownMenu/DropdownMenu';

const initialState = {};

export default function NavBar() {
  const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    let user = supabase.auth.user();
    async function fetchUser() {
      let { data } = await supabase
        .from('HOAs')
        .select('*')
        .eq('email', user?.email);
      setCurrentUser(data[0]);
    }
    fetchUser();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch(setUser({}));
    history.push('/');
  };

  return (
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
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
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
              <h5>Hello, {currentUser?.name}</h5>
              <Button color="inherit" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
