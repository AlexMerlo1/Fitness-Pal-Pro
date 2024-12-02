import React, { useState, useEffect } from 'react';
import './GoalsForm.css';
import { FaArrowRight } from 'react-icons/fa';

const GoalsForm = () => {
  const userId = localStorage.getItem('user_id');

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

  const [weeklyGoalsSets, setWeeklyGoalsSets] = useState(initialWeeklyGoals);
  const [monthlyGoalsSets, setMonthlyGoalsSets] = useState(initialMonthlyGoals);
  const [currentIndexWeek, setCurrentIndexWeek] = useState(0);
  const [currentIndexMonth, setCurrentIndexMonth] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [goalType, setGoalType] = useState('weekly');
  const [friendsGoals, setFriendsGoals] = useState([]);
  const [showFriendsPopup, setShowFriendsPopup] = useState(false);

  // Fetch goals on load
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get_goal_progress?user_id=${userId}`);
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

  // Fetch friends' goals
  const fetchFriendsGoals = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/friends_goals?user_id=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setFriendsGoals(data);
      } else {
        console.error('Error fetching friends goals:', data.message);
      }
    } catch (error) {
      console.error('Error fetching friends goals:', error);
    }
  };

  // Helper function to chunk array into pages
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Add a new custom goal
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
          const updatedWeeklyGoals = [...weeklyGoalsSets.flat(), newGoalName];
          setWeeklyGoalsSets(chunkArray(updatedWeeklyGoals, 3));
        } else {
          const updatedMonthlyGoals = [...monthlyGoalsSets.flat(), newGoalName];
          setMonthlyGoalsSets(chunkArray(updatedMonthlyGoals, 3));
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

  // Update progress of a goal
  const handleProgressUpdate = async (goalName, newProgress) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/update_goal_progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, goal_name: goalName, progress: newProgress }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal.name === goalName ? { ...goal, progress: newProgress, completed: newProgress >= 100 } : goal
          )
        );
      } else {
        alert(data.message || 'Failed to update progress.');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Toggle goal as active or inactive
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
            : [...prev, { name: goalName, type: goalType, progress: 0, completed: false }]
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
    setCurrentIndexWeek((prevIndex) =>
      weeklyGoalsSets.length > 0 ? (prevIndex + 1) % weeklyGoalsSets.length : 0
    );
  };

  // Navigate monthly goals
  const handleMonthlyButtonClick = () => {
    setCurrentIndexMonth((prevIndex) =>
      monthlyGoalsSets.length > 0 ? (prevIndex + 1) % monthlyGoalsSets.length : 0
    );
  };

  return (
    <div className="container">
      <div className="left-column">
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

        <button className="add-goal-button" onClick={() => setShowPopup(true)}>
          Add Goal
        </button>
        <button className="view-friends-button" onClick={() => {
          setShowFriendsPopup(true);
          fetchFriendsGoals();
        }}>
          View Friends' Goals
        </button>
      </div>

      <div className="right-column">
        <h2>Your Goals</h2>
        {selectedGoals.map((goal, index) => (
          <div key={index} className="goal-item">
            <p>{goal.name} ({goal.type})</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${goal.progress}%` }}></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress}
              onChange={(e) => handleProgressUpdate(goal.name, parseInt(e.target.value))}
            />
            <p>{goal.progress}%</p>
          </div>
        ))}
      </div>

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

      {showFriendsPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Friends' Goals</h2>
            <button onClick={() => setShowFriendsPopup(false)}>Close</button>
            {friendsGoals.length > 0 ? (
              friendsGoals.map((goal, index) => (
                <div key={index} className="friend-goal-item">
                  <p>
                    <strong>{goal.friend_username}</strong>: {goal.goal_name} ({goal.goal_type})
                  </p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                  <p>{goal.progress}%</p>
                </div>
              ))
            ) : (
              <p>No friends' goals to display.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsForm;