import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Context } from '../ContextProvider';
import BasicInfo from './BasicInfo';
import MissionStatement from './MissionStatement';
import Button from '@mui/material/Button';
import EditingMissionStatement from './EditingMissionStatement';
import supabase from '../../client';
import { setUser } from '../../Store/User';
import EditingBasicInfo from './EditingBasicInfo';

function UserProfileContent() {
  let { state, dispatch } = React.useContext(Context);
  let [editingProfile, setEditingProfile] = React.useState(false);
  let [newInfo, setNewInfo] = React.useState({});

  React.useEffect(() => {
    setNewInfo({
      name: state?.name,
      address: state?.address,
      email: state?.email,
      missionStatement: state?.missionStatement,
      estYearBuilt: state?.estYearBuilt,
      city: state?.city,
      state: state?.state,
      zip: state?.zip,
    });
  }, [state]);

  function verifyEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function updateProfile() {
    if (newInfo?.email) {
      if (verifyEmail(newInfo.email) === false) {
        alert('Please provide a valid email.');
        return;
      }
    }
    if (
      !newInfo.name ||
      !newInfo.address ||
      !newInfo.estYearBuilt ||
      !newInfo.city ||
      !newInfo.state ||
      !newInfo.zip
    ) {
      alert('All fields except mission statement must be filled.');
      return;
    }
    let { data, error } = await supabase
      .from('HOAs')
      .update(newInfo)
      .eq('id', state?.id);
    if (error) {
      alert('All fields must be filled except mission statement.');
      return;
    } else {
      dispatch(setUser({ ...state, ...data[0] }));
      setEditingProfile(false);
    }
  }

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
          {!editingProfile ? (
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => setEditingProfile(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div>
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => updateProfile()}
              >
                Update Profile
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => setEditingProfile(false)}
              >
                Cancel
              </Button>
            </div>
          )}

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                {!editingProfile ? (
                  <BasicInfo />
                ) : (
                  <EditingBasicInfo newInfo={newInfo} setNewInfo={setNewInfo} />
                )}
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                {!editingProfile ? (
                  <MissionStatement />
                ) : (
                  <EditingMissionStatement
                    newInfo={newInfo}
                    setNewInfo={setNewInfo}
                  />
                )}
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
