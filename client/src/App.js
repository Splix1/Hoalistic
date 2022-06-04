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
  const params = useParams();

  useEffect(() => {
    let user = supabase.auth.user();
    dispatch(setUser(user));
    if (location.hash.includes('type=recovery')) {
      let access_token = location.hash.split('&')[0].slice(14);
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
