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
        height: 450,
      }}
    >
      <div style={{ marginTop: '2rem' }}>
        {' '}
        <div>
          <TextField
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            defaultValue={state?.name}
            autoComplete="Jimmie"
            className="editing-unit"
            onChange={(evt) =>
              setNewInfo({ ...newInfo, name: evt.target.value })
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              required
              fullWidth
              id="estYearBuilt"
              label="Year Built"
              name="estYearBuilt"
              defaultValue={state?.estYearBuilt}
              autoComplete="1993"
              className="editing-unit"
              onChange={(evt) =>
                setNewInfo({ ...newInfo, estYearBuilt: +evt.target.value })
              }
            />
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              defaultValue={state?.email}
              autoComplete="there@that.com"
              className="editing-unit"
              onChange={(evt) =>
                setNewInfo({ ...newInfo, email: evt.target.value })
              }
            />
            <TextField
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              defaultValue={state?.address}
              autoComplete="there"
              className="editing-unit"
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
              onChange={(evt) =>
                setNewInfo({ ...newInfo, city: evt.target.value })
              }
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
              onChange={(evt) =>
                setNewInfo({ ...newInfo, zip: +evt.target.value })
              }
            />
          </div>
        </div>
      </div>
    </Paper>
  );
}
