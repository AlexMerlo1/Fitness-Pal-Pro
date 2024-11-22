import React, { useState } from 'react';
import './Profile.css';
import TopBar from '../TopBar/TopBar.jsx';
import { FaArrowRight } from 'react-icons/fa';

const Profile = () => {


  return (
    <div className='goals-container'>

      <TopBar />


      <h1>This is The Profile Page</h1>
    </div>
  );
};

export default Profile;
