import React, { useContext } from 'react';
import './LandingPage.css';
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
import { fetchUserData } from '../../App';

const theme = createTheme();

function LandingPage() {
  const {
    dispatch,
    dispatchCosts,
    dispatchProjects,
    dispatchUnits,
    dispatchDocuments,
    dispatchFiles,
    dispatchScenarios,
  } = useContext(Context);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email').toLowerCase();
    const password = data.get('password');

    const { user, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    if (error) {
      if (error.message === 'Invalid login credentials') {
        alert('Email or password are incorrect.');
      } else {
        alert('There was a problem signing in.');
      }
    } else {
      let { data } = await supabase.from('HOAs').select('*').eq('email', email);
      dispatch(
        setUser({
          ...data[0],
          mdTheme: createTheme({ palette: { mode: data[0].theme } }),
        })
      );
      fetchUserData(
        data[0],
        dispatchCosts,
        dispatchProjects,
        dispatchUnits,
        dispatchDocuments,
        dispatchFiles,
        dispatchScenarios
      );
      history.push('/dashboard');
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
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <NavLink to="/recoverpassword">
                    <Link variant="body2">Forgot password?</Link>
                  </NavLink>
                </Grid>
                <Grid item>
                  <NavLink to="/signup">
                    <Link variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
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

export default LandingPage;
