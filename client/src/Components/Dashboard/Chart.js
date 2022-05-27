import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui';

function createData(month, amount) {
  return { x: month, y: amount };
}

// const data = [
//   { x: 6, y: 9900 },
//   { x: 7, y: 10000 },
//   { x: 8, y: 4100 },
//   { x: 9, y: 4200 },
//   { x: 10, y: 4300 },
// ];

export default function FutureProjections({ data }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
      <Title>Future Projections</Title>
      <Chart data={data}>
        <ArgumentAxis />
        <ValueAxis />

        <LineSeries valueField="y" argumentField="x" />
      </Chart>
    </Paper>
  );
}
