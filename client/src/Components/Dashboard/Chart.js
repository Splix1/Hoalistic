import * as React from 'react';
import { Paper } from '@mui/material';
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {monthsToAdd > 0 ? (
            <div
              style={{ backgroundColor: '#90caf9', cursor: 'pointer' }}
              onClick={() => setMonthsToAdd(monthsToAdd - 1)}
            >
              <ArrowBackIcon />
            </div>
          ) : (
            <div> </div>
          )}

          <div
            style={{ backgroundColor: '#90caf9', cursor: 'pointer' }}
            onClick={() => setMonthsToAdd(monthsToAdd + 1)}
          >
            <ArrowForwardIcon />
          </div>
        </div>
      </Chart>
    </Paper>
  );
}
