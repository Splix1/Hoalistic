import React, { useEffect, useContext } from 'react';
import './App.css';
import Routes from './Routes';
import NavBar from './Components/NavBar/NavBar';
import supabase from './client';
import { setUser } from './Store/User';
import { Context } from './Components/ContextProvider';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const { state, dispatch } = useContext(Context);
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
        dispatch(
          setUser({
            ...data[0],
            mdTheme: createTheme({ palette: { mode: data[0].theme } }),
          })
        );
      }
      fetchUser();
    }

    const searchParams = new URLSearchParams(location.hash);
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
