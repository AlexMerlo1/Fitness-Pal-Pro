import React, { useState, useEffect } from 'react';
import ChallengeTab from './components/ChallengeTab/ChallengeTab';
import WorkoutTab from './components/WorkoutTab/WorkoutTab';
import MilestoneTabs from './components/MilestoneTabs/MilestoneTabs';
import { FaUserFriends, FaCalendar, FaStore, FaEllipsisH, FaBell } from 'react-icons/fa';
import FriendsPopup from './components/FriendsPopUp/FriendsPopUp';
import NotificationsPopup from './components/NotificationPopUp/NotificationsPopup';
import './HomePage.css';

const HomePage = () => {
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

  return (
    <div className='home-page-container'>
      <div className='top-bar'>
        <div className='buttons'>
          <button className='navigation' onClick={togglePopup}><FaUserFriends /></button>
          <button className='navigation'><FaCalendar /></button>
          <button className='navigation'><FaStore /></button>
          <button className='navigation' onClick={toggleNotifications}><FaBell /></button>
        </div>
        <div className='current-balance'>
          750
        </div>
        <div className='settings'><FaEllipsisH /></div>
      </div>
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

      {isPopupVisible && <FriendsPopup friends={friends} onClose={togglePopup} />}
      {isNotificationsVisible && (
        <NotificationsPopup notifications={notifications} onClose={toggleNotifications} />
      )}
    </div>
  );
};

export default HomePage;
