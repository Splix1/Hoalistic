import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Context } from '../ContextProvider';
import Title from '../Dashboard/Title';
import { Typography } from '@mui/material';
import BasicInfo from './BasicInfo';

function UserProfileContent() {
  let { state } = React.useContext(Context);
  let [editingProfile, setEditingProfile] = React.useState(false);

  console.log(state);
  return (
    <ThemeProvider theme={state?.mdTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 500,
                  }}
                >
                  {!editingProfile ? <BasicInfo /> : null}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 500,
                  }}
                >
                  <Title>
                    <Typography sx={{ fontSize: '2rem' }}>
                      Mission Statement
                    </Typography>
                  </Title>
                  <Typography sx={{ fontSize: '1.5rem' }}>
                    {state?.missionStatement ||
                      'You have no mission statement yet.'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function UserProfile() {
  return <UserProfileContent />;
}
