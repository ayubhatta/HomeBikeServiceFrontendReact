import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ['Total User', 'Total Bikes', 'Total Bookings', 'Total Parts'],
    datasets: [
      {
        label: 'Statistics',
        data: [
          data.totalUsers,
          data.totalBikeProducts,
          data.totalBookings,
          data.totalBikeParts,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgb(0, 170, 255)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgb(0, 170, 255)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#E5E7EB' } }, // Dark mode legend color
      title: {
        display: true,
        color: '#E5E7EB',
      }, // Dark mode title color
    },
  };

  return (
    <div className='p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700 max-w-2xl mx-auto'>
      <div className='text-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-100'>
          Statistics Overview
        </h2>
      </div>
      <div className='flex items-center justify-center'>
        <Pie
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default PieChart;
