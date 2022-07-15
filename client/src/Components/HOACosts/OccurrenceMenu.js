import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function OccurrenceMenu({ occurrence, setOccurrence }) {
  const handleChange = (event) => {
    setOccurrence(event.target.value);
  };

  return (
    <div>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={occurrence}
          onChange={handleChange}
        >
          <MenuItem value={'monthly'}>Monthly</MenuItem>
          <MenuItem value={'yearly'}>Yearly</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
