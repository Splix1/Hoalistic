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
  years,
}) {
  const { stateScenarios, state } = React.useContext(Context);
  const [showMouseOver, setShowMouseOver] = React.useState(null);

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: years,
    },
    theme: {
      mode: state?.theme,
      palette: 'palette1',
      monochrome: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return numberWithCommas(val);
      },
    },
  };
  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

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
        series={data}
        type="line"
        width="100%"
        height="300rem"
      />

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
