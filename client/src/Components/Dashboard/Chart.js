import * as React from 'react';
import { Paper, Button, Typography } from '@mui/material';
import Title from './Title';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function FutureProjections({
  data,
  monthsToAdd,
  setMonthsToAdd,
}) {
  return (
    <Paper
      sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}
      xs={24}
      sm={16}
      md={10}
    >
      <CssBaseline />
      <Title>Future Projections</Title>

      <Chart data={data} height={240}>
        <ArgumentAxis />
        <ValueAxis />

        <LineSeries valueField="y" argumentField="x" />
        <EventTracker />
        <Tooltip />
      </Chart>
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
