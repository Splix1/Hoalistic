import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import supabase from './client';
import LandingPage from './Components/LandingPage/LandingPage';
import SignUp from './Components/SignUp/SignUp';
import Dashboard from './Components/Dashboard/Dashboard';
import { Context } from './Components/ContextProvider';

function Routes() {
  const { state, dispatch } = useContext(Context);

  return (
    <div>
      {state?.id ? (
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      ) : (
        <Switch>
          <Route path="/signup" component={SignUp} />
          <Route path="*" component={LandingPage} />
        </Switch>
      )}
    </div>
  );
}

export default Routes;
