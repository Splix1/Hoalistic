import * as React from 'react';
import { Paper, Button } from '@mui/material';
import Title from './Title';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Context } from '../ContextProvider';
import Chart from 'react-apexcharts';
import Scenarios from '../Scenarios/Scenarios';
import NewScenario from '../Scenarios/NewScenario';

export default function FutureProjections({
  data,
  monthsToAdd,
  setMonthsToAdd,
  years,
}) {
  const { state } = React.useContext(Context);
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
        val = Math.trunc(val);

        if (val < 0) return `-$${numberWithCommas(Math.abs(val))}`;
        return `$${numberWithCommas(val)}`;
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          val = Math.trunc(val);

          if (val < 0) return `-$${numberWithCommas(Math.abs(val))}`;

          return `$${numberWithCommas(val)}`;
        },
      },
    },
  };
  function numberWithCommas(x) {
    if (!x) return;
    x = Math.trunc(x);
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
            style={{ width: '9rem', height: '1.5rem' }}
            onClick={() => setShowLabels(true)}
          >
            show labels
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{ width: '9rem', height: '1.5rem' }}
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
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Scenarios />
          <NewScenario />
        </div>
      </div>
    </Paper>
  );
}
