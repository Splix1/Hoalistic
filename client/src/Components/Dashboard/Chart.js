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

export default function FutureProjections({ data }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
      <Title>Future Projections</Title>
      <Chart data={data}>
        <ArgumentAxis />
        <ValueAxis />

        <LineSeries valueField="y" argumentField="x" />
        <EventTracker />
        <Tooltip />
      </Chart>
    </Paper>
  );
}
