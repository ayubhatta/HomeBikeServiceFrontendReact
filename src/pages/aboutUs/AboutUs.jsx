import React from 'react';

const AboutUs = () => {
  return (
    <section className='bg-gray-100 py-16'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row items-center'>
          <div className='lg:w-1/2 mb-10 lg:mb-0'>
            <div className='relative'>
              <img
                src='https://i.imgur.com/WbQnbas.png'
                alt='Ride Revive'
                className='rounded-lg shadow-2xl'
              />
              <div className='absolute -bottom-10 -right-10 bg-indigo-600 text-white py-4 px-8 rounded-lg shadow-xl'>
                <p className='text-2xl font-bold'>Professional Service</p>
                <p>At Your Doorstep</p>
              </div>
            </div>
          </div>
          <div className='lg:w-1/2 lg:pl-16'>
            <h2 className='text-4xl font-extrabold text-gray-900 mb-6'>
              About <span className='text-indigo-600'>Ride Revive</span>
            </h2>
            <p className='text-xl text-gray-700 mb-8 leading-relaxed'>
              Ride Revive offers the convenience of professional motorcycle
              maintenance and repair at your doorstep. Our expert technicians
              bring years of experience right to your home, ensuring your bike
              stays in peak condition.
            </p>
            <ul className='space-y-4 mb-8'>
              {[
                'Basic tune-ups',
                'Brake and gear adjustments',
                'Chain lubrication',
                'Tire inflation',
                'Wheel truing',
                'Detailed cleaning',
                'Bearing adjustments',
                'Frame inspections',
              ].map((service, index) => (
                <li
                  key={index}
                  className='flex items-center'>
                  <svg
                    className='h-6 w-6 text-indigo-600 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'></path>
                  </svg>
                  {service}
                </li>
              ))}
            </ul>
            <button className='bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'>
              Book a Service
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
