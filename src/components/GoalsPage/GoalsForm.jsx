import React, { useState } from 'react';
import './GoalsForm.css';
import { FaArrowRight } from 'react-icons/fa';

const GoalsForm = () => {
  // Weekly Goals
  const weeklyGoalsSets = [
    ['10,000 Steps', '15,000 Steps', '20,000 Steps'],
    ['5 Workouts', '3 Healthy Meals', 'Drink 2L Water'],
    ['100 Push-ups', '200 Sit-ups', '30 Minutes Cardio'],
  ];

  // Monthly Goals
  const monthlyGoalsSets = [
    ['10,000 Steps', '15,000 Steps', '20,000 Steps'],
    ['5 Workouts', '3 Healthy Meals', 'Drink 2L Water'],
    ['100 Push-ups', '200 Sit-ups', '30 Minutes Cardio'],
  ];

  // Track the current set of goals
  const [currentIndexMonth, setCurrentIndexMonth] = useState(0);
  const [currentIndexWeek, setCurrentIndexWeek] = useState(0);

  // State to control marquee
  const [startMarqueeWeek, setStartMarqueeWeek] = useState(false);
  const [startMarqueeMonth, setStartMarqueeMonth] = useState(false);

  const handleWeeklyButtonClick = () => {
    setStartMarqueeWeek(false); // Reset the marquee state
    setTimeout(() => {
      setStartMarqueeWeek(true); // Start the marquee
      setCurrentIndexWeek((prevIndex) => (prevIndex + 1) % weeklyGoalsSets.length); // Move to the next set of weekly goals
    }, 50); 
  };

  const handleMonthlyButtonClick = () => {
    setStartMarqueeMonth(false); // Reset the marquee state
    setTimeout(() => {
      setStartMarqueeMonth(true); // Start the marquee
      setCurrentIndexMonth((prevIndex) => (prevIndex + 1) % monthlyGoalsSets.length); // Move to the next set of monthly goals
    }, 50); 
  };

  return (
    <div className='container'>
      <div className='weekly-container'>
        <h1>Weekly Goals</h1>
        <div className="scroller">
          <div className={`scroller-inner ${startMarqueeWeek ? 'start-marquee' : ''}`}>
            {weeklyGoalsSets[currentIndexWeek].map((goal, index) => (
              <button key={index} className='skill-button'>
                {goal}
              </button>
            ))}
          </div>
          <button className='button-submit' onClick={handleWeeklyButtonClick}>
            <FaArrowRight />
          </button>
        </div>
      </div>
      <div className='monthly-container'>
        <h1>Monthly Goals</h1>
        <div className="scroller">
          <div className={`scroller-inner ${startMarqueeMonth ? 'start-marquee' : ''}`}>
            {monthlyGoalsSets[currentIndexMonth].map((goal, index) => (
              <button key={index} className='skill-button'>
                {goal}
              </button>
            ))}
          </div>
          <button className='button-submit' onClick={handleMonthlyButtonClick}>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalsForm;
