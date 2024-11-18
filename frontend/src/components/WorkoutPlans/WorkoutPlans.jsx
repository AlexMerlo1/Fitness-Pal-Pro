import React, { useState } from 'react';
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

  const workoutPlansData = {
    1: [
      { exercise: 'Bench Press', sets: 3, reps: 10, weight: 135 },
      { exercise: 'Squats', sets: 3, reps: 12, weight: 185 },
    ],
    2: [
      { exercise: 'Deadlift', sets: 4, reps: 8, weight: 225 },
      { exercise: 'Pull-Ups', sets: 3, reps: 10, weight: 'Bodyweight' },
      { exercise: 'Lunges', sets: 3, reps: 15, weight: 'Bodyweight' },
      { exercise: 'Bicep Curls', sets: 3, reps: 10, weight: 25 },
    ],
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

  const handleSubmit = () => {
    const newWorkout = {
      workout,
      sets,
      reps,
      weight,
    };
    setWorkoutLog([...workoutLog, newWorkout]);

    setWorkout("");
    setSets("");
    setReps("");
    setWeight("");
    setShowCustomWorkoutPopup(false);
  };

  const startWorkout = (plan) => {
    const exercises = workoutPlansData[plan] || [];
    const totalSetsCount = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);

    setShowProgressBar(true);
    setCurrentWorkout(`Workout Plan ${plan}`);
    setProgress(0);
    setCurrentPlanExercises(exercises);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setTotalSets(totalSetsCount);
    closePopup();
  };

  const handleNextExercise = () => {
    setProgress((prev) => {
      const increment = 100 / totalSets;
      const newProgress = Math.min(prev + increment, 100);

      if (newProgress >= 100) {
        const completedWorkoutLog = currentPlanExercises.map((exercise) => ({
          workout: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        }));
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
          {[1, 2, 3, 4, 5, 6].map((number) => (
            <div key={number} className="workout-plan">
              <h3>Workout Plan {number}</h3>
              <p>Workout description</p>
              <button
                className="viewButton"
                onClick={() => openPopup(number)}
              >
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
                  <strong>Workout:</strong> {entry.workout}, 
                  <strong> Sets:</strong> {entry.sets}, 
                  <strong> Reps:</strong> {entry.reps}, 
                  <strong> Weight:</strong> {entry.weight} lbs
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedPlan && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Workout Plan {selectedPlan} Details</h2>
            <ul>
              {workoutPlansData[selectedPlan]?.map((exercise, index) => (
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
            <button
              className="enterButton"
              onClick={() => startWorkout(selectedPlan)}
            >
              Start Workout
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

      {showProgressBar && (
        <div className="progress-container">
          <h2>{currentWorkout}</h2>
          {currentPlanExercises[currentExerciseIndex] && (
            <p>
              <strong>Exercise:</strong> {currentPlanExercises[currentExerciseIndex].exercise} | 
              <strong> Set:</strong> {currentSet} of {currentPlanExercises[currentExerciseIndex].sets}
            </p>
          )}
          <button className="progressButton" onClick={handleNextExercise}>Next Exercise</button>
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

export default WorkoutPlans