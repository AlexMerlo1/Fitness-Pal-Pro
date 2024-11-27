import React from 'react';
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

const BarGraph = () => {  
  
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'weight',
        data: [10, 20, 30, 40, 50, 60],
        backgroundColor: '#FFFFFF', // Bar fill color
        borderColor: '#FFFFFF', // Bar border color
        borderWidth: 0, // Thickness of bar borders
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: 'white', // Legend label color
        },
      },
      title: {
        display: true,
        text: 'Weight',
        color: 'white', // Title color
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // X-axis label color
        },
        grid: {
          color: 'rgba(255,255,255,0.3)', // X-axis gridline color
          lineWidth: 3, // Thickness of grid
        },
      },
      y: {
        ticks: {
          color: 'white', // Y-axis label color
        },
        grid: {
          color: 'rgba(255,255,255,0.8)', // Y-axis gridline color
          lineWidth: 3, // Thickness of grid
        },
      },
    },
  };

  return (
    <div style={ {width: '100%', height: '275px', borderRadius: '20px', backgroundColor: '#b4b4b4'}}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
