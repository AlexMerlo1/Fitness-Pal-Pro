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

const BarGraph = ({ data, options }) => {  
  
  return (
    <div style={ {width: '100%', height: '275px', borderRadius: '20px', backgroundColor: '#38434f'}}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;