import React from 'react';
import './ChallengeTab.css'; 

const ChallengeTab = () => {
  return (
    <div className='challenge-container'>
      <div className='challenge-info'>
        <div className='text-overlay'>
            <p className='competition-duration'>3 Days Left</p>
            <p className='competition-name'>Step Challenge</p>
        </div>
        <p className='challenge-description'>Step Challenge</p>
        <p className='participants-count'>Participants: 120</p>
        <button className='join-button'>Join!</button>
      </div>
    </div>
  );
};

export default ChallengeTab;
