import React, { useState } from 'react';
import ChallengeTab from './components/ChallengeTab/ChallengeTab';
import WorkoutTab from './components/WorkoutTab/WorkoutTab';
import MilestoneTabs from './components/MilestoneTabs/MilestoneTabs';
import { FaUserFriends, FaCalendar, FaStore, FaEllipsisH } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {

  // for top menu bar
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  const openHomePage = () => {
      window.open("http://localhost:3000/home");
  };
  const openWorkoutsPage = () => {
      window.open("http://localhost:3000/workoutplans");
  };
  const openCompetitionsPage = () => {
      window.open("http://localhost:3000/Competitions");
  };
  const openMilestonesPage = () => {
      window.open("http://localhost:3000/goals");
  };
  const openFriendsPage = () => {
      window.open("http://localhost:3000/home");
  };
  // end of top menu bar

  return (
    <div className='homepage-container'>
      
      {/* for top menu bar */}
      <header className="the-header">
        <div className="logo-div" >
            <div className="logo-button" onClick={openHomePage}></div>
            <div className="logo-name" onClick={openHomePage}>Fitness Pal Pro</div>
        </div>
        <div className="menubar-div" >
            <div className="menu-button" onClick={openWorkoutsPage}>Workouts</div>
            <div className="menu-button" onClick={openCompetitionsPage}>Competitions</div>
            <div className="menu-button" onClick={openMilestonesPage}>Milestones</div>
            <div className="menu-button" onClick={openFriendsPage}>Friends</div>
            <div className="the-profile-button" onClick={toggleDropdown}></div>
        </div>
        {dropdownVisible && (
        <div className="the-dropdown-menu">
            <ul>
            <li>View Profile</li>
            <li>Settings</li>
            <li>Log Out</li>
            </ul>
        </div>
        )}
        </header>
        {/* end of top menu bar */}
      
      <div className='main-content-left'>
        <div className='competitions-large-container'>
          <div className='common-container'>
          <h1>Need A Challenge?</h1>
            <ChallengeTab />
            <ChallengeTab />
            <ChallengeTab />
          </div>
        </div>
        <div className='workout-large-container'>
          <h1>Plan Your Next Workout</h1>
          <div className='common-container'>
            <WorkoutTab />
            <WorkoutTab />
            <WorkoutTab />
          </div>
        </div>
        <div className='character-environment'>
          Test
        </div>
        <div className='milestones-contain'>
          <MilestoneTabs />
          <MilestoneTabs />
          <MilestoneTabs />
        </div>
        <div className='avatar-container'></div>
      </div>
    </div>
  );
}

export default HomePage;
