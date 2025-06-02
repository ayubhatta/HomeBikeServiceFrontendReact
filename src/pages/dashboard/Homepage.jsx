import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import LoggedOutNavbar from '../../components/Navbar/LoggedoutUserNavbar';

const FeatureCard = ({ image, title, description, buttonText, onClick }) => (
  <motion.div
    className='tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-border tw-border-blue-100'
    whileHover={{
      scale: 1.05,
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
    }}
    transition={{ duration: 0.3 }}>
    <div className='tw-h-48 tw-overflow-hidden'>
      <img
        src={image}
        alt={title}
        className='tw-w-full tw-h-full tw-object-cover tw-transition-transform hover:tw-scale-110'
      />
    </div>
    <div className='tw-p-6'>
      <h3 className='tw-text-xl tw-font-bold tw-mb-2 tw-text-blue-800'>
        {title}
      </h3>
      <p className='tw-text-gray-600 tw-mb-5 tw-h-16'>{description}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='tw-bg-blue-600 tw-text-white tw-py-3 tw-px-6 tw-rounded-md hover:tw-bg-blue-700 tw-transition-colors tw-font-medium tw-w-full'
        onClick={onClick}>
        {buttonText}
      </motion.button>
    </div>
  </motion.div>
);

const TestimonialCard = ({ text, author, role }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className='tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-border-l-4 tw-border-blue-500'>
    <p className='tw-text-gray-600 tw-italic tw-mb-4'>"{text}"</p>
    <div className='tw-flex tw-items-center'>
      <div className='tw-w-10 tw-h-10 tw-bg-blue-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-blue-600 tw-font-bold'>
        {author.charAt(0)}
      </div>
      <div className='tw-ml-3'>
        <p className='tw-font-semibold'>{author}</p>
        <p className='tw-text-gray-500 tw-text-sm'>{role}</p>
      </div>
    </div>
  </motion.div>
);

