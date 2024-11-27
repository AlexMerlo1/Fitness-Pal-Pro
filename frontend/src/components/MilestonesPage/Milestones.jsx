import React, { useState } from 'react';
import './Milestones.css';
import TopBar from '../TopBar/TopBar.jsx';
import { SlSizeFullscreen } from "react-icons/sl";
// import SimpleGraph from './Components/Graph.jsx';
import BarGraph from './Components/Graph.jsx';
import BarGraphOverlay from './Components/GraphOverlay.jsx';

const Milestones = () => {
  
  const [isBarGraphPopupVisible, setBarGraphPopupVisible] = useState(false);

  const toggleBarGraphPopup = () => {
    setBarGraphPopupVisible(!isBarGraphPopupVisible);
  };


  return (
    <div className='goals-container'>
      <TopBar milestonesClass="ActiveTab"/>
      <div className='milestones-body'>
        <div className="milestones-search-div">
            <div className="milestones-search-bar">Search|</div>
            <div class="milestones-cards">
                <button class="milestones-card">Max Bench</button>
                <button class="milestones-card">Max Steps</button>
                <button class="milestones-card">Max Steps</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
                <button class="milestones-card">Group X Class</button>
            </div>
        </div>
        <div className="graphs-body">
          <div className="goals-div">
            goals
            <div className="zoom-button"></div>
            </div>
          <div className="graph-div">
            <div className="graph-topbar">
            graph1
            <SlSizeFullscreen className="zoom-button" onClick={toggleBarGraphPopup}/>
            </div>
            <div className="graph-display">
              <BarGraph />
            </div>
            </div>
            <div className="graph-div">
            <div className="graph-topbar">
            graph1
            <SlSizeFullscreen className="zoom-button" onClick={toggleBarGraphPopup}/>
            </div>
            <div className="graph-display">
              <BarGraph />
            </div>
            </div>
            <div className="graph-div">
            <div className="graph-topbar">
            graph1
            <SlSizeFullscreen className="zoom-button" onClick={toggleBarGraphPopup}/>
            </div>
            <div className="graph-display">
              <BarGraph />
            </div>
            </div>
        </div>
      </div>


      {isBarGraphPopupVisible && <BarGraphOverlay onClose={toggleBarGraphPopup} />}
      {/* {isBarGraphPopupVisible && <FriendsPopup onClose={toggleBarGraphPopup} />} */}
    </div>
  );
};

export default Milestones;
