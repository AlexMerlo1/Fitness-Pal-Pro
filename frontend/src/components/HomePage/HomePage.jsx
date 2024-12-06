import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import TopBar from '../TopBar/TopBar';
import { useNavigate } from "react-router-dom";
import FriendsPopup from './components/FriendsPopUp/FriendsPopUp';
import NotificationsPopup from './components/NotificationPopUp/NotificationsPopup';



const HomePage = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [friends] = useState([]); // Dummy friends array for now
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/notifications');
        setNotifications(response.data || []); // Fallback to an empty array if response.data is undefined
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // Stop loading spinner once notifications are fetched
      }
    };


    fetchNotifications();
  }, []);


  const toggleFriendsPopup = () => {
    setPopupVisible(!isPopupVisible);
  };


  const toggleNotificationsPopup = () => {
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
  const openProfilePage = () => {
    navigate("/Profile");
  };


  return (
    <div className="home-page-container">
      {/* TopBar component with props */}
      <TopBar
        friendsClass="navigation"
        titleClass="ActiveTitle"
        workoutClass="navigation"
        compClass="navigation"
        milestonesClass="navigation"
        onFriendsClick={toggleFriendsPopup}
        onNotificationsClick={toggleNotificationsPopup}
        notificationsCount={notifications.length}
      />


      {/* <div className="homepage-main">
        <div className="common-container">
          <h1>Need A Challenge?</h1>
        </div>
        <div className="common-container">
          <h1>Need A Challenge?</h1>
        </div>
        <div className="common-container">
          <h1>Need A Challenge?</h1>
        </div>
        <div className="common-container">
          <h1>Need A Challenge?</h1>
        </div>
      </div> */}
      
      <div className="homepage-main">
        <div className="Workouts-Button-big" onClick={openWorkoutsPage}>
          <div className="Workouts-logo-button" onClick={openWorkoutsPage}></div>
          <div className="button-name">Workouts</div></div>
        <div className="Competitions-Button-big" onClick={openCompetitionsPage}>
          <div className="Comp-logo-button" onClick={openCompetitionsPage}></div>
          <div className="button-name">Competitions</div></div>
        <div className="Milestones-Button-big" onClick={openMilestonesPage}>
          <div className="Milestones-logo-button" onClick={openMilestonesPage}></div>
          <div className="button-name">Milestones</div></div>
        <div className="Profile-Button-big">
          <div className="Pofile-logo-button" onClick={openProfilePage}></div>
          <div className="Profile-name-div">
            <div className="Profile-button-name" onClick={openProfilePage}>Profile</div>
            <div className='profile-button-holder'>
              <div className="view-friends" onClick={toggleFriendsPopup}>View Friends</div>
              <div className='view-friends' onClick={toggleNotificationsPopup}>Notifications</div>
            </div>
          </div>
        </div>
      </div>


      {/* Friends Popup */}
      {isPopupVisible && <FriendsPopup friends={friends} onClose={toggleFriendsPopup} />}
      {/* Notifications Popup */}
      {isNotificationsVisible && (
        <NotificationsPopup
          notifications={notifications || []}
          onClose={toggleNotificationsPopup}
        />
      )}
      {loading && <div>Loading notifications...</div>} {/* Loading state */}
    </div>
  );
};


export default HomePage;
