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
import { setUnits } from '../../Store/Units';
import { setCosts } from '../../Store/Costs';
import { setProjects } from '../../Store/Projects';

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
  let [projects, setStateProjects] = React.useState([]);
  let [chartData, setChartData] = React.useState([]);
  let [monthlyAssessments, setMonthlyAssessments] = React.useState([]);
  let [creatingUnit, setCreatingUnit] = React.useState(false);
  let [unitID, setUnitID] = React.useState(null);
  let [unitAssessment, setUnitAssessment] = React.useState(0);
  let [unitMovedIn, setUnitMovedIn] = React.useState('');
  let [unitTenantName, setUnitTenantName] = React.useState('');
  let [HOABalance, setHOABalance] = React.useState(0);
  let [monthsToAdd, setMonthsToAdd] = React.useState(0);
  let {
    state,
    stateCosts,
    stateUnits,
    stateScenarios,
    dispatchUnits,
    dispatchCosts,
    dispatchProjects,
  } = React.useContext(Context);

  React.useEffect(() => {
    async function fetchBudgets() {
      //fetch projects
      let { data: projectsData } = await supabase
        .from('Projects')
        .select('*')
        .eq('HOA', state?.id);

      let upcomingProjects = projectsData.filter((currentProject) => {
        let projectDate = new Date(currentProject.begin_date);
        let currentTime = new Date().getTime();

        if (projectDate.getTime() > currentTime)
          return { ...currentProject, month: projectDate.getMonth() + 1 };
      });
      setStateProjects(upcomingProjects);

      //update balance

      setHOABalance(numberWithCommas(state?.balance));
    }
    fetchBudgets();
  }, [state]);

  React.useEffect(() => {
    setUser(state);
    setRecurringCosts(stateCosts);
    setMonthlyAssessments(stateUnits);
  }, [state, stateCosts, stateUnits]);

  React.useEffect(() => {
    generateChartData(state);
  }, [HOABalance, projects, stateScenarios, monthsToAdd]);

  async function createCost() {
    if (costName === '' || costPrice === 0) {
      alert('Name and price are required!');
      return;
    }
    let { data } = await supabase
      .from('HOA_costs')
      .insert({ name: costName, cost: costPrice, HOA: user.id });
    setRecurringCosts([...recurringCosts, data[0]]);
    dispatchCosts(setCosts([...stateCosts, data[0]]));
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
    setStateProjects([...projects, data[0]]);
    dispatchProjects(setProjects([...projects, data[0]]));
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
    dispatchUnits(setUnits([...stateUnits, unitData[0]]));
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

    for (let i = 0; i < 12 + monthsToAdd; i++) {
      let dataObj = {};
      let monthCounter = i + 1;
      //if month + j is greater than 12 therefore not a month and in a new year
      if (months[currentMonth + j] === undefined) {
        yearCounter++;
        j = -currentMonth + 1;
      }

      let projectsToSubtract = projects
        .filter((project) => {
          let projectTime = new Date(project.begin_date).getTime();
          let dataTime = new Date(
            currentYear + yearCounter,
            currentMonth + j
          ).getTime();

          if (projectTime <= dataTime) {
            return project;
          }
        })
        .reduce((subSum, currentProjCost) => {
          subSum += currentProjCost.cost;
          return subSum;
        }, 0);

      let correctAssSum = sumOfAssessments * monthCounter;
      let correctCostSum = sumOfCosts * monthCounter;

      let futureProjection =
        +currentUser.balance +
        correctAssSum -
        correctCostSum -
        projectsToSubtract;
      dataObj['date'] = mobileOrComputer(
        months[currentMonth + j],
        currentYear + yearCounter
      );
      dataObj['Future Projection'] = futureProjection;
      //loop over scenarios, creating a projection for current month with each scenario
      for (let i = 0; i < stateScenarios?.length; i++) {
        let currentProjection = futureProjection;
        let currentDataTime = new Date(
          `${currentMonth + j}/1/${currentYear + yearCounter}`
        );
        let specialDate = new Date(stateScenarios[i].specialDate);
        if (stateScenarios[i].specialAmount) {
          if (currentDataTime.getTime() >= specialDate.getTime())
            currentProjection += stateScenarios[i].specialAmount;
        }

        let changeDate = new Date(stateScenarios[i].changeDate);

        if (stateScenarios[i].changeAmount) {
          if (currentDataTime.getTime() >= changeDate.getTime()) {
            currentProjection +=
              (correctAssSum * stateScenarios[i].changeAmount) / 100;
          }
        }
        dataObj[`${stateScenarios[i].name}`] = currentProjection;
      }
      data.push(dataObj);
      // data.push(
      //   createData(
      //     mobileOrComputer(months[currentMonth + j], currentYear + yearCounter),
      //     futureProjection
      //   )
      // );
      j++;
    }
    for (let i = 0; i < monthsToAdd; i++) {
      data.shift();
    }
    setChartData(data);
  }

  function mobileOrComputer(month, year) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return `${month}`;
    } else {
      return `${month}/${year}`;
    }
  }

  function numberWithCommas(x) {
    if (!x) return;
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
          <Container sx={{ mt: 4, mb: 4, marginTop: '0px' }}>
            <Grid container spacing={3}>
              <div style={{ display: 'flex', flexDirection: 'row' }}></div>
              <Grid item xs={12} md={8} lg={9}>
                <FutureProjections
                  data={chartData}
                  monthsToAdd={monthsToAdd}
                  setMonthsToAdd={setMonthsToAdd}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    height: 300,
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
                    marginBottom: '2rem',
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
                          style={{ marginBottom: '0.5rem' }}
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
                            marginBottom: '0.5rem',
                          }}
                          onValueChange={(value) => setCostPrice(value)}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginTop: '0.5rem',
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => createCost()}
                          >
                            Add Cost
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
                    <Title>Upcoming Projects</Title>
                    {creatingProject ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          required
                          id="name"
                          label="Project Name"
                          name="name"
                          autoComplete="Jimmy"
                          onChange={(evt) => setProjectName(evt.target.value)}
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <TextField
                          type={'date'}
                          required
                          fullWidth
                          id="dateMovedIn"
                          name="dateMovedIn"
                          autoComplete="Jimmy"
                          onChange={(evt) => setProjectDate(evt.target.value)}
                          style={{ marginBottom: '0.5rem' }}
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
                            marginBottom: '0.5rem',
                          }}
                          onValueChange={(value) => setProjectCost(value)}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginTop: '0.5rem',
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => createProject()}
                          >
                            Add Project
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
                    <Title>Units</Title>
                    {creatingUnit ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          required
                          id="unitID"
                          label="Unit ID"
                          name="unitID"
                          autoComplete="Jimmy"
                          onChange={(evt) => setUnitID(evt.target.value)}
                          style={{ marginBottom: '0.5rem' }}
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
                            marginBottom: '0.5rem',
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
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <TextField
                          required
                          fullWidth
                          id="tenantName"
                          name="tenantName"
                          label="Tenant Name"
                          autoComplete="Jimmy"
                          style={{ marginBottom: '0.5rem' }}
                          onChange={(evt) =>
                            setUnitTenantName(evt.target.value)
                          }
                        />

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginTop: '0.5rem',
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => createUnit()}
                          >
                            Add Unit
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
                        Add a Unit
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
