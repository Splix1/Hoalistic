import React, { useContext } from 'react';
import { Context } from '../ContextProvider';
import Title from '../Dashboard/Title';
import { Typography, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';

export default function EditingBasicInfo({ newInfo, setNewInfo }) {
  let { state } = useContext(Context);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 550,
      }}
    >
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {' '}
        <TextField
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          defaultValue={state?.name}
          autoComplete="Jimmie"
          className="form-spacing"
          style={{ marginBottom: '1rem' }}
          onChange={(evt) => setNewInfo({ ...newInfo, name: evt.target.value })}
        />
        <TextField
          required
          fullWidth
          id="estYearBuilt"
          label="Year Built"
          name="estYearBuilt"
          defaultValue={state?.estYearBuilt}
          autoComplete="1993"
          className="editing-unit"
          style={{ marginBottom: '1rem' }}
          onChange={(evt) =>
            setNewInfo({ ...newInfo, estYearBuilt: +evt.target.value })
          }
        />
        <Typography
          sx={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
          }}
        >
          {state?.email}
        </Typography>
        <TextField
          required
          fullWidth
          id="address"
          label="Address"
          name="address"
          defaultValue={state?.address}
          autoComplete="there"
          className="editing-unit"
          style={{ marginBottom: '1rem' }}
          onChange={(evt) =>
            setNewInfo({ ...newInfo, address: evt.target.value })
          }
        />
        <TextField
          required
          fullWidth
          id="city"
          label="City"
          name="city"
          defaultValue={state?.city}
          autoComplete="Urmawm"
          className="editing-unit"
          style={{ marginBottom: '1rem' }}
          onChange={(evt) => setNewInfo({ ...newInfo, city: evt.target.value })}
        />
        <TextField
          required
          fullWidth
          id="state"
          label="State"
          name="state"
          defaultValue={state?.state}
          autoComplete="WA"
          className="editing-unit"
          style={{ marginBottom: '1rem' }}
          onChange={(evt) =>
            setNewInfo({ ...newInfo, state: evt.target.value })
          }
        />
        <TextField
          required
          fullWidth
          id="zip"
          label="Zip"
          name="zip"
          defaultValue={state?.zip}
          autoComplete="93543"
          className="editing-unit"
          onChange={(evt) => setNewInfo({ ...newInfo, zip: +evt.target.value })}
        />
      </div>
    </Paper>
  );
}
