import React, { useState, useEffect } from 'react';
import './TopBar.css';
import { useNavigate } from "react-router-dom";
import useWindowWidth from '../ScreenSize/ScreenSize';"frontend/src/components/ScreenSize/ScreenSize.jsx";

function TopBar({titleClass, workoutClass, compClass, milestonesClass, friendsClass, profileClass}) {
  const navigate = useNavigate();
  const isWideScreen = useWindowWidth(1200);

  const openHomePage = () => {
      navigate("/Home");
  };
  const openWorkoutsPage = () => {
    navigate("/Workouts");
  };
  const openCompetitionsPage = () => {
    navigate("/Competitions");
  };
  const openMilestonesPage = () => {
    navigate("/Milestones");
  };
  const openFriendsPage = () => {
    navigate("/Friends");
  };
  const openProfilePage = () => {
    navigate("/Profile");
  };
  return (
    <div className='topbar-container'>
      <header className="the-header">
        <div className="logo-div" >
            <div className="logo-button" onClick={openHomePage}></div>
            <div className={`logo-name ${titleClass}`} onClick={openHomePage}>{isWideScreen && 'Fitness Pal Pro'}</div>
        </div>
        <div className="menubar-div" >
            <div class={`menu-button ${workoutClass}`} onClick={openWorkoutsPage}>Workouts</div>
            <div class={`menu-button ${compClass}`} onClick={openCompetitionsPage}>Competitions</div>
            <div class={`menu-button ${milestonesClass}`} onClick={openMilestonesPage}>Milestones</div>
            <div class={`menu-button ${friendsClass}`} onClick={openFriendsPage}>Friends</div>
            <div class={`the-profile-button ${profileClass}`} onClick={openProfilePage}></div>
        </div>
        </header>
    </div>
  );
}

export default TopBar;
