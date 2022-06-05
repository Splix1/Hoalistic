import React, { useEffect, useContext } from 'react';
import './App.css';
import Routes from './Routes';
import NavBar from './Components/NavBar/NavBar';
import supabase from './client';
import { setUser } from './Store/User';
import { Context } from './Components/ContextProvider';
import { useLocation, useHistory } from 'react-router-dom';
import LightOrDark from './Components/LightOrDark';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  const { state, dispatch } = useContext(Context);
  const location = useLocation();
  const history = useHistory();

  async function fetchUser(email) {
    let { data } = await supabase.from('HOAs').select('*').eq('email', email);
    dispatch(setUser(data[0]));
  }

  useEffect(() => {
    const user = supabase.auth.session();
    const curUser = supabase.auth.user();
    if (user.access_token) {
      fetchUser(curUser.email);
    }
    const searchParams = new URLSearchParams(location.hash.replace('#', ''));
    if (searchParams.getAll('type').includes('recovery')) {
      const access_token = searchParams.get('access_token');
      dispatch(setUser({ ...state, access_token: access_token }));
      history.push('/resetpassword');
    }
  }, []);

  return (
    <ThemeProvider theme={LightOrDark()}>
      <div className="App">
        <NavBar id="navbar" />
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
