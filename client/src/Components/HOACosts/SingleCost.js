import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, TextField, Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import supabase from '../../client';
import DeletingCost from './DeletingCost';

const mdTheme = createTheme();

export default function SingleCost({ creatingCost, theCost, costs, setCosts }) {
  let { name, cost } = theCost;
  let [newName, setNewName] = useState(name);
  let [newCost, setNewCost] = useState(cost);
  let [editingCost, setEditingCost] = useState(false);
  let [currentCost, setCost] = useState(theCost);
  let [deletingCost, setDeletingCost] = useState(false);

  function col() {
    return creatingCost ? 'black' : 'white';
  }

  async function updateCost() {
    if (!newName || !newCost) {
      alert('All fields must be fulfilled.');
      return;
    }
    let { data: updatedCost, error } = await supabase
      .from('HOA_costs')
      .update({
        name: newName,
        cost: newCost,
      })
      .eq('id', theCost?.id);
    if (error) {
      alert('There was a problem updating this cost');
      return;
    }

    setCost(updatedCost[0]);
    setEditingCost(false);
  }

  async function deleteCost() {
    let { data } = await supabase
      .from('HOA_costs')
      .delete()
      .eq('id', theCost?.id);
    setCosts(costs.filter((cost) => cost.id !== data[0].id));
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'fit-content',
          justifyContent: 'flex-start',
          backgroundColor: creatingCost ? 'white' : 'gray',
        }}
      >
        {!editingCost ? (
          <div className="single-cost">
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Name: {currentCost?.name}
            </Typography>
            <Typography sx={{ color: col(), fontSize: '1.5rem' }}>
              Cost: ${numberWithCommas(currentCost?.cost)}
            </Typography>

            <div className="display-row">
              <Button variant="contained" onClick={() => setEditingCost(true)}>
                edit
              </Button>
              <Button variant="contained" onClick={() => setDeletingCost(true)}>
                delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="single-cost">
            <TextField
              required
              fullWidth
              id="costName"
              label="Cost Name"
              name="costName"
              defaultValue={currentCost?.name}
              autoComplete="Jimmy"
              className="editing-cost"
              onChange={(evt) => setNewName(evt.target.value)}
            />
            <br />
            <CurrencyInput
              id="Cost"
              name="Cost"
              prefix="$"
              placeholder="Cost"
              defaultValue={currentCost?.cost}
              decimalsLimit={2}
              style={{ height: '3rem', fontSize: '1rem' }}
              onValueChange={(value) => setNewCost(value)}
              className="editing-cost"
            />

            <div className="display-row">
              <Button variant="contained" onClick={updateCost}>
                Save
              </Button>
              <Button variant="contained" onClick={() => setEditingCost(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        {deletingCost ? (
          <DeletingCost
            setDeletingCost={setDeletingCost}
            deleteCost={deleteCost}
          />
        ) : null}
      </Paper>
    </ThemeProvider>
  );
}