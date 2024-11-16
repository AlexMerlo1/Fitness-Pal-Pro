import React from 'react';
import ChallengeTab from './components/ChallengeTab/ChallengeTab';
import WorkoutTab from './components/WorkoutTab/WorkoutTab';
import MilestoneTabs from './components/MilestoneTabs/MilestoneTabs';
import { FaUserFriends, FaCalendar, FaStore, FaEllipsisH } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className='home-page-container'>
      <div className='top-bar'>
        <div className='buttons'>
          <button className='navigation'><FaUserFriends /></button>
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
    </div>
  );
}

export default HomePage;
