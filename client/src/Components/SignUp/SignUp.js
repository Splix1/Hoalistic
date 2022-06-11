import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink, useHistory } from 'react-router-dom';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import { setUser } from '../../Store/User';
import { TextareaAutosize } from '@mui/material';

const theme = createTheme();

export default function SignUp() {
  const { dispatch } = useContext(Context);
  const history = useHistory();

  function verifyEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const address = data.get('address');
    const city = data.get('city');
    const state = data.get('state');
    const zip = data.get('zip');
    const estYearBuilt = data.get('estYearBuilt');
    const missionStatement = data.get('missionStatement');
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (verifyEmail(email) === false) {
      alert('Please provide a valid email.');
    }
    if (
      !password ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !estYearBuilt
    ) {
      alert('All fields except mission statement are required.');
      return;
    }
    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });
    if (error) {
      alert('There was a problem signing up.');
    } else {
      let { data: newUser, error } = await supabase.from('HOAs').insert([
        {
          name: `${firstName} ${lastName}`,
          address,
          email,
          estYearBuilt,
          missionStatement,
          city,
          state,
          zip,
        },
      ]);
      if (error) {
        alert('There was a problem signing up.');
        return;
      }
      dispatch(
        setUser({
          ...newUser[0],
          mdTheme: createTheme({ palette: { mode: newUser[0].theme } }),
        })
      );

      history.push('/dashboard');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="estYearBuilt"
                  label="Est. Year Built"
                  name="estYearBuilt"
                  autoComplete="estYearBuilt"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Street Address"
                  name="address"
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="city"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State"
                  name="state"
                  autoComplete="State"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="zip"
                  label="Zip"
                  name="zip"
                  autoComplete="zip"
                />
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  fullWidth
                  placeholder="Mission Statement"
                  minRows={3}
                  maxLength={300}
                  style={{ width: 394, height: 100 }}
                  id="missionStatement"
                  label="Mission Statement"
                  name="missionStatement"
                  autoComplete="missionStatement"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirm-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NavLink to="/">
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
