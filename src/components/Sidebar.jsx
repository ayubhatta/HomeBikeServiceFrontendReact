import { motion } from 'framer-motion';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, menuItems, handleLogout }) => {
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className='lg:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white'
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}>
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'>
          {isOpen ? (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          ) : (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          )}
        </svg>
      </button>

      <motion.aside
        initial='closed'
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='sidebar w-64 bg-gray-900 text-white fixed inset-y-0 left-0 z-40 overflow-y-auto lg:translate-x-0'>
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          <h1 className='text-2xl font-bold text-indigo-400'>
            Ride Revive
          </h1>
          <button
            onClick={toggleSidebar}
            className='lg:hidden text-gray-400 hover:text-white focus:outline-none'
            aria-label='Close sidebar'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <nav className='mt-8'>
          <ul className='space-y-2 px-4'>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between py-2 px-4 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}>
                  <span className='flex items-center'>
                    <i className={`fa ${item.icon} mr-3`}></i>
                    {item.name}
                  </span>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='absolute bottom-0 w-full p-4'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center justify-center py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200'>
            <i className='fa fa-sign-out mr-2'></i>
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
