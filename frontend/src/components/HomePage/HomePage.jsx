import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Example of dynamically fetching challenges, workouts, and milestones
  const [challenges, setChallenges] = useState([]); 
  const [workouts, setWorkouts] = useState([]); 
  const [milestones, setMilestones] = useState([]);

  const navigate = useNavigate(); // Hook for navigation

  /*
  // Example of dynamically fetching notifications (useEffect simulating fetch)
  useEffect(() => {
    const fetchedNotifications = [
      'Workout Reminder: 5 PM',
      'Challenge: New Week Starts Tomorrow',
      'Milestone Unlocked!'
    ];
    setNotifications(fetchedNotifications); // Simulate setting fetched notifications
  }, []);*/

  useEffect(() => {
    // Fetch challenges
    fetch('http://127.0.0.1:5000/challenges')
      .then((response) => response.json())
      .then((data) => setChallenges(data))
      .catch((error) => console.error('Error fetching challenges:', error));
  
    // Fetch workouts
    fetch('http://127.0.0.1:5000/workouts')
      .then((response) => response.json())
      .then((data) => setWorkouts(data))
      .catch((error) => console.error('Error fetching workouts:', error));
  
    // Fetch milestones
    fetch('http://127.0.0.1:5000/milestones')
      .then((response) => response.json())
      .then((data) => setMilestones(data))
      .catch((error) => console.error('Error fetching milestones:', error));
  
    // Simulate setting fetched notifications
    const fetchedNotifications = [
      'Workout Reminder: 5 PM',
      'Challenge: New Week Starts Tomorrow',
      'Milestone Unlocked!'
    ];
    setNotifications(fetchedNotifications);
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
          <button className='navigation' onClick={() => navigate('/Goals')}>
            <FaUserFriends /> {/* Navigate to Goals Page */}
          </button>
          <button className='navigation' onClick={() => navigate('/WorkoutPlans')}>
            <FaCalendar /> {/* Navigate to Workout Plans Page */}
          </button>
          <button className='navigation' onClick={() => navigate('/Competitions')}>
            <FaStore /> {/* Navigate to Competitions Page */}
          </button>
          <button className='navigation'><FaCalendar /></button>
          <button className='navigation'><FaStore /></button>
          <button className='navigation' onClick={toggleNotifications}><FaBell /></button>
        </div>
        <div className='current-balance'>750</div>
        <div className='settings'><FaEllipsisH /></div>
      </div>
      <div className='main-content-left'>
        <div className='competitions-large-container'>
          <div className='common-container'>
            <h1>Need A Challenge?</h1>
            {challenges.map((challenge) => (
              <ChallengeTab key={challenge[0]} title={challenge[1]} description={challenge[2]} reward={challenge[3]} />
            ))}
          </div>
        </div>
        <div className='workout-large-container'>
          <h1>Plan Your Next Workout</h1>
          <div className='common-container'>
            {workouts.map((workout) => (
              <WorkoutTab key={workout[0]} name={workout[1]} duration={workout[2]} calories={workout[3]} />
            ))}
          </div>
        </div>
        <div className='character-environment'>Test</div>
        <div className='milestones-contain'>
        {milestones.map((milestone) => (
            <MilestoneTabs key={milestone[0]} name={milestone[1]} progress={milestone[2]} goal={milestone[3]} />
          ))}
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
