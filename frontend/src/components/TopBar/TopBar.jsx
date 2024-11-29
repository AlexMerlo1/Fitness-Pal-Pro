import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendsPopup from '../HomePage/components/FriendsPopUp/FriendsPopUp';
import NotificationsPopup from '../HomePage/components/NotificationPopUp/NotificationsPopup';
import './TopBar.css';
import useWindowWidth from '../ScreenSize/ScreenSize';
import { FaBell } from 'react-icons/fa';


function TopBar({ titleClass, workoutClass, compClass, milestonesClass, friendsClass, profileClass }) {
  const navigate = useNavigate();
  const isWideScreen = useWindowWidth(1200);


  const [isFriendsPopupVisible, setFriendsPopupVisible] = useState(false);
  const [isNotificationsPopupVisible, setNotificationsPopupVisible] = useState(false);


  const openHomePage = () => {
    navigate('/Home');
  };


  const openWorkoutsPage = () => {
    navigate('/Workouts');
  };


  const openCompetitionsPage = () => {
    navigate('/Competitions');
  };


  const openMilestonesPage = () => {
    navigate('/Milestones');
  };


  const toggleFriendsPopup = () => {
    setFriendsPopupVisible(!isFriendsPopupVisible);
    setNotificationsPopupVisible(false);
  };


  const toggleNotificationsPopup = () => {
    setNotificationsPopupVisible(!isNotificationsPopupVisible);
    setFriendsPopupVisible(false);
  };


  const openProfilePage = () => {
    navigate('/Profile');
  };


  return (
    <div className="topbar-container">
      <header className="the-header">
        <div className="logo-div">
          <div className="logo-button" onClick={openHomePage}></div>
          <div className={`logo-name ${titleClass}`} onClick={openHomePage}>
            {isWideScreen && 'Fitness Pal Pro'}
          </div>
        </div>
        <div className="menubar-div">
          <div className={`menu-button ${workoutClass}`} onClick={openWorkoutsPage}>
            Workouts
          </div>
          <div className={`menu-button ${friendsClass}`} onClick={toggleFriendsPopup}>
            Friends
          </div>
          <div className={`menu-button ${compClass}`} onClick={openCompetitionsPage}>
            Competitions
          </div>
          <div className={`menu-button ${milestonesClass}`} onClick={openMilestonesPage}>
            Milestones
          </div>
          <div className="menu-button notifications-button" onClick={toggleNotificationsPopup}>
            <FaBell />
          </div>
          <div className={`the-profile-button ${profileClass}`} onClick={openProfilePage}></div>
        </div>
      </header>


      {isFriendsPopupVisible && <FriendsPopup onClose={toggleFriendsPopup} />}
      {isNotificationsPopupVisible && <NotificationsPopup onClose={toggleNotificationsPopup} />}
    </div>
  );
}

export default TopBar;