
import React, { useState } from 'react';
import ChallengeTab from './components/ChallengeTab/ChallengeTab';
import WorkoutTab from './components/WorkoutTab/WorkoutTab';
import MilestoneTabs from './components/MilestoneTabs/MilestoneTabs';
import { FaArrowLeft } from 'react-icons/fa';
import { FaUserFriends, FaCalendar, FaStore, FaEllipsisH } from 'react-icons/fa';
import './HomePage.css';
const FriendsPopup = ({ friends, onClose }) => {
  const handleOverlayClick = (e) => {
    // Close only if the clicked element is the overlay (not the container)
    if (e.target.classList.contains('popup-overlay')) {
      onClose();
    }
  };
  return (
    <div className='popup-overlay' onClick={handleOverlayClick}>
      <div className='popup-container'>
        <div className='header'>
          <h2>Your Friends <br/>2 Friends</h2>
          <input type="text" placeholder="Search.." />
        </div>
        <ul className='friends-list'>
          {friends.map((friend, index) => (
            <li key={index} className='friend-item'>
              {friend}
            </li>
          ))}
        </ul>
        <button className='close-button' onClick={onClose}><FaArrowLeft /></button>
      </div>
    </div>
  );
};
const HomePage = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [friends] = useState(['Alice', 'Bob', 'Charlie', 'Diana']); // Example friends list
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  return (
    <div className='home-page-container'>
      <div className='top-bar'>
        <div className='buttons'>
          <button className='navigation' onClick={togglePopup}><FaUserFriends /></button>
          <button className='navigation'><FaCalendar /></button>
          <button className='navigation'><FaStore /></button>
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
    </div>
  );
};
export default HomePage;