const StatCard = ({ number, title, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className='tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6 tw-flex tw-flex-col tw-items-center'>
    <div className='tw-text-blue-500 tw-text-4xl tw-mb-2'>{icon}</div>
    <div className='tw-text-3xl tw-font-bold tw-text-blue-700 tw-mb-1'>
      {number}
    </div>
    <div className='tw-text-gray-500 tw-text-center'>{title}</div>
  </motion.div>
);

const Homepage = () => {
  const handleBookNow = () => {
    window.location.href = '/bike';
  };

  const handleBikeSpareParts = () => {
    window.location.href = '/marketplace';
  };

  return (
    <div className='tw-bg-gray-50 tw-min-h-screen'>
      {/* Hero Section */}
      <section className='tw-bg-gradient-to-r tw-from-blue-600 tw-to-blue-800 tw-text-white'>
        <div className='tw-container tw-mx-auto tw-px-4 tw-py-20 md:tw-py-28'>
          <div className='tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-gap-12'>
            <div className='tw-w-full md:tw-w-1/2 tw-mb-8 md:tw-mb-0'>
              <motion.h1
                className='tw-text-4xl md:tw-text-5xl tw-font-bold tw-mb-6 tw-leading-tight'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}>
                Doorstep Bike Services at Your Convenience
              </motion.h1>
              <motion.p
                className='tw-text-xl tw-mb-8 tw-opacity-90'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}>
                No need to worry about going to workshops. Our experts deliver
                professional bike services right at your doorstep, while you
                watch.
              </motion.p>
              <div className='tw-flex tw-space-x-4'>
                <motion.button
                  className='tw-bg-white tw-text-blue-700 tw-py-3 tw-px-8 tw-rounded-full tw-font-semibold hover:tw-bg-blue-50 tw-transition-colors tw-shadow-md'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookNow}>
                  Book Now
                </motion.button>
                <motion.a
                  href='#features'
                  className='tw-bg-transparent tw-border tw-border-white tw-text-white tw-py-3 tw-px-8 tw-rounded-full tw-font-semibold hover:tw-bg-white hover:tw-text-blue-700 tw-transition-colors'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  Learn More
                </motion.a>
              </div>
            </div>
            <div className='tw-w-full md:tw-w-1/2'>
              <motion.div
                className='tw-relative tw-z-10'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}>
                <img
                  src='assets/images/home.png'
                  alt='Ride Revive'
                  className='tw-w-full tw-rounded-xl tw-shadow-2xl'
                />
                <div className='tw-absolute tw-pl-5 tw--bottom-4 tw--right-4 tw-bg-blue-500 tw-w-24 tw-h-24 tw-rounded-full tw-flex tw-items-center tw-justify-center-center tw-text-white tw-font-bold tw-text-lg tw-shadow-lg tw-z-20'>
                  24/7 Service
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className='tw-wave-divider'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 120'>
            <path
              fill='#f9fafb'
              fillOpacity='1'
              d='M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z'></path>
          </svg>
        </div>
      </section>

      {/* Services Overview */}
      <section className='tw-py-12 tw-px-4'>
        <div className='tw-container tw-mx-auto'>
          <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8 tw-mb-16'>
            <StatCard
              number='500+'
              title='Happy Customers'
              icon={<i className='fas fa-smile'></i>}
            />
            <StatCard
              number='1000+'
              title='Bikes Serviced'
              icon={<i className='fas fa-bicycle'></i>}
            />
            <StatCard
              number='24/7'
              title='Customer Support'
              icon={<i className='fas fa-headset'></i>}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='tw-py-16 tw-bg-white'>
        <div className='tw-container tw-mx-auto tw-px-4'>
          <div className='tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-gap-12'>
            <div className='tw-w-full md:tw-w-1/2 tw-mb-8 md:tw-mb-0'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}>
                <img
                  src='assets/images/logo.png'
                  alt='Ride Revive Logo'
                  className='tw-w-full tw-max-w-md tw-mx-auto tw-drop-shadow-xl'
                />
              </motion.div>
            </div>
            <div className='tw-w-full md:tw-w-1/2'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}>
                <h2 className='tw-text-3xl tw-font-bold tw-mb-6 tw-text-blue-700 tw-relative'>
                  About Ride Revive
                  <span className='tw-absolute tw-bottom-0 tw-left-0 tw-w-20 tw-h-1 tw-bg-blue-500'></span>
                </h2>
                <p className='tw-text-gray-700 tw-mb-5 tw-text-lg'>
                  Ride Revive offers the convenience of professional bicycle
                  maintenance and repair at your doorstep. Our service includes
                  basic tune-ups, brake and gear adjustments, chain lubrication,
                  and tire inflation, ensuring your bike remains in optimal
                  condition.
                </p>
                <p className='tw-text-gray-700 tw-mb-8 tw-text-lg'>
                  These services are particularly beneficial for busy
                  individuals or those without easy access to a bike repair
                  shop. By having a professional come to your home, you save
                  time and effort, ensuring your bike is always ready for use.
                </p>
                <Link
                  to='/aboutus'
                  className='tw-bg-blue-600 tw-text-white tw-py-3 tw-px-8 tw-rounded-md hover:tw-bg-blue-700 tw-transition-colors tw-inline-block tw-font-medium'>
                  Learn More About Us
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id='features'
        className='tw-py-16 tw-bg-gray-50'>
        <div className='tw-container tw-mx-auto tw-px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='tw-mb-12 tw-text-center'>
            <h2 className='tw-text-3xl tw-font-bold tw-mb-4 tw-text-blue-700'>
              Our Services
            </h2>
            <p className='tw-text-gray-600 tw-max-w-2xl tw-mx-auto tw-text-lg'>
              Discover how Ride Revive can keep your bike in perfect condition
              with our range of professional services.
            </p>
          </motion.div>
          <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8'>
            <FeatureCard
              image='assets/images/BikeService.jpg'
              title='Bike Service'
              description='Expert maintenance and tune-ups to keep your bike running smoothly and safely.'
              buttonText='Book Now'
              onClick={handleBookNow}
            />
            <FeatureCard
              image='assets/images/BikeCleaning.jpg'
              title='Bike Cleaning'
              description='Quick and professional repair services to get you back on the road as soon as possible.'
              buttonText='Book Cleaning'
              onClick={handleBookNow}
            />
            <FeatureCard
              image='assets/images/BikeParts.png'
              title='Bike Parts'
              description='Quality bike parts and accessories to upgrade your ride and enhance performance.'
              buttonText='View Bike Parts'
              onClick={handleBikeSpareParts}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='tw-py-16 tw-bg-blue-50'>
        <div className='tw-container tw-mx-auto tw-px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='tw-mb-12 tw-text-center'>
            <h2 className='tw-text-3xl tw-font-bold tw-mb-4 tw-text-blue-700'>
              What Our Customers Say
            </h2>
            <p className='tw-text-gray-600 tw-max-w-2xl tw-mx-auto'>
              Don't just take our word for it - hear from our satisfied
              customers!
            </p>
          </motion.div>
          <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8'>
            <TestimonialCard
              text='RideRevive’s service is truly effective. I can get my bike serviced while staying at home in Kathmandu — it’s super convenient!'
              author='Apil Jung Thapa'
              role='Regular Customer'
            />
            <TestimonialCard
              text='The technician arrived right after I placed a service request. My bike runs better than ever now — thank you, RideRevive!'
              author='Sakchyam Thapa'
              role='Motorcycle Enthusiast'
            />
            <TestimonialCard
              text='The service quality and parts are excellent. I recommend RideRevive to all my friends who ride.'
              author='Miraj Deep Bhandari'
              role='Weekend Rider'
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='tw-py-16 tw-bg-blue-700 tw-text-white'>
        <div className='tw-container tw-mx-auto tw-px-4 tw-text-center'>
          <h2 className='tw-text-3xl tw-font-bold tw-mb-6'>
            Ready to Revive Your Ride?
          </h2>
          <p className='tw-text-xl tw-mb-8 tw-max-w-2xl tw-mx-auto tw-opacity-90'>
            Book your bike service today and experience the convenience of
            doorstep professional care.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='tw-bg-white tw-text-blue-700 tw-py-3 tw-px-8 tw-rounded-full tw-font-semibold hover:tw-bg-blue-50 tw-transition-colors tw-shadow-md'
            onClick={handleBookNow}>
            Book Service Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
