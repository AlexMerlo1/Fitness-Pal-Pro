import React from 'react';
import './ChallengeTab.css'; 

const ChallengeTab = ({ title, description, reward, participants }) => {
  return (
    <div className='challenge-container'>
      <div className='challenge-info'>
        <div className='text-overlay'>
          <p className='competition-name'>{title}</p>
        </div>
        <p className='challenge-description'>{description}</p>
        <p className='reward'>Reward: {reward} points</p>
        <p className='participants-count'>Participants: {participants}</p>
        <button className='join-button'>Join!</button>
      </div>
    </div>
  );
};

export default ChallengeTab;
