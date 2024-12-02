import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import "./AddData.css";

const AddData = ({ onClose, data, onSave }) => {
  const [inputValues, setInputValues] = useState(data || []);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('add-data-overlay')) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleInputChange = (index, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = parseFloat(value) || 0;
    setInputValues(updatedValues);
  };

  const handleSave = () => {
    onSave(inputValues);
    onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="add-data-overlay" onClick={handleOverlayClick}>
      <div className="add-data-container">
        <button className="close-button" onClick={onClose}>
          <FaArrowLeft />
        </button>
        <h2>Enter Data</h2>
        <form>
          {inputValues.map((value, index) => (
            <div key={index} className="form-group">
              <label>{`Day ${index + 1}`}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
        </form>
        <button className="enter-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
  
};

export default AddData;
