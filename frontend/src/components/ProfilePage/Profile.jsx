import React, { useState } from 'react';
import './Profile.css';
import { FaArrowRight } from 'react-icons/fa';

const Profile = () => {
  // for top menu bar
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  const openHomePage = () => {
      window.open("http://localhost:3000/home");
  };
  const openWorkoutsPage = () => {
      window.open("http://localhost:3000/workouts");
  };
  const openCompetitionsPage = () => {
      window.open("http://localhost:3000/Competitions");
  };
  const openMilestonesPage = () => {
      window.open("http://localhost:3000/Milestones");
  };
  const openFriendsPage = () => {
      window.open("http://localhost:3000/home");
  };
  // end of top menu bar

  return (
    <div className='goals-container'>

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


      <h1>This is The Profile Page</h1>
    </div>
  );
};

export default Profile;
