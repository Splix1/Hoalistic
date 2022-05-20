import React, { useEffect, useContext } from 'react';
import './App.css';
import Routes from './Routes';
import NavBar from './Components/NavBar/NavBar';
import supabase from './client';
import { setUser } from './Store/User';
import { Context } from './Components/ContextProvider';

function App() {
  const { dispatch } = useContext(Context);

  useEffect(() => {
    let user = supabase.auth.user();
    dispatch(setUser(user));
  }, []);

  return (
    <div className="App">
      <NavBar />
      <Routes />
    </div>
  );
}

export default App;
