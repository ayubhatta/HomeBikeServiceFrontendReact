import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className='tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-r tw-from-blue-400 tw-to-purple-500'>
      <div className='tw-bg-white tw-rounded-lg tw-shadow-2xl tw-p-8 tw-m-4 tw-max-w-sm tw-w-full tw-space-y-8'>
        <div className='tw-text-center'>
          <svg
            className='tw-mx-auto tw-h-24 tw-w-24 tw-text-green-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h1 className='tw-mt-4 tw-text-3xl tw-font-extrabold tw-text-gray-900 tw-tracking-tight'>
            Thank You!
          </h1>
          <p className='tw-mt-2 tw-text-lg tw-text-gray-500'>
            Your booking has been successfully processed.
          </p>
        </div>
        <div className='tw-mt-5 tw-space-y-4'>
          <p className='tw-text-sm tw-text-gray-700'>
            We appreciate your business and look forward to serving you. You'll
            receive a confirmation email shortly with all the details of your
            booking.
          </p>
          <button
            onClick={() => navigate('/homepage')}
            className='tw-w-full tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-border tw-border-transparent tw-rounded-md tw-shadow-sm tw-text-base tw-font-medium tw-text-white tw-bg-blue-600 hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-blue-500 tw-transition-colors tw-duration-300'>
            Return to Home
          </button>
        </div>
        <div className='tw-mt-6 tw-text-center'>
          <p className='tw-text-xs tw-text-gray-500'>
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
