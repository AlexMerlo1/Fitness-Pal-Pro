import React, { useState } from 'react';
import './HomePage.css';
import TopBar from '../TopBar/TopBar.jsx';

const HomePage = () => {

  return (
    <div className='homepage-container'>
      <TopBar/>
      <h1>This is The Home Page</h1>
    </div>
  );
}

export default HomePage;
