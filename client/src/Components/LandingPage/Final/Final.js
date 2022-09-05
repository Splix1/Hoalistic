import React from 'react';
import { Link } from 'react-router-dom';
import './final.scss';

const Final = () => {
  return (
    <div className="final">
      <div className="content">
        <div className="content-text">
          <div className="content-header">
            <h1>Start your journey now!</h1>
            <div className="content-description">
              <h2></h2>
            </div>
          </div>
          <div className="final-signup">
            <Link to="/signup">
              <button>Create an account</button>
            </Link>
          </div>
        </div>
        {/* <div className="astro-final-img">
          <img
            src="assets/Cute-astronaut-floating-with-balloon-cartoon-on-transparent-background-PNG.png"
            alt=""
          />
        </div> */}
      </div>
    </div>
  );
};

export default Final;
