import React, { useState } from 'react';
import './TopBar.css';

function TopBar({titleClass, workoutClass, compClass, milestonesClass, friendsClass, profileClass}) {

  // for top menu bar
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  const openHomePage = () => {
      window.open("http://localhost:3000/Home");
  };
  const openWorkoutsPage = () => {
      window.open("http://localhost:3000/Workouts");
  };
  const openCompetitionsPage = () => {
      window.open("http://localhost:3000/Competitions");
  };
  const openMilestonesPage = () => {
      window.open("http://localhost:3000/Milestones");
  };
  const openFriendsPage = () => {
      window.open("http://localhost:3000/Friends");
  };
  const openProfilePage = () => {
    window.open("http://localhost:3000/Profile");
  };
  // end of top menu bar

  return (
    <div className='topbar-container'>
      {/* for top menu bar */}
      <header className="the-header">
        <div className="logo-div" >
            <div className="logo-button" onClick={openHomePage}></div>
            <div className={`logo-name ${titleClass}`} onClick={openHomePage}>Fitness Pal Pro</div>
        </div>
        <div className="menubar-div" >
            <div class={`menu-button ${workoutClass}`} onClick={openWorkoutsPage}>Workouts</div>
            <div class={`menu-button ${compClass}`} onClick={openCompetitionsPage}>Competitions</div>
            <div class={`menu-button ${milestonesClass}`} onClick={openMilestonesPage}>Milestones</div>
            <div class={`menu-button ${friendsClass}`} onClick={openFriendsPage}>Friends</div>
            <div class={`the-profile-button ${profileClass}`} onClick={openProfilePage}></div>
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
    </div>
  );
}

export default TopBar;
