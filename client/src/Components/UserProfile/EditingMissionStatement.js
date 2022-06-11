import React, { useContext } from 'react';
import { Context } from '../ContextProvider';
import Title from '../Dashboard/Title';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { TextareaAutosize } from '@mui/material';

export default function EditingMissionStatement({ newInfo, setNewInfo }) {
  let { state } = useContext(Context);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 450,
      }}
    >
      <div style={{ marginTop: '2rem' }}>
        <Title>
          <Typography sx={{ fontSize: '2rem' }}>Mission Statement</Typography>
        </Title>
        <TextareaAutosize
          fullWidth
          minRows={3}
          maxLength={300}
          autoCorrect="false"
          onChange={(e) =>
            setNewInfo({ ...newInfo, missionStatement: e.target.value })
          }
          style={{
            fontSize: '1.5rem',
            width: 394,
            height: 300,
            backgroundColor: '#121212',
            color: 'white',
          }}
        >
          {state?.missionStatement}
        </TextareaAutosize>
      </div>
    </Paper>
  );
}
