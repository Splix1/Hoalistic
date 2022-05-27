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
import FutureProjections from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import { TextField } from '@mui/material';
import Title from './Title';
import { Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import { Context } from '../ContextProvider';
import axios from 'axios';

const mdTheme = createTheme();

function DashboardContent() {
  let [creatingCost, setCreatingCost] = React.useState(false);
  let [costName, setCostName] = React.useState('');
  let [costPrice, setCostPrice] = React.useState(0);
  let [recurringCosts, setRecurringCosts] = React.useState([]);
  let [user, setUser] = React.useState(null);
  let [creatingProject, setCreatingProject] = React.useState(false);
  let [projectName, setProjectName] = React.useState('');
  let [projectDate, setProjectDate] = React.useState('');
  let [projectCost, setProjectCost] = React.useState(0);
  let [projects, setProjects] = React.useState([]);
  let [furthestProjectMonth, setFurthestProjectMonth] = React.useState(0);
  let { state } = React.useContext(Context);
  let [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    async function fetchBudgets() {
      let { email } = supabase.auth.user();
      const { data: userData } = await supabase
        .from('HOAs')
        .select('*')
        .eq('email', email);
      setUser(userData[0]);
      let { data: recurringCostsData } = await supabase
        .from('HOA_costs')
        .select('*')
        .eq('HOA', userData[0].id);
      setRecurringCosts(recurringCostsData);
      let { data: projectsData } = await supabase
        .from('Projects')
        .select('*')
        .eq('HOA', userData[0].id);
      let currentDate = new Date().getMonth();
      let furthestProject = currentDate;
      let upcomingProjects = projectsData.filter((currentProject) => {
        if (new Date(currentProject.begin_date).getMonth() > currentDate) {
          let currentProjectMonth = new Date(currentProject).getMonth();
          if (currentProjectMonth > furthestProject)
            furthestProject = currentProjectMonth;
          return {
            ...currentProject,
            month: currentProjectMonth,
          };
        }
      });
      setProjects(upcomingProjects);
      setFurthestProjectMonth(furthestProject);
    }
    fetchBudgets();
  }, []);

  async function createCost() {
    if (costName === '' || costPrice === 0) {
      alert('Name and price are required!');
      return;
    }
    let { data } = await supabase
      .from('HOA_costs')
      .insert({ name: costName, cost: costPrice, HOA: user.id });
    setRecurringCosts([...recurringCosts, data[0]]);
    setCreatingCost(false);
  }

  async function createProject() {
    if (projectName === '' || projectCost === 0 || projectDate === '') {
      alert('All fields are required!');
      return;
    }
    let { data, error } = await supabase.from('Projects').insert({
      name: projectName,
      cost: projectCost,
      begin_date: projectDate,
      HOA: user.id,
    });
    setProjects([...projects, data[0]]);
    setCreatingProject(false);
  }

  function createData(month, amount) {
    return { x: month, y: amount };
  }

  async function generateChartData() {
    let sumOfCosts = recurringCosts.reduce((sum, currentCost) => {
      sum += currentCost.cost;
      return sum;
    }, 0);

    let { data: monthly_assessments } = await supabase
      .from('Units')
      .select('monthly_assessment')
      .eq('HOA', user.id);

    let sumOfAssessments = monthly_assessments.reduce(
      (sum, currentAssessment) => {
        sum += currentAssessment.monthly_assessment;
        return sum;
      },
      0
    );

    let data = [];
    let monthToCompare = new Date().getMonth();

    for (let i = 1; i <= furthestProjectMonth; i++) {
      let projectsToSubtract = projects
        .filter(
          (project) =>
            new Date(project.begin_date).getMonth() <= monthToCompare + i
        )
        .reduce((subSum, currentProjCost) => {
          subSum += currentProjCost.cost;
          return subSum;
        }, 0);

      let months = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec',
      };
      let correctAssSum = sumOfAssessments * i;
      let correctCostSum = sumOfCosts * i;

      let HOABalance =
        +state.HOABalance + correctAssSum - correctCostSum - projectsToSubtract;

      data.push(createData(months[monthToCompare + i], HOABalance));
    }
    setChartData(data);
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
                <FutureProjections data={chartData} />
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
                  <Deposits generateChartData={generateChartData} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 'fit-content',
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
                    {recurringCosts.map((cost) => (
                      <h4
                        key={cost.id}
                        className="budget-item"
                        style={{ height: '2rem' }}
                      >
                        {cost.name}: ${cost.cost}
                      </h4>
                    ))}
                  </div>

                  <div>
                    <Title>Expected Projects</Title>
                    {creatingProject ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          required
                          id="name"
                          label="Project Name"
                          name="name"
                          autoComplete="Jimmy"
                          onChange={(evt) => setProjectName(evt.target.value)}
                        />
                        <TextField
                          type={'date'}
                          required
                          fullWidth
                          id="dateMovedIn"
                          name="dateMovedIn"
                          autoComplete="Jimmy"
                          onChange={(evt) => setProjectDate(evt.target.value)}
                        />
                        <CurrencyInput
                          id="input-example"
                          name="input-name"
                          prefix="$"
                          placeholder="Please enter a number"
                          defaultValue={0}
                          decimalsLimit={2}
                          style={{ height: '3rem', fontSize: '1rem' }}
                          onValueChange={(value) => setProjectCost(value)}
                        />
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <Button
                            variant="contained"
                            onClick={() => createProject()}
                          >
                            Create Project
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => setCreatingProject(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => setCreatingProject(true)}
                      >
                        Add a Project
                      </Button>
                    )}

                    {projects.map((project) => {
                      return (
                        <div className="budget-item">
                          <h4>
                            {project.name}: ${project.cost} <br />
                            Begin: {project.begin_date}
                          </h4>
                        </div>
                      );
                    })}
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
