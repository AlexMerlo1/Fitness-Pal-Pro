import React, { useState, useEffect } from 'react';
import './HomePage.css';
import TopBar from '../TopBar/TopBar.jsx';
import { useNavigate } from "react-router-dom";
import useWindowWidth from "frontend/src/components/ScreenSize/ScreenSize.jsx";
import FriendsPopup from './components/FriendsPopUp/FriendsPopUp';
import NotificationsPopup from './components/NotificationPopUp/NotificationsPopup';



const HomePage = () => {
  const navigate = useNavigate();
  const isWideScreen = useWindowWidth(1200);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [friends] = useState(['Alice', 'Bob', 'Charlie', 'Diana']); // Example friends list
  const [notifications, setNotifications] = useState([]); // Start with empty notifications

  // Example of dynamically fetching notifications (useEffect simulating fetch)
  useEffect(() => {
    const fetchedNotifications = [
      'Workout Reminder: 5 PM',
      'Challenge: New Week Starts Tomorrow',
      'Milestone Unlocked!'
    ];
    setNotifications(fetchedNotifications); // Simulate setting fetched notifications
  }, []);
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  const toggleNotifications = () => {
    setNotificationsVisible(!isNotificationsVisible);
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

  // Example of dynamically fetching notifications (useEffect simulating fetch)
  useEffect(() => {
    const fetchedNotifications = [
      'Workout Reminder: 5 PM',
      'Challenge: New Week Starts Tomorrow',
      'Milestone Unlocked!'
    ];
    setNotifications(fetchedNotifications); // Simulate setting fetched notifications
  }, []);

  return (
    <div className='homepage-container'>
      <TopBar titleClass="ActiveTitle"/>
      {/* <h1>This is The Home Page</h1> */}
      <button className='navigation' onClick={togglePopup}>Alexs Friends</button>
      <button className='navigation' onClick={toggleNotifications}>Alexs Notifications</button>
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
      {isPopupVisible && <FriendsPopup friends={friends} onClose={togglePopup} />}
      {isNotificationsVisible && (
        <NotificationsPopup notifications={notifications} onClose={toggleNotifications} />
      )}
    </div>
  );
};

export default HomePage;
