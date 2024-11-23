import React, { useState, useEffect } from 'react';
import './HomePage.css';
import TopBar from '../TopBar/TopBar.jsx';
import { useNavigate } from "react-router-dom";
import useWindowWidth from "frontend/src/components/ScreenSize/ScreenSize.jsx";



const HomePage = () => {
  const navigate = useNavigate();
  const isWideScreen = useWindowWidth(1200);

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
    <div className='homepage-container'>
      <TopBar titleClass="ActiveTitle"/>
      {/* <h1>This is The Home Page</h1> */}
      <div className="homepage-main">
        <div className="Workouts-Button-big" onClick={openWorkoutsPage}>
          <div className="Workouts-logo-button" onClick={openWorkoutsPage}></div>
          <div className="button-name">{isWideScreen && 'Workouts'}</div></div>
        <div className="Competitions-Button-big" onClick={openCompetitionsPage}>
          <div className="Comp-logo-button" onClick={openCompetitionsPage}></div>
          <div className="button-name">{isWideScreen && 'Competitions'}</div></div>
        <div className="Milestones-Button-big" onClick={openMilestonesPage}>
          <div className="Milestones-logo-button" onClick={openMilestonesPage}></div>
          <div className="button-name">{isWideScreen && 'Milestones'}</div></div>
        <div className="Profile-Button-big">
          <div className="Pofile-logo-button" onClick={openProfilePage}></div>
          <div className="Profile-name-div">
            <div className="Profile-button-name" onClick={openProfilePage}>{isWideScreen && 'Profile'}</div>
            <div className="view-friends" onClick={openFriendsPage}>View Friends</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
