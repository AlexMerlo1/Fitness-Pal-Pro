import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import WorkoutPlans from './components/WorkoutPlans/WorkoutPlans';
import GoalsForm from './components/GoalsPage/GoalsForm';
import HomePage from './components/HomePage/HomePage';
import CompetitionsPage from './components/CompetitionsPage/CompetitionsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/workoutplans" element={<WorkoutPlans />} />
        <Route path="/goals" element={<GoalsForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="*" element={<LoginForm />} /> {/* Redirect to login by default */}
      </Routes>
    </Router>
  );
};

export default App;
