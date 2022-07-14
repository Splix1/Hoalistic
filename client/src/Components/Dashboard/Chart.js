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
  const [showLabels, setShowLabels] = React.useState(false);

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
      enabled: showLabels,
      formatter: function (val, opts) {
        if (val < 0) return `-$${numberWithCommas(Math.abs(val))}`;
        return `$${numberWithCommas(val)}`;
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          if (val < 0) return `-$${numberWithCommas(Math.abs(val))}`;

          return `$${numberWithCommas(val)}`;
        },
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
      <div className="display-row" style={{ justifyContent: 'space-between' }}>
        {!showLabels ? (
          <Button
            variant="contained"
            style={{ width: 'fit-content', height: '1.5rem' }}
            onClick={() => setShowLabels(true)}
          >
            show labels
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{ wdith: 'fit-content', height: '1.5rem' }}
            onClick={() => setShowLabels(false)}
          >
            hide labels
          </Button>
        )}

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
                onClick={() => setMonthsToAdd(monthsToAdd - 12)}
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
              onClick={() => setMonthsToAdd(monthsToAdd + 12)}
            >
              <ArrowForwardIcon />
            </div>
          </div>
        </div>
        <div> </div>
      </div>
    </Paper>
  );
}
