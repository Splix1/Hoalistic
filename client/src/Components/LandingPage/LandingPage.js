import React, { useState, useEffect } from 'react';
import './LandingPage.css';

function LandingPage() {
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');

  return (
    <main id="landing-page">
      <div id="landing-top">
        <div id="landing-text">
          <h1>The living, breathing, HOA Dashboard</h1>
          <h2>
            By managing your HOA through Young HOAmie, your HOA process is
            simplified. Keep track of all to-do items, records, votes, scheduled
            maintenance. Increase your resale value!
          </h2>
        </div>
        <div id="login-panel">
          <h2>Sign Up or Log In</h2>
          <div id="form-container">
            <form className="login-form">
              <div className="form-element">
                <label htmlFor="firstName">First Name </label>
                <input
                  name="firstName"
                  type="text"
                  className="form-element"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>
              <div className="form-element">
                <label htmlFor="lastName">Last Name </label>
                <input
                  name="lastName"
                  type="text"
                  className="form-element"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="landing-bottom"></div>
    </main>
  );
}

export default LandingPage;
