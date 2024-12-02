import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import "./AddData.css";

const AddData = ({ onClose, data }) => {
  const handleOverlayClick = (e) => {
    // Close if you click anywhere on the screen
    if (e.target.classList.contains('add-Data-overlay')) {
      onClose();
    }
  };
  const handleSubmit = () => {
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  useEffect(() => {
    // Attach keydown event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="add-Data-overlay" onClick={handleOverlayClick}>
      <div className="addData-container">
            <button className="close-Button" onClick={onClose}>
                <FaArrowLeft />
            </button>
            <h2>Enter Data</h2>
            <label>
              Data:
              <input
                type="text"
                // value={workout}
                // onChange={(e) => setWorkout(e.target.value)}
              />
            </label>
            <button className="enterButton" onClick={handleSubmit}>
              Enter
            </button>
        
      </div>
    </div>
  );
};

export default AddData;
