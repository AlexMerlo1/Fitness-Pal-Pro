import React from 'react';
import './WorkoutTab.css'; // Add this CSS file for styling if needed

const WorkoutTab = ({ name, duration, calories }) => {
  return (
    <div className='workout-tab'>
      <h3 className='workout-name'>{name}</h3>
      <p className='workout-duration'>Duration: {duration} minutes</p>
      <p className='workout-calories'>Burns: {calories} calories</p>
      <button className='start-button'>Start</button>
    </div>
  );
};

export default WorkoutTab;
