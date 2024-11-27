import React, { useState, useEffect } from 'react';
import './GoalsForm.css';
import { FaArrowRight } from 'react-icons/fa';

const GoalsForm = () => {
  const userId = localStorage.getItem('user_id');

  // Preset goals
  const initialWeeklyGoals = [
    ['10,000 Steps', '15,000 Steps', '20,000 Steps'],
    ['5 Workouts', '3 Healthy Meals', 'Drink 2L Water'],
    ['100 Push-ups', '200 Sit-ups', '30 Minutes Cardio'],
  ];

  const initialMonthlyGoals = [
    ['10,000 Steps', '15,000 Steps', '20,000 Steps'],
    ['5 Workouts', '3 Healthy Meals', 'Drink 2L Water'],
    ['100 Push-ups', '200 Sit-ups', '30 Minutes Cardio'],
  ];

  // State for goals
  const [weeklyGoalsSets, setWeeklyGoalsSets] = useState(initialWeeklyGoals);
  const [monthlyGoalsSets, setMonthlyGoalsSets] = useState(initialMonthlyGoals);
  const [currentIndexWeek, setCurrentIndexWeek] = useState(0);
  const [currentIndexMonth, setCurrentIndexMonth] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [goalType, setGoalType] = useState('weekly');

  // Fetch user-specific goals on load
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get_user_goals?user_id=${userId}`);
        const data = await response.json();
        if (response.ok) {
          const weeklyGoals = [...initialWeeklyGoals.flat()];
          const monthlyGoals = [...initialMonthlyGoals.flat()];
          data.forEach((goal) => {
            if (goal.type === 'weekly') weeklyGoals.push(goal.name);
            if (goal.type === 'monthly') monthlyGoals.push(goal.name);
          });
          setWeeklyGoalsSets(chunkArray(weeklyGoals, 3));
          setMonthlyGoalsSets(chunkArray(monthlyGoals, 3));
          setSelectedGoals(data);
        } else {
          console.error('Error fetching goals:', data.message);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };
    fetchGoals();
  }, [userId]);

  // Helper function to chunk goals into pages
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Add custom goal
  const handleAddCustomGoal = async () => {
    if (!newGoalName.trim()) {
      alert('Goal name cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/add_goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, goal_name: newGoalName, goal_type: goalType }),
      });

      const data = await response.json();
      if (response.ok) {
        if (goalType === 'weekly') {
          setWeeklyGoalsSets((prevGoals) => chunkArray([...prevGoals.flat(), newGoalName], 3));
        } else {
          setMonthlyGoalsSets((prevGoals) => chunkArray([...prevGoals.flat(), newGoalName], 3));
        }
        setShowPopup(false);
        setNewGoalName('');
        alert('Goal added successfully!');
      } else {
        alert(data.message || 'Failed to add goal.');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  // Toggle goal as active/inactive
  const handleGoalToggle = async (goalType, goalName) => {
    const isSelected = selectedGoals.some((goal) => goal.name === goalName && goal.type === goalType);

    try {
      const endpoint = isSelected ? '/remove_goal' : '/add_goal';
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, goal_name: goalName, goal_type: goalType }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedGoals((prev) =>
          isSelected
            ? prev.filter((goal) => !(goal.name === goalName && goal.type === goalType))
            : [...prev, { name: goalName, type: goalType, completed: false }]
        );
      } else {
        alert(data.message || 'Failed to toggle goal.');
      }
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  // Navigate weekly goals
  const handleWeeklyButtonClick = () => {
    setCurrentIndexWeek((prevIndex) => (prevIndex + 1) % weeklyGoalsSets.length);
  };

  // Navigate monthly goals
  const handleMonthlyButtonClick = () => {
    setCurrentIndexMonth((prevIndex) => (prevIndex + 1) % monthlyGoalsSets.length);
  };

  return (
    <div className="container">
      {/* Weekly Goals */}
      <div className="weekly-container">
        <h1>Weekly Goals</h1>
        <div className="scroller">
          {weeklyGoalsSets[currentIndexWeek]?.map((goal, index) => (
            <button
              key={index}
              className={`skill-button ${
                selectedGoals.some((g) => g.name === goal && g.type === 'weekly') ? 'selected' : ''
              }`}
              onClick={() => handleGoalToggle('weekly', goal)}
            >
              {goal}
            </button>
          ))}
          <button className="button-submit" onClick={handleWeeklyButtonClick}>
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Monthly Goals */}
      <div className="monthly-container">
        <h1>Monthly Goals</h1>
        <div className="scroller">
          {monthlyGoalsSets[currentIndexMonth]?.map((goal, index) => (
            <button
              key={index}
              className={`skill-button ${
                selectedGoals.some((g) => g.name === goal && g.type === 'monthly') ? 'selected' : ''
              }`}
              onClick={() => handleGoalToggle('monthly', goal)}
            >
              {goal}
            </button>
          ))}
          <button className="button-submit" onClick={handleMonthlyButtonClick}>
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Add Goal Popup */}
      <button className="add-goal-button" onClick={() => setShowPopup(true)}>
        Add Goal
      </button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add a New Goal</h2>
            <input
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Goal Name"
            />
            <div>
              <label>
                <input
                  type="radio"
                  value="weekly"
                  checked={goalType === 'weekly'}
                  onChange={() => setGoalType('weekly')}
                />
                Weekly
              </label>
              <label>
                <input
                  type="radio"
                  value="monthly"
                  checked={goalType === 'monthly'}
                  onChange={() => setGoalType('monthly')}
                />
                Monthly
              </label>
            </div>
            <button onClick={handleAddCustomGoal}>Add</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsForm;
