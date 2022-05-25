import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import { TextField } from '@mui/material';
import Title from './Title';
import { Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';

const mdTheme = createTheme();

function DashboardContent() {
  let [creatingCost, setCreatingCost] = React.useState(false);
  let [costName, setCostName] = React.useState('');
  let [costPrice, setCostPrice] = React.useState(0);

  async function createCost() {
    let { email } = supabase.auth.user();
    const user = await supabase.from('HOAs').select('*').eq('email', email);
    let { data, error } = await supabase
      .from('HOA_costs')
      .insert({ name: costName, cost: costPrice, HOA: user.data[0].id });
    if (error) {
      console.log(`ERROR`, error);
    } else {
      console.log(`DATA`, data);
    }
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
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
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 300,
                    width: 1150,
                  }}
                >
                  <div>
                    <Title>Recurring Costs</Title>
                    {creatingCost ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          required
                          id="name"
                          label="Cost Name"
                          name="name"
                          autoComplete="Jimmy"
                          onChange={(evt) => setCostName(evt.target.value)}
                        />
                        <CurrencyInput
                          id="input-example"
                          name="input-name"
                          prefix="$"
                          placeholder="Please enter a number"
                          defaultValue={0}
                          decimalsLimit={2}
                          style={{ height: '3rem', fontSize: '1rem' }}
                          onValueChange={(value) => setCostPrice(value)}
                        />
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <Button
                            variant="contained"
                            onClick={() => createCost()}
                          >
                            Create Cost
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => setCreatingCost(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => setCreatingCost(true)}
                      >
                        Add a Monthly Cost
                      </Button>
                    )}
                    <h4>Estimated Monthly Water Cost</h4>
                    <h4>Estimated Monthly Electricity Cost</h4>
                    <h4>Estimated Monthly Garbage Cost</h4>
                  </div>

                  <div>
                    <Title>Expected Projects</Title>
                    <Button variant="outlined">Add a Project</Button>
                    <h4>Fix Leak & Reseal Splitblock</h4>
                  </div>

                  <div>
                    <Title>Looking Forward</Title>
                    <h4>
                      When is the last time your building was tuckpointed?
                    </h4>
                    <h4>
                      When is the last time your building was waterproofed?
                    </h4>
                    <h4>Do you have any possible maintenance concerns?</h4>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
