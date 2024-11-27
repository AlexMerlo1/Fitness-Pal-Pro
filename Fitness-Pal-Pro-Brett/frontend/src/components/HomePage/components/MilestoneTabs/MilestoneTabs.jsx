import React from 'react';
import './MilestoneTabs.css'; // Add this CSS file for styling if needed

const MilestoneTabs = ({ name, progress, goal }) => {
  return (
    <div className='milestone-tab'>
      <h3 className='milestone-name'>{name}</h3>
      <p className='milestone-progress'>Progress: {progress}%</p>
      <p className='milestone-goal'>Goal: {goal}</p>
      <progress value={progress} max="100" className='progress-bar'></progress>
    </div>
  );
};

export default MilestoneTabs;
