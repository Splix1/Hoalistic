import * as React from 'react';
import { Paper, Button, Typography } from '@mui/material';
import Title from './Title';
import {
  ArgumentAxis,
  ValueAxis,
  Chart as oldChart,
  LineSeries,
  Tooltip,
  Title as chartTitle,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';
import { Animation } from '@devexpress/dx-react-chart';
import { Context } from '../ContextProvider';
import Chart from 'react-apexcharts';

export default function FutureProjections({
  data,
  monthsToAdd,
  setMonthsToAdd,
}) {
  const { stateScenarios, state } = React.useContext(Context);
  const [showMouseOver, setShowMouseOver] = React.useState(null);

  const PREFIX = 'Demo';

  const classes = {
    chart: `${PREFIX}-chart`,
  };
  const format = () => (tick) => tick;

  const Root = (props) => (
    <Legend.Root
      {...props}
      sx={{ display: 'flex', margin: 'auto', flexDirection: 'row' }}
    />
  );
  const Label = (props) => (
    <Legend.Label sx={{ pt: 1, whiteSpace: 'nowrap' }} {...props} />
  );

  const Item = (props) => (
    <Legend.Item sx={{ flexDirection: 'column' }} {...props} />
  );

  const ValueLabel = (props) => {
    const { text } = props;
    return <ValueAxis.Label {...props} text={`${text}%`} />;
  };

  const TitleText = (props) => (
    <chartTitle.Text {...props} sx={{ whiteSpace: 'pre' }} />
  );

  const StyledChart = styled(oldChart)(() => ({
    [`&.${classes.chart}`]: {
      paddingRight: '20px',
    },
  }));

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
    theme: {
      mode: state?.theme,
      palette: 'palette1',
      monochrome: {
        enabled: false,
      },
    },
  };

  const series = [
    { name: 'Jun/1993', data: [100, 200, 300, 400, 500] },
    { name: 'Aug/1993', data: [200, 400, 600, 800, 1000] },
  ];

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '25rem',
      }}
      xs={24}
      sm={16}
      md={10}
    >
      <CssBaseline />
      <Title>Future Projections</Title>
      <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        height="300rem"
      />
      {/* <StyledChart data={data} className={classes.chart}>
        <ArgumentAxis />
        <ValueAxis />
        <LineSeries
          name="Current Projection"
          valueField="Current Projection"
          argumentField="date"
        />

        {stateScenarios?.map((scenario) => (
          <LineSeries
            name={`${scenario.name}`}
            valueField={`${scenario.name}`}
            argumentField="date"
          />
        ))}

        <Legend
          position="bottom"
          rootComponent={Root}
          itemComponent={Item}
          labelComponent={Label}
        />
        {/* <LineSeries name="TV news" valueField="tvNews" argumentField="year" />
        <LineSeries name="Church" valueField="church" argumentField="year" />
        <LineSeries
        name="Military"
        valueField="military"
        argumentField="year"
        />
        <LineSeries name="Dog" valueField="dogX" argumentField="year" /> */}
      {/* <EventTracker />
        <Tooltip />
        <Animation />
      </StyledChart> */}{' '}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {monthsToAdd > 0 ? (
            <div
              style={{
                cursor: 'pointer',
                marginRight: '1rem',
              }}
              onClick={() => setMonthsToAdd(monthsToAdd - 1)}
            >
              <ArrowBackIcon />
            </div>
          ) : (
            <div
              style={{
                marginRight: '1rem',
              }}
            >
              <ArrowBackIcon style={{ color: 'gray' }} />
            </div>
          )}

          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setMonthsToAdd(monthsToAdd + 1)}
          >
            <ArrowForwardIcon />
          </div>
        </div>
      </div>
    </Paper>
  );
}
