import React from 'react';
import { Link } from 'react-router-dom';

const MyBikeCard = ({ bikeInformation, color }) => {
  return (
    <div
      class='card'
      style={{ width: '18rem' }}>
      <span
        style={{
          backgroundColor: color,
        }}
        className='badge position-absolute top-0'>
        {bikeInformation.bikeName}
      </span>

      <img
        src={`${bikeInformation.bikeImageUrl}`}
        class='card-img-top'
        alt={bikeInformation.bikeName}
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'fit',
        }}
      />
      <div class='card-body'>
        <div className='d-flex justify-content-between'>
          <h5 class='card-title'>{bikeInformation.bikeModel}</h5>
        </div>
        <Link
          to={`/confirmBooking/${bikeInformation.id}`}
          class='btn btn-outline-dark w-100'>
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default MyBikeCard;
