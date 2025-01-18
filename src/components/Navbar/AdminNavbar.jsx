import {
  faBars,
  faCalendarAlt,
  faCommentDots,
  faHome,
  faMotorcycle,
  faSignOutAlt,
  faTimes,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: faHome },
    { path: '/admin/customerDashboard', name: 'Customer', icon: faUser },
    { path: '/admin/dashboard/bike', name: 'Bike', icon: faMotorcycle },
    { path: '/admin/parts', name: 'Parts', icon: faMotorcycle },

    { path: '/admin/bookings', name: 'Booking', icon: faCalendarAlt },
    { path: '/admin/feedback', name: 'Feedback', icon: faCommentDots },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // googleLogout();
    window.location.href = '/login';
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className='lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
        aria-label='Toggle sidebar'>
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
      </button>

      <aside
        className={`sidebar lg:w-64 bg-gray-800 text-white p-6 fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto`}>
        <div className='flex items-center justify-between mb-8'>
          <div className='text-2xl font-bold'>Home Bike Service</div>
          <button
            onClick={toggleSidebar}
            className='lg:hidden text-white focus:outline-none'
            aria-label='Close sidebar'>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav>
          <ul className='space-y-2'>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between py-2 px-4 rounded-md transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}>
                  <span>{item.name}</span>
                  <FontAwesomeIcon icon={item.icon} />
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className='w-full flex items-center justify-between py-2 px-4 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200'>
                <span>Logout</span>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminNavbar;
