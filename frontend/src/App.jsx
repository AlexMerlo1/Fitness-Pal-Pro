import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import Workouts from './components/Workouts/Workouts';
import Milestones from './components/Milestones/Milestones';
import HomePage from './components/HomePage/HomePage';
import CompetitionsPage from './components/CompetitionsPage/CompetitionsPage';
const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/" element={<RegisterForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/Workouts" element={<Workouts />} />
                    <Route path="/Milestones" element={<Milestones />} />
                    <Route path="/Home" element={<HomePage />} />
                    <Route path="/Competitions" element={<CompetitionsPage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
