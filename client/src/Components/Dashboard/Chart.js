import * as React from 'react';
import { Paper, Button, Typography } from '@mui/material';
import Title from './Title';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
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

export default function FutureProjections({
  data,
  monthsToAdd,
  setMonthsToAdd,
}) {
  const confidence = [
    {
      year: 1993,
      tvNews: 19,
      church: 29,
      military: 32,
    },
    {
      year: 1995,
      tvNews: 13,
      church: 32,
      military: 33,
      dogX: 5,
    },
    {
      year: 1997,
      tvNews: 14,
      church: 35,
      military: 30,
      dogX: 10,
    },
    {
      year: 1999,
      tvNews: 13,
      church: 32,
      military: 34,
      dogX: 15,
    },
    {
      year: 2001,
      tvNews: 15,
      church: 28,
      military: 32,
      dogX: 20,
    },
    {
      year: 2003,
      tvNews: 16,
      church: 27,
      military: 48,
      dogX: 25,
    },
    {
      year: 2006,
      tvNews: 12,
      church: 28,
      military: 41,
      dogX: 30,
    },
    {
      year: 2008,
      tvNews: 11,
      church: 26,
      military: 45,
      dogX: 40,
    },
    {
      year: 2010,
      tvNews: 10,
      church: 25,
      military: 44,
      dogX: 50,
    },
    {
      year: 2012,
      tvNews: 11,
      church: 25,
      military: 43,
      dogX: 60,
    },
    {
      year: 2014,
      tvNews: 10,
      church: 25,
      military: 39,
      dogX: 70,
    },
    {
      year: 2016,
      tvNews: 8,
      church: 20,
      military: 41,
      dogX: 80,
    },
    {
      year: 2018,
      tvNews: 10,
      church: 20,
      military: 43,
      dogX: 90,
    },
    {
      year: 2018,
      dogX: 100,
      dogY: 20,
      military: 43,
    },
  ];
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

  const StyledChart = styled(Chart)(() => ({
    [`&.${classes.chart}`]: {
      paddingRight: '20px',
    },
  }));

  return (
    <Paper
      sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}
      xs={24}
      sm={16}
      md={10}
    >
      <CssBaseline />
      <Title>Future Projections</Title>

      <StyledChart data={data} className={classes.chart}>
        <ArgumentAxis tickFormat={format} />
        <ValueAxis />
        <LineSeries valueField="y" argumentField="x" />
        {/* <LineSeries name="TV news" valueField="tvNews" argumentField="year" />
        <LineSeries name="Church" valueField="church" argumentField="year" />
        <LineSeries
          name="Military"
          valueField="military"
          argumentField="year"
        />
        <LineSeries name="Dog" valueField="dogX" argumentField="year" /> */}
        <EventTracker />
        <Tooltip />
        <Animation />
      </StyledChart>
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
