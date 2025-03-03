import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaPhoneAlt,
  FaSort,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllBookingApi } from '../../../api/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'bookingDate',
    direction: 'descending',
  });

  useEffect(() => {
    setLoading(true);
    getAllBookingApi()
      .then((res) => {
        if (res.status === 200) {
          // Make sure we're setting an array, even if the API returns null or undefined
          setBookings(Array.isArray(res.data?.bookings) ? res.data.bookings : []);
        } else {
          setBookings([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to load bookings. Please try again.');
        setBookings([]);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const sortedBookings = useMemo(() => {
    if (!Array.isArray(bookings)) {
      console.error('bookings is not an array:', bookings);
      return [];
    }
    
    let sortableItems = [...bookings];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'customerName') {
          aValue = a.userDetails?.fullName || '';
          bValue = b.userDetails?.fullName || '';
        } else if (sortConfig.key === 'status') {
          aValue = a.status || '';
          bValue = b.status || '';
        } else {
          aValue = new Date(a[sortConfig.key] || null);
          bValue = new Date(b[sortConfig.key] || null);
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [bookings, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredBookings = sortedBookings.filter(
    (booking) =>
      booking.userDetails?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.bikeDetails?.bikeName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.bikeNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative tw-p-6'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className='tw-text-4xl tw-font-bold tw-mb-8 tw-text-white'>
        Bookings
      </h1>

      <div className='tw-mb-6 tw-flex tw-flex-wrap tw-items-center tw-gap-4'>
        <input
          type='text'
          placeholder='Search bookings...'
          className='tw-flex-grow tw-px-4 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='tw-flex tw-gap-2'>
          <button
            onClick={() => requestSort('bookingDate')}
            className={`tw-px-4 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 hover:tw-bg-gray-700 tw-transition-colors ${
              sortConfig.key === 'bookingDate' ? 'tw-bg-blue-600' : ''
            }`}>
            Sort by Date <FaSort className='tw-inline' />
          </button>
          <button
            onClick={() => requestSort('customerName')}
            className={`tw-px-4 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 hover:tw-bg-gray-700 tw-transition-colors ${
              sortConfig.key === 'customerName' ? 'tw-bg-blue-600' : ''
            }`}>
            Sort by Name <FaSort className='tw-inline' />
          </button>
          <button
            onClick={() => requestSort('status')}
            className={`tw-px-4 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 hover:tw-bg-gray-700 tw-transition-colors ${
              sortConfig.key === 'status' ? 'tw-bg-blue-600' : ''
            }`}>
            Sort by Status <FaSort className='tw-inline' />
          </button>
        </div>
      </div>

      {loading ? (
        <div className='tw-flex tw-justify-center tw-items-center tw-h-64'>
          <div className='tw-animate-spin tw-rounded-full tw-h-32 tw-w-32 tw-border-t-2 tw-border-b-2 tw-border-blue-500'></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <p className='tw-text-center tw-text-xl tw-text-gray-400'>
          No bookings found.
        </p>
      ) : (
        <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6'>
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='tw-bg-gray-800 tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-transition-transform tw-duration-300 hover:tw-transform hover:tw-scale-105'>
              <div className='tw-p-6'>
                <h2 className='tw-text-2xl tw-font-semibold tw-mb-4'>
                  {booking.userDetails?.fullName || 'Unknown User'}
                </h2>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaMotorcycle className='tw-mr-2 tw-text-blue-500' />
                  <p>
                    {booking.bikeDetails?.bikeName || 'Unknown Bike'}{' '}
                    {booking.bikeDetails?.bikeModel || ''} -{' '}
                    {booking.bikeNumber || 'No Number'}
                  </p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaPhoneAlt className='tw-mr-2 tw-text-green-500' />
                  <p>{booking.userDetails?.phoneNumber || 'No Phone'}</p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaMapMarkerAlt className='tw-mr-2 tw-text-red-500' />
                  <p>{booking.bookingAddress || 'No Address'}</p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaCalendarAlt className='tw-mr-2 tw-text-yellow-500' />
                  <p>{booking.bookingDate ? formatDate(booking.bookingDate) : 'No Date'}</p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-4'>
                  <FaClock className='tw-mr-2 tw-text-purple-500' />
                  <p>{booking.bookingTime || 'No Time'}</p>
                </div>
                <div className='tw-flex tw-justify-between tw-items-center'>
                  <span
                    className={`tw-inline-block tw-px-4 tw-py-1 tw-text-sm tw-font-semibold tw-rounded-full ${
                      booking.status === 'completed'
                        ? 'tw-bg-green-500'
                        : 'tw-bg-yellow-500'
                    }`}>
                    {booking.status || 'Unknown'}
                  </span>
                  <button className='tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-transition-colors tw-duration-300'>
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminBookings;