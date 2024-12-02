import React, { useState, useEffect } from 'react';
import './Workouts.css';
import TopBar from '../TopBar/TopBar.jsx';
import axios from 'axios';

function Workouts() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [workoutPlansData, setWorkoutPlansData] = useState([]);
  const [showCustomWorkoutPopup, setShowCustomWorkoutPopup] = useState(false);
  const [workout, setWorkout] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [workoutLog, setWorkoutLog] = useState([]);

  // Fetch workout plans from the backend
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/get_workout_plans', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setWorkoutPlansData(response.data); 
        } else {
          console.error('Failed to fetch workout plans:', response);
        }
      } catch (error) {
        console.error('Error fetching workout plans:', error);
      }
    };

    fetchWorkoutPlans();
  }, []); 

  // Fetch workout log for the logged-in user 
  useEffect(() => {
    const fetchWorkoutLog = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/get_workout_log', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setWorkoutLog(response.data.workouts);
        } else {
          console.error('Failed to fetch workouts:', response);
        }
      } catch (error) {
        console.error('Error fetching workout log:', error);
      }
    };

    fetchWorkoutLog();
  }, []);

  const openPopup = (plan) => {
    setSelectedPlan(plan);
  };

  const closePopup = () => {
    setSelectedPlan(null);
    setShowCustomWorkoutPopup(false);
  };

  const handleCustomWorkoutClick = () => {
    setShowCustomWorkoutPopup(true);
  };

  const handleSubmit = async () => {
    const newWorkout = {
      workout_name: workout,
      sets: sets,
      reps: reps,
      weight: weight,
    };
  
    const token = localStorage.getItem('token');  
  
    try {
      const response = await axios.post(
        'http://localhost:5000/create_custom_workout', 
        newWorkout,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        }
      );
      
      if (response.status === 201) {
        // Add the workout to the workout log if the request is successful
        setWorkoutLog([...workoutLog, newWorkout]);
        
        // Reset the form fields
        setWorkout("");
        setSets("");
        setReps("");
        setWeight("");
        setShowCustomWorkoutPopup(false);
  
        console.log("Workout successfully saved:", response.data);
      } else {
        console.error("Failed to save workout:", response);
      }
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  return (
    <div className="WorkoutPage">
      <TopBar workoutClass="ActiveTab" />
      <div className="workout-container">
        <div className="middle-div">
          <div className="workout-plans">
            {workoutPlansData.length > 0 ? (
              workoutPlansData.map((plan, index) => (
                <div key={index} className="workout-plan">
                  <h3>{plan.workout_name}</h3>
                  <p>Created by: {plan.created_by}</p>
                  <button
                    className="viewButton"
                    onClick={() => openPopup(index)}
                  >
                    View workout details
                  </button>
                </div>
              ))
            ) : (
              <p>No workout plans available</p>
            )}
          </div>
        </div>

        <div className="workout-log">
          <h2>Workout Log</h2>
          {workoutLog.length === 0 ? (
            <p>No workouts logged yet</p>
          ) : (
            <ul>
              {workoutLog.map((entry, index) => (
                <li key={index}>
                  <strong>Workout:</strong> {entry.workout_name}, 
                  <strong> Sets:</strong> {entry.sets}, 
                  <strong> Reps:</strong> {entry.reps}, 
                  <strong> Weight:</strong> {entry.weight} lbs
                </li>
              ))}
            </ul>
          )}
          <div className="customWorkout" onClick={handleCustomWorkoutClick}>Add Exercise</div>
        </div>
      </div>

      {selectedPlan !== null && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{workoutPlansData[selectedPlan]?.workout_name}</h2>
            <ul>
              {workoutPlansData[selectedPlan]?.exercises.map((exercise, index) => (
                <li key={index} className="exercise-item">
                  <div className="exercise-info">
                    <strong>Exercise:</strong> {exercise.exercise_name}, 
                    <strong> Sets:</strong> {exercise.sets}, 
                    <strong> Reps:</strong> {exercise.reps}, 
                    <strong> Weight:</strong> {exercise.weight} lbs
                  </div>
                  <div className="play-button">
                    <p>Tutorial</p>
                    <a href={exercise.video_link} target="_blank" rel="noopener noreferrer">
                      ▶
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <button className="closeButton" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {showCustomWorkoutPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Enter Custom Workout Details</h2>
            <label>
              Workout:
              <input
                type="text"
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
              />
            </label>
            <label>
              Sets:
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </label>
            <label>
              Reps:
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </label>
            <label>
              Weight:
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </label>
            <button className="closeButton" onClick={closePopup}>
              Close
            </button>
            <button className="enterButton" onClick={handleSubmit}>
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workouts;
