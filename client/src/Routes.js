import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import supabase from './client';
import LandingPage from './Components/LandingPage/LandingPage';

function Routes() {
  //   const isLoggedIn = supabase.auth.user();
  const isLoggedIn = false;

  return (
    <div>
      {isLoggedIn ? (
        <Switch></Switch>
      ) : (
        <Switch>
          <Route path="*" component={LandingPage} />
        </Switch>
      )}
    </div>
  );
}

export default Routes;
