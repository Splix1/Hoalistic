import React, { useEffect, useContext } from 'react';
import './App.css';
import Routes from './Routes';
import NavBar from './Components/NavBar/NavBar';
import supabase from './client';
import { setUser } from './Store/User';
import { Context } from './Components/ContextProvider';
import { useLocation, useHistory, useParams } from 'react-router-dom';

function App() {
  const { state, dispatch } = useContext(Context);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const user = supabase.auth.session();
    dispatch(setUser(user));
    const searchParams = new URLSearchParams(location.hash);
    if (searchParams.getAll('type').includes('recovery')) {
      const access_token =
        searchParams.get('#access_token') || searchParams.get('access_token');
      dispatch(setUser({ ...state, access_token: access_token }));
      history.push('/resetpassword');
    }
  }, []);

  return (
    <div className="App">
      <NavBar id="navbar" />
      <Routes />
    </div>
  );
}

export default App;
