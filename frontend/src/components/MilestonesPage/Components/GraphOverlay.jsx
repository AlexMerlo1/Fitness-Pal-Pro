import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './GraphOverlay.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraphOverlay = ({ onClose, data, options }) => {
  const handleOverlayClick = (e) => {
    // Close if you click anywhere on the screen
    if (e.target.classList.contains('graph-overlay')) {
      onClose();
    }
  };

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
    <div className="graph-overlay" onClick={handleOverlayClick}>
      <div
        className="graph-container"
        style={{
          padding: '50px',
          width: '70%',
          height: '70%',
          borderRadius: '20px',
          backgroundColor: '#38434f',
        }}
      >
        {/* {data?.datasets[0]?.label || 'Graph Title'} */}
        <Bar data={data} options={options} />
        <button className="close-button" onClick={onClose}>
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default BarGraphOverlay;