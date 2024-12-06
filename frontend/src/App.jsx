import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import Workouts from './components/WorkoutsPage/Workouts';
import Milestones from './components/MilestonesPage/Milestones';
import HomePage from './components/HomePage/HomePage';
import FriendProfilePage from './components/HomePage/components/FriendCard/FriendProfilePage';
import FriendsPage from './components/FriendsPage/Friends';
import CompetitionsPage from './components/CompetitionsPage/CompetitionsPage';
import ProfilePage from './components/ProfilePage/Profile'
const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/" element={<RegisterForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/Home" element={<HomePage />} />
                    <Route path="/Workouts" element={<Workouts />} />
                    <Route path="/Competitions" element={<CompetitionsPage />} />
                    <Route path="/Milestones" element={<Milestones />} />
                    <Route path="/Friends" element={<FriendsPage />} />
                    <Route path="/profile/:friendId" element={<FriendProfilePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
