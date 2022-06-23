import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import supabase from '../../client';
import CurrencyInput from 'react-currency-input-field';
import { Context } from '../ContextProvider';

const mdTheme = createTheme();

export default function CreateDocument({ setCreatingDocument, newDocument }) {
  let [cost, setCost] = useState(0);
  let [costName, setCostName] = useState('');
  let { state } = useContext(Context);
  let [file, setFile] = useState(null);

  async function createDocument() {
    if (cost < 0) {
      alert('Cost cannot be negative!');
      return;
    }

    let { email } = supabase.auth.user();
    const user = await supabase.from('HOAs').select('*').eq('email', email);

    setCreatingDocument(false);
  }
  console.log(file);
  return (
    <ThemeProvider theme={state?.mdTheme}>
      <CssBaseline />
      <Typography component="h1" variant="h4" sx={{ color: '#90caf9' }}>
        Create Document
      </Typography>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 240,
                justifyContent: 'flex-start',
              }}
            >
              <div id="form-inputs">
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" component="label">
                    Upload File{' '}
                    <input
                      type="file"
                      accept=".jpg, .png, .pdf, .doc"
                      hidden
                      onChange={(evt) => setFile(evt.target.files[0])}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CurrencyInput
                    id="projectCost"
                    name="projectCost"
                    prefix="$"
                    placeholder="Project Cost"
                    defaultValue={0}
                    decimalsLimit={2}
                    style={{
                      height: '3rem',
                      fontSize: '1rem',
                      backgroundColor: '#121212',
                      color: 'white',
                    }}
                    onValueChange={(value) => setCost(value)}
                  />
                </Grid>
              </div>
            </Paper>
            <div id="form-input">
              <Button variant="contained" onClick={createDocument}>
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={() => setCreatingDocument(false)}
              >
                Cancel
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
