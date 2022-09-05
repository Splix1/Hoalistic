import React from 'react';
import './stepTwo.scss';

const StepTwo = () => {
  return (
    <div className="stepTwo">
      <div className="team-header">
        <h1>Upload and store any documents you may need!</h1>
      </div>
      <div className="team-container">
        <div className="landing-profile-text">
          <div className="landing-profile-header">
            <h3>Upload a picture, video or PDF!</h3>
          </div>
          <div className="landing-profile-content">
            <h3>
              Fill out a quick form with a prompt to directly upload your file!
            </h3>
          </div>
        </div>
        <div className="landing-profile-img">
          <img src="addDocument.png" alt="" />
        </div>
      </div>
      <div className="landing-chat-container">
        <div className="landing-chat-text">
          <div className="landing-chat-header">
            <h3>Define your own mission!</h3>
          </div>
          <div className="landing-chat-content">
            <h3>
              View your profile to see and update your mission statement and any
              other account information!
            </h3>
          </div>
        </div>
        <div className="landing-chat-img">
          <img src="userProfile.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
