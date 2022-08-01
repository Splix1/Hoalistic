import React, { useEffect, useContext, useState } from 'react';
import './App.css';
import Routes from './Routes';
import NavBar from './Components/NavBar/NavBar';
import supabase, { storage } from './client';
import { setUser } from './Store/User';
import { setProjects } from './Store/Projects';
import { setCosts } from './Store/Costs';
import { setUnits } from './Store/Units';
import { setDocuments } from './Store/Documents';
import { setFiles } from './Store/Files';
import { Context } from './Components/ContextProvider';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { setScenarios } from './Store/Scenarios';
import { setPlaid } from './Store/Plaid';
import { setTransactions } from './Store/Transactions';
const dayjs = require('dayjs');

export async function fetchUserData(
  user,
  dispatchCosts,
  dispatchProjects,
  dispatchUnits,
  dispatchDocuments,
  dispatchFiles,
  dispatchScenarios
) {
  fetchProjects(user, dispatchProjects);
  fetchCosts(user, dispatchCosts);
  fetchUnits(user, dispatchUnits);
  fetchDocuments(user, dispatchDocuments, dispatchFiles);
  fetchScenarios(user, dispatchScenarios);
}

async function fetchProjects(user, dispatchProjects) {
  let { data: projectsData, error: projectsError } = await supabase
    .from('Projects')
    .select('*')
    .eq('HOA', user?.id);
  dispatchProjects(setProjects(projectsData));
}

async function fetchCosts(user, dispatchCosts) {
  let { data: costsData, error: costsError } = await supabase
    .from('HOA_costs')
    .select('*')
    .eq('HOA', user?.id);

  dispatchCosts(setCosts(costsData));
}

async function fetchUnits(user, dispatchUnits) {
  let { data: unitsData, error: unitsError } = await supabase
    .from('Units')
    .select('*')
    .eq('HOA', user?.id);

  dispatchUnits(setUnits(unitsData));
}

async function fetchDocuments(user, dispatchDocuments, dispatchFiles) {
  let { data: documentsData, error: documentsError } = await supabase
    .from('Documents')
    .select('*')
    .eq('HOA', user?.id);
  dispatchDocuments(setDocuments(documentsData));
  const { data: storageFiles } = await storage.storage
    .from(`${user?.id}`)
    .list();
  dispatchFiles(setFiles(storageFiles));
}

async function fetchScenarios(user, dispatchScenarios) {
  let { data: scenariosData } = await supabase
    .from('Scenarios')
    .select('*')
    .eq('HOA', user?.id);
  dispatchScenarios(setScenarios(scenariosData));
}

export async function fetchTransactions(user, dispatchTransactions) {
  let { data: transactionsData } = await supabase
    .from('transactions')
    .select('*')
    .eq('HOA', user?.id);

  dispatchTransactions(setTransactions(transactionsData));
}

function isTokenExpired(date) {
  let current = dayjs();
  let expiration = dayjs(date);
  return current.diff(expiration) > 0;
}

function App() {
  const {
    state,
    dispatch,
    dispatchUnits,
    dispatchCosts,
    dispatchProjects,
    dispatchDocuments,
    dispatchFiles,
    dispatchScenarios,
    dispatchPlaid,
    dispatchTransactions,
    statePlaid,
  } = useContext(Context);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const user = supabase.auth.session();
    const curUser = supabase.auth.user();

    if (user?.access_token) {
      dispatch(
        setUser({
          id: 123,
          mdTheme: createTheme({ palette: { mode: 'light' } }),
        })
      );
      async function fetchUser() {
        let { data } = await supabase
          .from('HOAs')
          .select('*')
          .eq('email', curUser?.email);
        let { data: accessTokenData } = await supabase
          .from('access_tokens')
          .select('*')
          .eq('HOA', data[0]?.id);

        if (location?.pathname === '/projects')
          await fetchProjects(data[0], dispatchProjects);

        if (location?.pathname === '/costs')
          await fetchCosts(data[0], dispatchCosts);

        if (location?.pathname === '/units')
          await fetchUnits(data[0], dispatchUnits);

        if (location?.pathname === '/documents')
          await fetchDocuments(data[0], dispatchDocuments, dispatchFiles);

        dispatchPlaid(
          setPlaid({
            linkSuccess: false,
            isItemAccess: true,
            linkToken: '', // Don't set to null or error message will show up briefly when site loads
            accessToken: accessTokenData[0]?.access_token || null,
            tokenExpired: isTokenExpired(accessTokenData[0]?.expiration),
            itemId: null,
            isError: false,
            backend: true,
            products: ['transactions'],
            linkTokenError: {
              error_type: '',
              error_code: '',
              error_message: '',
            },
          })
        );
        dispatch(
          setUser({
            ...data[0],
            mdTheme: createTheme({ palette: { mode: data[0].theme } }),
          })
        );
        fetchUserData(
          data[0],
          dispatchCosts,
          dispatchProjects,
          dispatchUnits,
          dispatchDocuments,
          dispatchFiles,
          dispatchScenarios,
          dispatchPlaid,
          statePlaid,
          dispatchTransactions
        );
        fetchTransactions(data[0], dispatchTransactions);
      }
      fetchUser();
    }

    const searchParams = new URLSearchParams(location.hash.replace('#', ''));
    if (searchParams.getAll('type').includes('recovery')) {
      const access_token = searchParams.get('access_token');
      dispatch(setUser({ ...state, access_token: access_token }));
      history.push('/resetpassword');
    }
  }, []);

  return (
    <ThemeProvider theme={state?.mdTheme}>
      <div className="App">
        {state?.id ? <NavBar id="navbar" /> : null}
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
