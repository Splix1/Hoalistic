import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FutureProjections from './Chart';
import Deposits from './Deposits';
import { TextField } from '@mui/material';
import Title from './Title';
import { Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import { Context } from '../ContextProvider';

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
  let [chartData, setChartData] = React.useState([]);
  let [monthlyAssessments, setMonthlyAssessments] = React.useState([]);
  let [creatingUnit, setCreatingUnit] = React.useState(false);
  let [unitID, setUnitID] = React.useState(null);
  let [unitAssessment, setUnitAssessment] = React.useState(0);
  let [unitMovedIn, setUnitMovedIn] = React.useState('');
  let [unitTenantName, setUnitTenantName] = React.useState('');
  let [HOABalance, setHOABalance] = React.useState(0);
  let { state } = React.useContext(Context);

  React.useEffect(() => {
    async function fetchBudgets() {
      //fetch user data
      let { email } = supabase.auth.user();
      const { data: userData } = await supabase
        .from('HOAs')
        .select('*')
        .eq('email', email);
      setUser(userData[0]);

      //fetch recurring costs
      let { data: recurringCostsData } = await supabase
        .from('HOA_costs')
        .select('*')
        .eq('HOA', userData[0].id);
      setRecurringCosts(recurringCostsData);

      //fetch projects
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

      //fetch unit assessments
      let { data: monthlyAssessmentsData } = await supabase
        .from('Units')
        .select('*')
        .eq('HOA', userData[0].id);
      setMonthlyAssessments(monthlyAssessmentsData);

      //update balance
      setHOABalance(userData[0].balance);

      //run chart
      generateChartData(userData[0]);
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
    let { data } = await supabase.from('Projects').insert({
      name: projectName,
      cost: projectCost,
      begin_date: projectDate,
      HOA: user.id,
    });
    setProjects([...projects, data[0]]);
    setCreatingProject(false);
  }

  async function createUnit() {
    if (
      unitAssessment === 0 ||
      unitID === '' ||
      unitMovedIn === '' ||
      unitTenantName === ''
    ) {
      alert('All fields are required!');
      return;
    }
    let { data: unitData } = await supabase.from('Units').insert({
      tenant_name: unitTenantName,
      monthly_assessment: unitAssessment,
      unitID: unitID,
      HOA: user.id,
      dateMovedIn: unitMovedIn,
    });
    setMonthlyAssessments([...monthlyAssessments, unitData[0]]);
    setCreatingUnit(false);
  }

  function createData(month, amount) {
    return { x: month, y: amount };
  }

  async function generateChartData(currentUser) {
    let sumOfCosts = recurringCosts.reduce((sum, currentCost) => {
      sum += currentCost.cost;
      return sum;
    }, 0);

    let { data: monthly_assessments } = await supabase
      .from('Units')
      .select('monthly_assessment')
      .eq('HOA', currentUser.id);

    let sumOfAssessments = monthly_assessments.reduce(
      (sum, currentAssessment) => {
        sum += currentAssessment.monthly_assessment;
        return sum;
      },
      0
    );

    let data = [];
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
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

    //j is a controlled variable to make month calculation, i will not work as it's meant to be exact
    //amount of data to produce (12 + 1 will result in undefined month, therefore must be controlled
    //and indicates a new year), yearCounter is to determine if the data you're looking at is in a
    //future year, monthCounter is to determine how many months of costs/assessments to account for
    let j = 1;
    let yearCounter = 0;

    for (let i = 0; i < 12; i++) {
      let monthCounter = i + 1;
      //if month + j is greater than 12 therefore not a month and in a new year
      if (months[currentMonth + j] === undefined) {
        yearCounter++;
        j = -currentMonth + 1;
      }

      let projectsToSubtract = projects
        .filter((project) => {
          let currentProject = new Date(project.begin_date);
          if (
            currentProject.getMonth() <= currentMonth + i &&
            currentProject.getFullYear() <= currentYear
          ) {
            return project;
          }
        })
        .reduce((subSum, currentProjCost) => {
          subSum += currentProjCost.cost;
          return subSum;
        }, 0);

      let correctAssSum = sumOfAssessments * monthCounter;
      let correctCostSum = sumOfCosts * monthCounter;
      let HOABalance =
        +currentUser.balance +
        correctAssSum -
        correctCostSum -
        projectsToSubtract;

      data.push(
        createData(
          `${months[currentMonth + j]}/${currentYear + yearCounter}`,
          HOABalance
        )
      );
      j++;
    }
    setChartData(data);
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <ThemeProvider theme={state?.mdTheme}>
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
                  <Deposits
                    generateChartData={generateChartData}
                    HOABalance={HOABalance}
                    setHOABalance={setHOABalance}
                    user={user}
                  />
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
                          style={{
                            height: '3rem',
                            fontSize: '1rem',
                            backgroundColor: '#121212',
                            color: 'white',
                          }}
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
                        {cost.name}: ${numberWithCommas(cost.cost)}
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
                          style={{
                            height: '3rem',
                            fontSize: '1rem',
                            backgroundColor: '#121212',
                            color: 'white',
                          }}
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
                        <div key={project.id} className="budget-item">
                          <h4>
                            {project.name}: ${numberWithCommas(project.cost)}{' '}
                            <br />
                            Begin: {project.begin_date}
                          </h4>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <Title>Unit Assessments</Title>
                    {creatingUnit ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          required
                          id="unitID"
                          label="Unit ID"
                          name="unitID"
                          autoComplete="Jimmy"
                          onChange={(evt) => setUnitID(evt.target.value)}
                        />

                        <CurrencyInput
                          id="unitAssessment"
                          name="unitAssessment"
                          prefix="$"
                          placeholder="Please enter a number"
                          defaultValue={0}
                          decimalsLimit={2}
                          style={{
                            height: '3rem',
                            fontSize: '1rem',
                            backgroundColor: '#121212',
                            color: 'white',
                          }}
                          onValueChange={(value) => setUnitAssessment(value)}
                        />
                        <TextField
                          type={'date'}
                          required
                          fullWidth
                          id="dateMovedIn"
                          name="dateMovedIn"
                          autoComplete="Jimmy"
                          onChange={(evt) => setUnitMovedIn(evt.target.value)}
                        />
                        <TextField
                          required
                          fullWidth
                          id="tenantName"
                          name="tenantName"
                          label="Tenant Name"
                          autoComplete="Jimmy"
                          onChange={(evt) =>
                            setUnitTenantName(evt.target.value)
                          }
                        />

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <Button
                            variant="contained"
                            onClick={() => createUnit()}
                          >
                            Create Unit
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => setCreatingUnit(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => setCreatingUnit(true)}
                      >
                        Create a Unit
                      </Button>
                    )}
                    {monthlyAssessments.map((assessment) => (
                      <h4
                        key={assessment.id}
                        className="budget-item"
                        style={{ height: 'fit-content' }}
                      >
                        {assessment.unitID}
                        <br />
                        {assessment.tenant_name}: $
                        {numberWithCommas(assessment.monthly_assessment)}
                        <br />
                        Moved in: {assessment.dateMovedIn}
                      </h4>
                    ))}
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
