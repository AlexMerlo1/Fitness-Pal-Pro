import React, { useState } from 'react';
import './Milestones.css';
import TopBar from '../TopBar/TopBar.jsx';
import { SlSizeFullscreen } from "react-icons/sl";
import BarGraph from './Components/Graph.jsx';
import AddData from './Components/AddData.jsx';
import GoalsForm from './Components/GoalsForm.jsx';
import { data1, options1, data3, options3 } from './Components/GraphData.jsx';

const Milestones = () => {
  const [isAddDataPopupVisible, setAddDataPopupVisible] = useState(false);
  const [currentGraphData, setCurrentGraphData] = useState([]);
  const [dataSet1, setDataSet1] = useState(data1.datasets[0].data);
  const [dataSet3, setDataSet3] = useState(data3.datasets[0].data);

  const toggleAddDataPopup = (data = null, setData = null) => {
    setAddDataPopupVisible(!isAddDataPopupVisible);
    if (data) {
      setCurrentGraphData({ data, setData });
    }
  };

  const handleSaveData = (updatedValues) => {
    if (currentGraphData && currentGraphData.setData) {
      currentGraphData.setData(updatedValues);
    }
  };

  return (
    <div className="goals-container">
      <TopBar milestonesClass="ActiveTab" />
      <div className="milestones-body">
        <div className="left-column">
          <GoalsForm />
        </div>
        <div className="graphs-body">
          <div className="graph-div">
            <div className="graph-topbar">
              Body Weight
              <SlSizeFullscreen className="zoom-button" />
            </div>
            <div className="graph-display">
              <BarGraph
                data={{
                  labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  datasets: [{ ...data1.datasets[0], data: dataSet1 }],
                }}
                options={options1}
              />
              <div className="data-button" onClick={() => toggleAddDataPopup(dataSet1, setDataSet1)}>
                Add Data
              </div>
            </div>
          </div>
          <div className="graph-div">
            <div className="graph-topbar">
              Workout Duration
              <SlSizeFullscreen className="zoom-button" />
            </div>
            <div className="graph-display">
              <BarGraph
                data={{
                  labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  datasets: [{ ...data3.datasets[0], data: dataSet3 }],
                }}
                options={options3}
              />
              <div className="data-button" onClick={() => toggleAddDataPopup(dataSet3, setDataSet3)}>
                Add Data
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddDataPopupVisible && (
        <AddData
          onClose={() => toggleAddDataPopup()}
          data={currentGraphData.data}
          onSave={handleSaveData}
        />
      )}
    </div>
  );
};

export default Milestones;
