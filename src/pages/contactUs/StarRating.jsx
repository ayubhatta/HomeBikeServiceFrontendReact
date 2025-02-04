import React from 'react';

const StarRating = ({ rating, setRating }) => {
  const handleClick = (value) => {
    setRating(value);
  };

  return (
    <div className='flex items-center'>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleClick(star)}
          className={`h-6 w-6 cursor-pointer ${
            star <= rating ? 'text-yellow-500' : 'text-gray-300'
          }`}
          fill='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'>
          <path d='M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z' />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
