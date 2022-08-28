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
import { setTransactions } from '../../Store/Transactions';
import RecurringCosts from './RecurringCosts';
import UpcomingProjects from './UpcomingProjects';
import Units from './Units';
const dayjs = require('dayjs');

function DashboardContent() {
  let [recurringCosts, setRecurringCosts] = React.useState([]);
  let [user, setUser] = React.useState(null);
  let [projects, setStateProjects] = React.useState([]);
  let [chartData, setChartData] = React.useState([]);
  let [monthlyAssessments, setMonthlyAssessments] = React.useState([]);
  let [HOABalance, setHOABalance] = React.useState(0);
  let [monthsToAdd, setMonthsToAdd] = React.useState(0);
  let [chartType, setChartType] = React.useState('Future Projections');

  let {
    state,
    stateCosts,
    stateUnits,
    stateScenarios,
    stateProjects,
    stateTransactions,
    dispatchUnits,
    dispatchCosts,
    dispatchProjects,
    dispatchTransactions,
  } = React.useContext(Context);
  let [chartYears, setChartYears] = React.useState([]);
  let [chartTransactions, setChartTransactions] = React.useState([]);

  React.useEffect(() => {
    async function fetchBudgets() {
      //fetch projects
      let { data: projectsData } = await supabase
        .from('Projects')
        .select('*')
        .eq('HOA', state?.id);

      let upcomingProjects = projectsData.filter((currentProject) => {
        let projectDayJS = dayjs(currentProject.begin_date);
        let projectDate = new Date(projectDayJS.$d);
        let currentTime = new Date().getTime();

        if (projectDate.getTime() > currentTime)
          return { ...currentProject, month: projectDate.getMonth() + 1 };
      });
      setStateProjects(upcomingProjects);

      //update balance

      setHOABalance(numberWithCommas(state?.balance));
    }
    fetchBudgets();
  }, [state, stateProjects]);

  React.useEffect(() => {
    setUser(state);
    setRecurringCosts(stateCosts);
    setMonthlyAssessments(stateUnits);
  }, [state, stateCosts, stateUnits]);

  React.useEffect(() => {
    if (chartType === 'Future Projections') {
      generateChartData(state);
    } else {
      generatePreviousBalances(state);
    }
  }, [
    HOABalance,
    projects,
    stateScenarios,
    monthsToAdd,
    stateCosts,
    chartType,
  ]);

  async function generateChartData(currentUser) {
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

    let data = [
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: [],
        y: [],
        text: [],
        name: 'Future Projection',
      },
    ];
    let dates = [];
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
      let monthCounter = i + 1;
      //if month + j is greater than 12 therefore not a month and in a new year
      if (months[currentMonth + j] === undefined) {
        yearCounter++;
        j = -currentMonth + 1;
      }

      let dataDate = dayjs(`${currentYear + yearCounter}-${currentMonth + j}`);
      let projectsToSubtract = projects
        .filter((project) => {
          let projectDate = dayjs(project.begin_date);

          if (projectDate.diff(dataDate) <= 0) {
            return project;
          }
        })
        .reduce((subSum, currentProjCost) => {
          subSum += currentProjCost.cost;
          return subSum;
        }, 0);

      let correctAssSum = sumOfAssessments * monthCounter;
      let correctCostSum = stateCosts?.reduce((total, currentCost) => {
        return (
          total +
          calculateCost(currentCost, dataDate, monthCounter, yearCounter)
        );
      }, 0);

      let futureProjection =
        +currentUser.balance +
        correctAssSum -
        correctCostSum -
        projectsToSubtract;

      data[0].y.push(Math.trunc(futureProjection));
      data[0].text.push('Future Projection');

      //loop over scenarios, creating a projection for current month with each scenario
      for (let k = 0; k < stateScenarios?.length; k++) {
        let currentProjection = futureProjection;
        let currentDataDate = dayjs(
          `${currentMonth + j}/1/${currentYear + yearCounter}`
        );

        let specialDayDate = dayjs(stateScenarios[k].specialDate);

        if (stateScenarios[k].specialAmount) {
          if (specialDayDate.diff(currentDataDate) <= 0) {
            currentProjection +=
              stateScenarios[k].specialAmount * stateUnits?.length;
          }
        }

        let changeDayDate = dayjs(stateScenarios[k].changeDate);

        if (stateScenarios[k].changeAmount) {
          if (changeDayDate.diff(currentDataDate) <= 0) {
            currentProjection +=
              (correctAssSum * stateScenarios[k].changeAmount) / 100;
          }
        }

        let isInData = false;
        for (let l = 0; l < data.length; l++) {
          if (data[l].text.includes(stateScenarios[k].name)) isInData = true;
        }

        if (!isInData) {
          data.push({
            y: [currentProjection],
            x: [],
            text: [`${stateScenarios[k].name}`],
            name: stateScenarios[k].name,
          });
        } else {
          for (let l = 0; l < data.length; l++) {
            if (data[l].text.includes(stateScenarios[k].name)) {
              data[l].y.push(Math.trunc(currentProjection));
              data[l].text.push(stateScenarios[k].name);
            }
          }
        }
      }

      for (let k = 0; k < data.length; k++) {
        data[k].x.push(
          mobileOrComputer(months[currentMonth + j], currentYear + yearCounter)
        );
      }
      j++;
    }

    setChartYears(dates);
    setChartData(data);
  }

  async function generatePreviousBalances() {
    let data = [
      {
        type: 'line',
        mode: 'lines+markers',
        x: [],
        y: [],
        text: [],
        name: 'Transaction History',
        hover_data: ['amount', 'categories'],
        hovertemplate:
          '<br><b>Balance</b>: $%{y:.2f}<br>' +
          '<br><b>Date</b>: %{text.fullDate}<br>' +
          '<br><b>Amount</b>: $%{text.amount}<br>' +
          '<br><b>Categories</b>: %{text.categories}<br>',
      },
    ];
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

    const compareTxnsByDateAscending = (a, b) =>
      (a.date > b.date) - (a.date < b.date);

    let transactions = stateTransactions
      .sort(compareTxnsByDateAscending)
      .reverse();
    let date = dayjs(transactions[0]?.date);
    let amount = 0;
    let transactionsCategories = [];

    for (let i = 0; i < stateTransactions?.length; i++) {
      let currentTransaction = transactions[i];
      let currentTransactionDate = dayjs(currentTransaction.date);
      let day = currentTransactionDate.$D;
      let month = currentTransactionDate.$M;
      let year = currentTransactionDate.$y;

      if (day !== date.$D || month !== date.$M || year !== date.$y) {
        date = currentTransactionDate;
        let previousBalance = getPreviousBalance(date, amount);

        data[0].y.push(Math.trunc(previousBalance));
        data[0].x.push(`${date.$y}-${date.$M}-${date.$D}`);
        data[0].text.push({
          amount: Math.trunc(amount),
          categories: transactionsCategories.join(', '),
          fullDate: `${date.$M + 1}/${date.$D}/${date.$y}`,
        });
        transactionsCategories = [];
        amount = 0;
        date = dayjs(transactions[i].date);
      }

      if (day === date.$D && month === date.$M && year === date.$y) {
        amount += currentTransaction.amount;
        let categories = currentTransaction?.categories?.split(', ');
        for (let j = 0; j < categories?.length; j++) {
          if (!transactionsCategories.includes(categories[j])) {
            transactionsCategories.push(categories[j]);
          }
        }
      }
    }

    data[0].text.reverse();
    data[0].x.reverse();
    data[0].y.reverse();

    setChartData(data);
  }

  function getPreviousBalance(transactionDate, amount) {
    let date = dayjs();
    let projectsToAdd = 0;
    let costsToAdd = 0;
    let assessmentsToSubtract = 0;

    projectsToAdd += stateProjects?.reduce((total, project) => {
      let projDate = dayjs(project.begin_date);
      if (
        projDate.$M > transactionDate.$M &&
        projDate.$y >= transactionDate.$y
      ) {
        total += project.cost;
      }
      return total;
    }, 0);

    while (date.$M !== transactionDate.$M && date.$y !== transactionDate.$y) {
      costsToAdd += stateCosts?.reduce((total, cost) => {
        total += cost.cost;
        return total;
      }, 0);

      assessmentsToSubtract += stateUnits?.reduce((total, unit) => {
        total += unit.monthly_assessment;
        return total;
      }, 0);

      date = dayjs(date.$d).subtract(1, 'month');
    }

    return (
      +user?.balance +
      projectsToAdd +
      costsToAdd -
      assessmentsToSubtract +
      amount
    );
  }

  function calculateCost(cost, dataDate, monthCounter, yearCounter) {
    let costCreated = dayjs(cost.created_at);
    switch (cost?.occurrence) {
      case 'monthly': {
        return cost.cost * monthCounter;
      }
      case 'yearly': {
        if (costCreated.$M === dataDate.$M) return cost.cost * yearCounter;
        return 0;
      }
    }
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

    x = Math.trunc(x);
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
                  years={chartYears}
                  chartType={chartType}
                  setChartType={setChartType}
                  transactions={chartTransactions}
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
                    height: '550px',
                  }}
                >
                  <Deposits
                    generateChartData={generateChartData}
                    HOABalance={HOABalance}
                    setHOABalance={setHOABalance}
                    user={user}
                    chartType={chartType}
                    generatePreviousBalances={generatePreviousBalances}
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
                  <RecurringCosts
                    user={user}
                    setCosts={setCosts}
                    recurringCosts={recurringCosts}
                  />

                  <UpcomingProjects
                    projects={projects}
                    user={user}
                    setStateProjects={setStateProjects}
                  />

                  <Units
                    monthlyAssessments={monthlyAssessments}
                    user={user}
                    setMonthlyAssessments={setMonthlyAssessments}
                    setUnits={setUnits}
                  />
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
