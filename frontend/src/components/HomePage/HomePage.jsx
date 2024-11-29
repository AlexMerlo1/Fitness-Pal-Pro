import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../TopBar/TopBar';
import FriendsPopup from './components/FriendsPopUp/FriendsPopUp';
import NotificationsPopup from './components/NotificationPopUp/NotificationsPopup';
import FriendProfilePage from './components/FriendCard/FriendProfilePage';
import './HomePage.css';


const HomePage = () => {
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


  return (
    <div className="home-page-container">
      {/* TopBar component with props */}
      <TopBar
        friendsClass="navigation"
        titleClass="logo"
        workoutClass="navigation"
        compClass="navigation"
        milestonesClass="navigation"
        onFriendsClick={toggleFriendsPopup}
        onNotificationsClick={toggleNotificationsPopup}
        notificationsCount={notifications.length}
      />


        <div className="homepage-main">
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
