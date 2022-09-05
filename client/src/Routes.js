import React, { useState, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import SignUp from './Components/SignUp/SignUp';
import Dashboard from './Components/Dashboard/Dashboard';
import { Context } from './Components/ContextProvider';
import Units from './Components/Units/Units';
import Projects from './Components/Projects/Projects';
import HOACosts from './Components/HOACosts/HOACosts';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ForgotPassword/ResetPassword';
import UserProfile from './Components/UserProfile/UserProfile';
import Documents from './Components/Documents/Documents';
import Login from './Components/Login/Login';
import LandingPage from './Components/LandingPage/LandingPage';

function Routes() {
  const { state } = useContext(Context);

  return (
    <div>
      {state?.id ? (
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/units" component={Units} />
          <Route path="/projects" component={Projects} />
          <Route path="/costs" component={HOACosts} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/documents" component={Documents} />
          <Route path="*" component={Dashboard} />
        </Switch>
      ) : (
        <Switch>
          <Route path="/signup" component={SignUp} />
          <Route path="/recoverpassword" component={ForgotPassword} />
          <Route path="/login" component={Login} />
          <Route path="/resetpassword" component={ResetPassword} />
          <Route path="*" component={LandingPage} />
        </Switch>
      )}
    </div>
  );
}

export default Routes;
