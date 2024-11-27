import React, { useState } from 'react';
import './Milestones.css';
import TopBar from '../TopBar/TopBar.jsx';
import { SlSizeFullscreen } from "react-icons/sl";
// import SimpleGraph from './Components/Graph.jsx';
import BarGraph from './Components/Graph.jsx';
import BarGraphOverlay from './Components/GraphOverlay.jsx';
import {data1, options1, data2, options2, data3, options3, data4, options4, data5, options5, data6, options6} from './Components/GraphData.jsx'

const Milestones = () => {
  
  const [isBarGraphPopupVisible, setBarGraphPopupVisible] = useState(false);
  const [currentGraph, setCurrentGraph] = useState({ data: null, options: null });


  const toggleBarGraphPopup = (graphData = null, graphOptions = null) => {
    setCurrentGraph({ data: graphData, options: graphOptions });
    setBarGraphPopupVisible(!isBarGraphPopupVisible);
  };
  


  return (
    <div className='goals-container'>
      <TopBar milestonesClass="ActiveTab"/>
      <div className='milestones-body'>
        <div className="milestones-search-div">
            {/* <div className="milestones-search-bar">Search|</div> */}
            <input className="milestones-search-bar" type="text" placeholder="Search Milestones"/>
            <div class="milestones-cards">
                <button class="milestones-card">1 Rep Max Bench Press</button>
                <button class="milestones-card">Daily Step Count</button>
                <button class="milestones-card">Workout Duration</button>
                <button class="milestones-card">Body Weight</button>
                <button class="milestones-card">Calories burned per workout</button>
                <button class="milestones-card">Workout Streak</button>
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
            <SlSizeFullscreen className="zoom-button" onClick={() => toggleBarGraphPopup(data1, options1)}/>
            </div>
            <div className="graph-display">
              <BarGraph data={data1} options={options1}/>
            </div>
            </div>
            <div className="graph-div">
            <div className="graph-topbar">
            graph2
            <SlSizeFullscreen className="zoom-button" onClick={() => toggleBarGraphPopup(data2, options2)}/>
            </div>
            <div className="graph-display">
              <BarGraph data={data2} options={options2}/>
            </div>
            </div>
            <div className="graph-div">
            <div className="graph-topbar">
            graph3
            <SlSizeFullscreen className="zoom-button" onClick={() => toggleBarGraphPopup(data3, options3)}/>
            </div>
            <div className="graph-display">
              <BarGraph data={data3} options={options3}/>
            </div>
            </div>
        </div>
      </div>
      {isBarGraphPopupVisible && <BarGraphOverlay onClose={toggleBarGraphPopup} data={currentGraph.data} options={currentGraph.options}/>}
    </div>
  );
};

export default Milestones;
