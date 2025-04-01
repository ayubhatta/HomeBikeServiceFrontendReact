import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaBars, FaShoppingCart, FaTimes, FaUser } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getCartApi } from '../../api/api'; // Import your API function

const UserNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/user/cart');
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await getCartApi();
        if (response.status === 200) {
          const pendingItems = response.data.carts.filter(
            (item) => !item.isPaymentDone
          );
          const totalQuantity = pendingItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(totalQuantity);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  return (
    <>
      <nav className='bg-gradient-to-r from-blue-600 to-blue-800 py-4 shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <Link
              to='/homepage'
              className='flex items-center space-x-3 text-white hover:text-blue-200 transition duration-300'>
              <span className='text-2xl font-bold'>Ride Revive</span>
            </Link>

            <div className='hidden md:flex items-center space-x-8'>
              <NavLink
                to='/homepage'
                className={({ isActive }) =>
                  isActive
                    ? 'text-white font-bold border-b-2 border-white pb-1'
                    : 'text-white hover:text-blue-200 transition duration-300'
                }>
                Home
              </NavLink>
              <NavLink
                to='/user/booking'
                className={({ isActive }) =>
                  isActive
                    ? 'text-white font-bold border-b-2 border-white pb-1'
                    : 'text-white hover:text-blue-200 transition duration-300'
                }>
                Bookings
              </NavLink>
              <NavLink
                to='/bike'
                className={({ isActive }) =>
                  isActive
                    ? 'text-white font-bold border-b-2 border-white pb-1'
                    : 'text-white hover:text-blue-200 transition duration-300'
                }>
                Book Now
              </NavLink>
              <NavLink
                to='/marketplace'
                className={({ isActive }) =>
                  isActive
                    ? 'text-white font-bold border-b-2 border-white pb-1'
                    : 'text-white hover:text-blue-200 transition duration-300'
                }>
                Bike Parts
              </NavLink>
              <NavLink
                to='/contactus'
                className={({ isActive }) =>
                  isActive
                    ? 'text-white font-bold border-b-2 border-white pb-1'
                    : 'text-white hover:text-blue-200 transition duration-300'
                }>
                Contact Us
              </NavLink>
            </div>

            <div className='flex items-center space-x-4'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className='relative text-white hover:text-blue-200 transition duration-300 bg-blue-700 hover:bg-blue-600 p-2 rounded-full'>
                <FaShoppingCart className='h-5 w-5' />
                {cartCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                    {cartCount}
                  </span>
                )}
              </motion.button>

              <div className='relative'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDropdown}
                  className='text-white hover:text-blue-200 transition duration-300 bg-blue-700 hover:bg-blue-600 p-2 rounded-full'>
                  <FaUser className='h-5 w-5' />
                </motion.button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50'>
                    <Link
                      to='/changepassword'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300'>
                      Change Password
                    </Link>
                    <Link
                      to='/user/update'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300'>
                      Update Profile
                    </Link>
                    <button
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300'
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
                className='md:hidden text-white hover:text-blue-200 transition duration-300 bg-blue-700 hover:bg-blue-600 p-2 rounded-full'
                onClick={toggleMobileMenu}>
                {mobileMenuOpen ? (
                  <FaTimes className='h-5 w-5' />
                ) : (
                  <FaBars className='h-5 w-5' />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='md:hidden bg-blue-800 shadow-lg'>
          <div className='px-4 pt-2 pb-4 space-y-2'>
            <NavLink
              to='/homepage'
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'block py-2 px-4 text-white font-bold border-l-4 border-white bg-blue-700'
                  : 'block py-2 px-4 text-white hover:bg-blue-700 transition duration-300'
              }>
              Home
            </NavLink>
            <NavLink
              to='/user/booking'
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'block py-2 px-4 text-white font-bold border-l-4 border-white bg-blue-700'
                  : 'block py-2 px-4 text-white hover:bg-blue-700 transition duration-300'
              }>
              Bookings
            </NavLink>
            <NavLink
              to='/bike'
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'block py-2 px-4 text-white font-bold border-l-4 border-white bg-blue-700'
                  : 'block py-2 px-4 text-white hover:bg-blue-700 transition duration-300'
              }>
              Book Now
            </NavLink>
            <NavLink
              to='/marketplace'
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'block py-2 px-4 text-white font-bold border-l-4 border-white bg-blue-700'
                  : 'block py-2 px-4 text-white hover:bg-blue-700 transition duration-300'
              }>
              Bike Parts
            </NavLink>
            <NavLink
              to='/contactus'
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'block py-2 px-4 text-white font-bold border-l-4 border-white bg-blue-700'
                  : 'block py-2 px-4 text-white hover:bg-blue-700 transition duration-300'
              }>
              Contact Us
            </NavLink>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default UserNavbar;