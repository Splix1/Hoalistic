import * as React from 'react';
import { Paper } from '@mui/material';
import Title from './Title';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  BarSeries,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';

function createData(month, amount) {
  return { x: month, y: amount };
}

// export default function FutureProjections({ data }) {
//   return (
//     <Paper>
//       <Chart data={data}>
//         <ArgumentAxis />
//         <ValueAxis />

//         <BarSeries valueField="balance" argumentField="month" />
//         <EventTracker />
//         <Tooltip />
//       </Chart>
//     </Paper>
//   );
// }

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
