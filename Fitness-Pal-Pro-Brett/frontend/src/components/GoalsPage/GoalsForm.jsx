import React, { useState, useEffect } from 'react';
import './GoalsForm.css';
import { FaArrowRight } from 'react-icons/fa';

const GoalsForm = () => {
  const userId = localStorage.getItem('user_id'); // Get the user ID from local storage
  console.log(userId);

  const weeklyGoalsSets = [
    ['10,000 Steps', '15,000 Steps', '20,000 Steps'],
    ['5 Workouts', '3 Healthy Meals', 'Drink 2L Water'],
    ['100 Push-ups', '200 Sit-ups', '30 Minutes Cardio'],
  ];

  const monthlyGoalsSets = [
    ['10,000 Steps', '15,000 Steps', '20,000 Steps'],
    ['5 Workouts', '3 Healthy Meals', 'Drink 2L Water'],
    ['100 Push-ups', '200 Sit-ups', '30 Minutes Cardio'],
  ];

  const [currentIndexMonth, setCurrentIndexMonth] = useState(0);
  const [currentIndexWeek, setCurrentIndexWeek] = useState(0);
  const [startMarqueeWeek, setStartMarqueeWeek] = useState(false);
  const [startMarqueeMonth, setStartMarqueeMonth] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]); // Track selected goals

  // Fetch current goals for the user from the database
  useEffect(() => {
    const fetchSelectedGoals = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get_user_goals?user_id=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setSelectedGoals(data); // Store current goals
        } else {
          console.error('Failed to fetch goals:', data.message);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchSelectedGoals();
  }, [userId]);

  const handleGoalToggle = async (goalType, goalName) => {
    const isSelected = selectedGoals.some((goal) => goal.name === goalName && goal.type === goalType);

    try {
      const endpoint = isSelected
        ? 'http://127.0.0.1:5000/remove_goal' // Endpoint for removing a goal
        : 'http://127.0.0.1:5000/add_goal';  // Endpoint for adding a goal

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, goal_name: goalName, goal_type: goalType }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedGoals((prevGoals) =>
          isSelected
            ? prevGoals.filter((goal) => !(goal.name === goalName && goal.type === goalType)) // Remove goal
            : [...prevGoals, { name: goalName, type: goalType }] // Add goal
        );
      } else {
        alert(data.message || 'Failed to toggle goal.');
      }
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  const handleWeeklyButtonClick = () => {
    setStartMarqueeWeek(false);
    setTimeout(() => {
      setStartMarqueeWeek(true);
      setCurrentIndexWeek((prevIndex) => (prevIndex + 1) % weeklyGoalsSets.length);
    }, 50);
  };

  const handleMonthlyButtonClick = () => {
    setStartMarqueeMonth(false);
    setTimeout(() => {
      setStartMarqueeMonth(true);
      setCurrentIndexMonth((prevIndex) => (prevIndex + 1) % monthlyGoalsSets.length);
    }, 50);
  };

  const isGoalSelected = (goalName, goalType) =>
    selectedGoals.some((goal) => goal.name === goalName && goal.type === goalType);

  return (
    <div className='container'>
      <div className='weekly-container'>
        <h1>Weekly Goals</h1>
        <div className="scroller">
          <div className={`scroller-inner ${startMarqueeWeek ? 'start-marquee' : ''}`}>
            {weeklyGoalsSets[currentIndexWeek].map((goal, index) => (
              <button
                key={index}
                className={`skill-button ${isGoalSelected(goal, 'weekly') ? 'selected' : ''}`}
                onClick={() => handleGoalToggle('weekly', goal)}
              >
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
              <button
                key={index}
                className={`skill-button ${isGoalSelected(goal, 'monthly') ? 'selected' : ''}`}
                onClick={() => handleGoalToggle('monthly', goal)}
              >
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