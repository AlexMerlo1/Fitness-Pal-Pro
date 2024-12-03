import React, { useState } from 'react';
import './Profile.css';
import TopBar from '../TopBar/TopBar.jsx';
import { FaArrowRight } from 'react-icons/fa';

const ProfilePage = () => {

  const Logout = () => {

  }

  return (
    <div className='profile-page-container'>
        <TopBar profileClass="ActiveProfile"/>
        <div className="profile-main">
          <div className="profile-photo"></div>
          <h1>Logged in as BenBraniff</h1>
          <div className='logout-button' onClick={Logout}>Log Out</div>
        </div>
    </div>
  );
};

export default ProfilePage;
