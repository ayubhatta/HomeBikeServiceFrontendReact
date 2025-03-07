import React from 'react';

const AboutUs = () => {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 max-w-6xl'>
        <div className='flex flex-col lg:flex-row items-center gap-16'>
          <div className='lg:w-1/2'>
            <div className='relative'>
              <img
                src='https://i.imgur.com/WbQnbas.png'
                alt='Ride Revive Service'
                className='rounded-xl shadow-xl object-cover w-full'
              />
              <div className='absolute -bottom-8 -right-8 bg-white border-l-4 border-blue-600'>
                <div className='py-4 px-6 shadow-lg rounded-lg'>
                  <p className='text-2xl font-bold text-gray-800'>
                    Professional Service
                  </p>
                  <p className='text-gray-600'>At Your Doorstep</p>
                </div>
              </div>
            </div>
          </div>

          <div className='lg:w-1/2 mt-16 lg:mt-0'>
            <div className='flex items-center mb-4'>
              <div className='h-1 w-12 rounded-full bg-blue-600'></div>
              <p className='ml-3 text-sm font-semibold uppercase tracking-wider text-gray-500'>
                Who We Are
              </p>
            </div>

            <h2 className='text-4xl font-extrabold text-gray-900 mb-6'>
              About <span className='text-blue-600'>Ride Revive</span>
            </h2>

            <p className='text-xl text-gray-700 mb-8 leading-relaxed'>
              Ride Revive offers the convenience of professional motorcycle
              maintenance and repair at your doorstep. Our expert technicians
              bring years of experience right to your home, ensuring your bike
              stays in peak condition.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-10'>
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
                <div
                  key={index}
                  className='flex items-center p-3 rounded-lg bg-white shadow-sm border-l-2 border-blue-600'>
                  <svg
                    className='h-5 w-5 mr-3 flex-shrink-0 text-blue-600'
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
                  <span className='font-medium text-gray-700'>{service}</span>
                </div>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                onClick={() => {
                  window.location.href = '/bike';
                }}
                className='bg-blue-600 py-3 px-8 rounded-lg font-semibold text-white shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                Book a Service
              </button>
              <button className='py-3 px-8 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
