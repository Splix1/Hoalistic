import React from 'react';
import { Link } from 'react-router-dom';
import './intro.scss';

const Intro = () => {
  return (
    <div className="intro">
      <div className="intro-text">
        <div className="intro-header">
          <h1>Introducing Hoalistic</h1>
        </div>
        <div className="intro-description">
          <h2>
            An all-in-one place for HOAs to organize and store their
            documentation, track budgets and create new projections.
          </h2>
        </div>
        <div className="intro-signup-button display-row">
          <Link to="/login">
            <button>Log in</button>
          </Link>
          <Link to="/signup">
            <button style={{ marginLeft: '1rem' }}>Create an account</button>
          </Link>
        </div>
      </div>

      <div className="world-container">
        <img className="world-img" src="neighborhood.jpg" alt="" />
        <img className="astro-img" src="book.png" alt="" />
      </div>
    </div>
  );
};

export default Intro;
