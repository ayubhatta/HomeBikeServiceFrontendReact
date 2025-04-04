import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoggedOutNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <>
      <nav className='bg-gradient-to-r from-blue-600 to-blue-800 py-4 shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <Link
              to='/'
              className='flex items-center space-x-3 text-white hover:text-blue-200 transition duration-300'>
              <span className='text-2xl font-bold'>Ride Revive</span>
            </Link>

            <div className='flex items-center space-x-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className='text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition duration-300'>
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegisterClick}
                className='text-blue-700 bg-white hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition duration-300'>
                Register
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

    
    </>
  );
};

export default LoggedOutNavbar;
