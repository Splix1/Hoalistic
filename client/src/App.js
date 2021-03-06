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
  } = useContext(Context);
  const [session] = useState(supabase.auth.session());
  const location = useLocation();
  const history = useHistory();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = supabase.auth.session();
    const curUser = supabase.auth.user();

    console.log('user', user);
    console.log('session', session);

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

        if (location?.pathname === '/projects')
          await fetchProjects(data[0], dispatchProjects);

        if (location?.pathname === '/costs')
          await fetchCosts(data[0], dispatchCosts);

        if (location?.pathname === '/units')
          await fetchUnits(data[0], dispatchUnits);

        if (location?.pathname === '/documents')
          await fetchDocuments(data[0], dispatchDocuments, dispatchFiles);

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
          dispatchScenarios
        );
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

  useEffect(() => {
    if (checked) {
      console.log('user', supabase.auth.user());
      console.log('session', supabase.auth.session());
    }
  }, [checked]);

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
