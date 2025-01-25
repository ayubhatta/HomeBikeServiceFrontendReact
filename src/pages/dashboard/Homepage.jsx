import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ image, title, description, buttonText, onClick }) => (
  <motion.div
    className='tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden'
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}>
    <img
      src={image}
      alt={title}
      className='tw-w-full tw-h-48 tw-object-cover'
    />
    <div className='tw-p-6'>
      <h3 className='tw-text-xl tw-font-semibold tw-mb-2'>{title}</h3>
      <p className='tw-text-gray-600 tw-mb-4'>{description}</p>
      <button
        className='tw-bg-blue-600 tw-text-white tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-700 tw-transition-colors'
        onClick={onClick}>
        {buttonText}
      </button>
    </div>
  </motion.div>
);
const handleBookNow = () => {
  window.location.href = '/bike';
};
const handleBikeSpareParts = () => {
  window.location.href = '/marketplace';
};

const Homepage = () => {
  return (
    <div className='tw-bg-gray-100 tw-min-h-screen'>
      {/* Hero Section */}
      <section className='tw-bg-gradient-to-r tw-from-blue-500 tw-to-indigo-600 tw-text-white'>
        <div className='tw-container tw-mx-auto tw-px-4 tw-py-16 md:tw-py-24'>
          <div className='tw-flex tw-flex-col md:tw-flex-row tw-items-center'>
            <div className='tw-w-full md:tw-w-1/2 tw-mb-8 md:tw-mb-0'>
              <motion.h1
                className='tw-text-4xl md:tw-text-5xl tw-font-bold tw-mb-4'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                Door Step Two Wheel Service
              </motion.h1>
              <motion.p
                className='tw-text-xl tw-mb-6'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                No need to worry about going to workshop to service your bike.
                Get it done in front of your eyes.
              </motion.p>
              <motion.button
                className='tw-bg-white tw-text-blue-600 tw-py-3 tw-px-6 tw-rounded-full tw-font-semibold hover:tw-bg-blue-100 tw-transition-colors'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookNow}>
                Book Now
              </motion.button>
            </div>
            <div className='tw-w-full md:tw-w-1/2'>
              <motion.img
                src='assets/images/home.png'
                alt='Home Bike Service'
                className='tw-w-full tw-rounded-lg tw-shadow-lg'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='tw-py-16'>
        <div className='tw-container tw-mx-auto tw-px-4'>
          <div className='tw-flex tw-flex-col md:tw-flex-row tw-items-center'>
            <div className='tw-w-full md:tw-w-1/2 tw-mb-8 md:tw-mb-0'>
              <img
                src='assets/images/logo.png'
                alt='Home Bike Service Logo'
                className='tw-w-full tw-max-w-md tw-mx-auto'
              />
            </div>
            <div className='tw-w-full md:tw-w-1/2'>
              <h2 className='tw-text-3xl tw-font-bold tw-mb-4 tw-text-blue-600'>
                About Home Bike Service
              </h2>
              <p className='tw-text-gray-700 tw-mb-4'>
                Home bike service offers the convenience of professional bicycle
                maintenance and repair at your doorstep. This service typically
                includes basic tune-ups, such as brake and gear adjustments,
                chain lubrication, and tire inflation, ensuring your bike
                remains in optimal condition.
              </p>
              <p className='tw-text-gray-700 tw-mb-6'>
                These services are particularly beneficial for busy individuals
                or those without easy access to a bike repair shop. By having a
                professional come to your home, you save time and effort,
                ensuring your bike is always ready for use.
              </p>
              <Link
                to='/aboutus'
                className='tw-bg-blue-600 tw-text-white tw-py-2 tw-px-6 tw-rounded hover:tw-bg-blue-700 tw-transition-colors'>
                Read More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='tw-bg-gray-200 tw-min-h-screen tw-flex tw-justify-center tw-items-center'>
        <div className='tw-container tw-mx-auto tw-px-4'>
          <h2 className='tw-text-3xl tw-font-bold tw-mb-8 tw-text-center tw-text-blue-600'>
            Our Features
          </h2>
          <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8'>
            <FeatureCard
              image='assets/images/service.jpg'
              title='Bike Service'
              description='Ride Confidently with Our Expert Care!'
              buttonText='Book  Now'
              onClick={handleBookNow}
            />
            <FeatureCard
              image='assets/images/service.jpg'
              title='Bike Service'
              description='Ride Confidently with Our Expert Care!'
              buttonText='View Bike Parts'
              onClick={handleBikeSpareParts}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
