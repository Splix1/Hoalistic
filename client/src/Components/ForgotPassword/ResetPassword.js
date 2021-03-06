import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink, useHistory } from 'react-router-dom';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import { setUser } from '../../Store/User';

const theme = createTheme();

export default function ResetPassword() {
  const { state, dispatch } = useContext(Context);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    if (password !== confirmPassword) {
      alert('Passwords must match!');
      return;
    }

    const { data: newData, error } = await supabase.auth.api.updateUser(
      state.access_token,
      {
        password: password,
      }
    );
    if (error) {
      alert('There was a problem updating your password.');
      return;
    } else {
      alert('Your password has been reset. Please log in.');
      supabase.auth.signOut();
      dispatch(setUser({ ...state, access_token: null }));
      history.push('/login');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/HOA.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                type="password"
                margin="normal"
                required
                fullWidth
                id="password"
                label="New Password"
                name="password"
                autoComplete="email"
                autoFocus
              />
              <TextField
                type="password"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Confirm Password"
                name="confirmPassword"
                autoComplete="confirmPassword"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                update password
              </Button>
              <Grid
                container
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Grid item>
                  <NavLink to="/login">
                    <Link variant="body2">{'Sign In'}</Link>
                  </NavLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
