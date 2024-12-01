import React, { useState, useEffect } from 'react';
import './WorkoutPlans.css';

function WorkoutPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showCustomWorkoutPopup, setShowCustomWorkoutPopup] = useState(false);
  const [workout, setWorkout] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [workoutLog, setWorkoutLog] = useState([]);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentPlanExercises, setCurrentPlanExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(0);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchWorkouts();
    fetchWorkoutLogs();
  }, []);
  
  const fetchWorkoutLogs = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_workout_logs?user_id=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setWorkoutLog(data);
      } else {
        alert(data.message || 'Failed to fetch workout logs.');
      }
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      alert('An error occurred while fetching workout logs.');
    }
  };
  
  

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_workouts?user_id=${userId}`);
      const data = await response.json();
      if (response.ok) {
        const formattedPlans = [
          ...data.prebuilt.map((plan) => ({
            name: plan.name,
            exercises: [{ exercise: plan.name, sets: plan.sets, reps: plan.reps, weight: plan.weight }],
          })),
          ...data.custom.map((plan) => ({
            name: plan.name,
            exercises: [{ exercise: plan.name, sets: plan.sets, reps: plan.reps, weight: plan.weight }],
          })),
        ];
        setWorkoutPlans(formattedPlans);
      } else {
        alert(data.message || 'Failed to fetch workouts.');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      alert('An error occurred while fetching workouts.');
    }
  };

  const openPopup = (plan) => {
    setSelectedPlan(plan);
  };

  const closePopup = () => {
    setSelectedPlan(null);
    setShowCustomWorkoutPopup(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCustomWorkoutClick = () => {
    setShowCustomWorkoutPopup(true);
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    const newWorkout = { name: workout, sets, reps, weight };

    try {
      const response = await fetch('http://127.0.0.1:5000/save_custom_workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ...newWorkout }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Custom workout saved successfully!');
        fetchWorkouts(); // Refresh the workout list
        setWorkout("");
        setSets("");
        setReps("");
        setWeight("");
        setShowCustomWorkoutPopup(false);
      } else {
        alert(data.message || 'Failed to save custom workout.');
      }
    } catch (error) {
      console.error('Error saving custom workout:', error);
      alert('An error occurred while saving the custom workout.');
    }
  };

  const startWorkout = (plan) => {
    const exercises = plan.exercises || [];
    const totalSetsCount = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);

    setShowProgressBar(true);
    setCurrentWorkout(plan.name);
    setProgress(0);
    setCurrentPlanExercises(exercises);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setTotalSets(totalSetsCount);
    closePopup();
  };

  const saveWorkoutLog = async (workoutLogEntry) => {
    if (!userId) {
      alert("User not logged in");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/save_workout_log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...workoutLogEntry }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Add the log with a current date to the state
        const newLog = { ...workoutLogEntry, date: new Date().toISOString() };
        setWorkoutLog((prevLog) => [newLog, ...prevLog]); // Add to the top
      } else {
        alert(data.message || "Failed to save workout log.");
      }
    } catch (error) {
      console.error("Error saving workout log:", error);
      alert("An error occurred while saving the workout log.");
    }
  };
  
   

  const handleNextExercise = () => {
    setProgress((prev) => {
      const increment = 100 / totalSets;
      const newProgress = Math.min(prev + increment, 100);

      if (newProgress >= 100) {
        const completedWorkoutLog = currentPlanExercises.map((exercise) => ({
          workout_name: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        }));

        // Save logs to backend
        completedWorkoutLog.forEach((log) => saveWorkoutLog(log));

        setWorkoutLog((prevLog) => [...prevLog, ...completedWorkoutLog]);
        setShowProgressBar(false);
      }
      return newProgress;
    });

    const currentExercise = currentPlanExercises[currentExerciseIndex];
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
    } else if (currentExerciseIndex < currentPlanExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Workout Plans</h1>
        <button className="customWorkout" onClick={handleCustomWorkoutClick}>
          Custom Workout
        </button>
        <div className="profile-button" onClick={toggleDropdown}></div>
        {dropdownVisible && (
          <div className="dropdown-menu">
            <ul>
              <li>View Profile</li>
              <li>Settings</li>
              <li>Log Out</li>
            </ul>
          </div>
        )}
      </header>
      <div className="workout-container">
        <div className="workout-plans">
          {workoutPlans.map((plan, index) => (
            <div key={index} className="workout-plan">
              <h3>{plan.name}</h3>
              <button className="viewButton" onClick={() => openPopup(plan)}>
                View workout details
              </button>
            </div>
          ))}
        </div>
        <div className="workout-log">
          <h2>Workout Log</h2>
          {workoutLog.length === 0 ? (
            <p>No workouts logged yet</p>
          ) : (
            <ul>
              {workoutLog.map((entry, index) => (
                <li key={index}>
                  <strong>Workout:</strong> {entry.workout_name || 'Custom Workout'}, 
                  <strong> Sets:</strong> {entry.sets || 'N/A'}, 
                  <strong> Reps:</strong> {entry.reps || 'N/A'}, 
                  <strong> Weight:</strong> {entry.weight || 'N/A'} lbs, 
                  <strong> Date:</strong> {entry.date || 'N/A'}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedPlan && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPlan.name} Details</h2>
            <ul>
              {selectedPlan.exercises.map((exercise, index) => (
                <li key={index}>
                  <strong>Exercise:</strong> {exercise.exercise}, 
                  <strong> Sets:</strong> {exercise.sets}, 
                  <strong> Reps:</strong> {exercise.reps}, 
                  <strong> Weight:</strong> {exercise.weight} lbs
                </li>
              ))}
            </ul>
            <button className="closeButton" onClick={closePopup}>
              Close
            </button>
            <button className="enterButton" onClick={() => startWorkout(selectedPlan)}>
              Start Workout
            </button>
          </div>
        </div>
      )}

      {showCustomWorkoutPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add a Custom Workout</h2>
            <input
              type="text"
              placeholder="Workout Name"
              value={workout}
              onChange={(e) => setWorkout(e.target.value)}
            />
            <input
              type="number"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <div className="popup-buttons">
              <button className="closeButton" onClick={closePopup}>
                Cancel
              </button>
              <button className="enterButton" onClick={handleSubmit}>
                Save Workout
              </button>
            </div>
          </div>
        </div>
      )}


      {showProgressBar && (
        <div className="progress-container">
          <h2>{currentWorkout}</h2>
          {currentPlanExercises[currentExerciseIndex] && (
            <p>
              <strong>Exercise:</strong> {currentPlanExercises[currentExerciseIndex].exercise} | 
              <strong> Set:</strong> {currentSet} of {currentPlanExercises[currentExerciseIndex].sets}
            </p>
          )}
          <button className="progressButton" onClick={handleNextExercise}>
            Next Exercise
          </button>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutPlans;
