import React, { useState } from 'react';
import './Friends.css';
import TopBar from '../TopBar/TopBar.jsx';
import { FaArrowRight } from 'react-icons/fa';

const Friends = () => {

  return (
    <div className='goals-container'>
      <TopBar friendsClass="ActiveTab"/>
      <h1>This is The Friends Page</h1>
    </div>
  );
};

export default Friends;
