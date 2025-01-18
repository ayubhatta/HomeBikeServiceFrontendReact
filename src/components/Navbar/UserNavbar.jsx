import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const UserNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search'); // Navigate to the search page
  };
  const handleCartClick = () => {
    navigate('/user/cart'); // Navigate to the cart page
  }; // Navigate to the cart page
  return (
    <>
      <nav className='bg-gradient-to-r from-purple-600 to-indigo-600 py-4 shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <Link
              to='/homepage'
              className='flex items-center space-x-3 text-white hover:text-gray-200 transition duration-300'>
              <span className='text-2xl font-bold'>Home Bike Service</span>
            </Link>

            <div className='hidden md:flex items-center space-x-8'>
              <NavLink
                to='/homepage'
                className='text-white hover:text-gray-200 transition duration-300'>
                Home
              </NavLink>
              <NavLink
                to='/user/booking'
                className='text-white hover:text-gray-200 transition duration-300'>
                Bookings
              </NavLink>
              <NavLink
                to='/bike'
                className='text-white hover:text-gray-200 transition duration-300'>
                Book Now
              </NavLink>
              <NavLink
                to='/marketplace'
                className='text-white hover:text-gray-200 transition duration-300'>
                Bike Parts
              </NavLink>
              <NavLink
                to='/contactus'
                className='text-white hover:text-gray-200 transition duration-300'>
                Contact Us
              </NavLink>
            </div>

            <div className='flex items-center space-x-4'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearchClick}
                className='text-white hover:text-gray-200 transition duration-300'>
                <FaSearch className='h-6 w-6' />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className='text-white hover:text-gray-200 transition duration-300'>
                <FaShoppingCart className='h-6 w-6' />
              </motion.button>

              <div className='relative'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDropdown}
                  className='text-white hover:text-gray-200 transition duration-300'>
                  <FaUser className='h-6 w-6' />
                </motion.button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5'>
                    <Link
                      to='/changepassword'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300'>
                      Change Password
                    </Link>
                    <Link
                      to='/user/update'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300'>
                      Update Profile
                    </Link>
                    <button
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300'
                      onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}>
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='md:hidden text-white hover:text-gray-200 transition duration-300'
                onClick={toggleMobileMenu}>
                {mobileMenuOpen ? (
                  <FaTimes className='h-6 w-6' />
                ) : (
                  <FaBars className='h-6 w-6' />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              <NavLink
                to='/homepage'
                className='block px-3 py-2 rounded-md text-white hover:bg-indigo-500 hover:text-white transition duration-300'>
                Home
              </NavLink>
              <NavLink
                to='/user/booking'
                className='block px-3 py-2 rounded-md text-white hover:bg-indigo-500 hover:text-white transition duration-300'>
                Bookings
              </NavLink>
              <NavLink
                to='/bike'
                className='block px-3 py-2 rounded-md text-white hover:bg-indigo-500 hover:text-white transition duration-300'>
                Book Now
              </NavLink>
              <NavLink
                to='/aboutus'
                className='block px-3 py-2 rounded-md text-white hover:bg-indigo-500 hover:text-white transition duration-300'>
                About Us
              </NavLink>
              <NavLink
                to='/contactus'
                className='block px-3 py-2 rounded-md text-white hover:bg-indigo-500 hover:text-white transition duration-300'>
                Contact Us
              </NavLink>
              <NavLink
                to='/search'
                className='block px-3 py-2 rounded-md text-white hover:bg-indigo-500 hover:text-white transition duration-300'>
                Search
              </NavLink>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
};

export default UserNavbar;
