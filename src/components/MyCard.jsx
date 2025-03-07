import React from 'react';
import { Logo } from './Logo/Logo'; // Ensure correct path

const MyCard = ({ bike }) => {
  // Safety check to prevent the error
  if (!bike) {
    return (
      <div className='rounded-lg bg-gray-100 p-4 shadow-md'>
        <p className='text-gray-500'>Bike information unavailable</p>
      </div>
    );
  }

  // Destructure with fallback values to prevent undefined errors
  const {
    bikeName = 'Unknown Bike',
    bikeModel = 'Unknown Model',
    bikePrice = 0,
    bikeImageUrl = '/api/placeholder/400/300',
  } = bike;

  // Find the corresponding logo based on bikeName
  const bikeLogo =
    Logo.find((item) => item.name === bikeName)?.logo ||
    '/assets/images/default-logo.png';

  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 hover:shadow-xl'>
      <div className='relative h-48 w-full overflow-hidden'>
        <img
          src={bikeLogo}
          alt={bikeName}
          className='h-full w-full object-contain transition duration-300 hover:scale-110'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/400/300';
          }}
        />
      </div>

      <div className='p-4'>
        <h3 className='mb-1 text-lg font-bold text-gray-800'>{bikeName}</h3>

        <div className='mt-2 flex items-center justify-between'>
          <button
            onClick={() => (window.location.href = `/bike/${bikeName}`)}
            className='rounded-md w-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-indigo-700'>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
