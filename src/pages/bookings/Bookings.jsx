import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaEye,
  FaIdCard,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaTimesCircle,
  FaTrashAlt,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  cancelBookingApi,
  deleteBookingApi,
  initializeKhaltiPaymentApi,
  userBookingApi,
  userID,
} from '../../api/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'canceled'

  useEffect(() => {
    userBookingApi(userID)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.bookings && Array.isArray(res.data.bookings)) {
            setBookings(res.data.bookings);
          } else if (
            res.data &&
            res.data.message === 'No bookings found for the given user.'
          ) {
            setBookings([]);
          } else {
            setBookings([]);
          }
        } else {
          setError('Failed to fetch bookings');
        }
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.message === 'No bookings found for the given user.'
        ) {
          setBookings([]);
        } else {
          setError('Failed to fetch bookings');
          console.error(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredBookings = React.useMemo(() => {
    if (filter === 'all')
      return bookings.filter((booking) => booking.status !== 'Complete');
    if (filter === 'active')
      return bookings.filter(
        (booking) =>
          booking.status !== 'canceled' && booking.status !== 'Complete'
      );
    if (filter === 'canceled')
      return bookings.filter((booking) => booking.status === 'canceled');
    return bookings.filter((booking) => booking.status !== 'Complete');
  }, [bookings, filter]);

  const calculateTotal = () => {
    return filteredBookings
      .filter((booking) => booking.status !== 'canceled')
      .reduce(
        (total, booking) =>
          total + (booking.total || booking.bikeDetails.bikePrice),
        0
      )
      .toFixed(2);
  };

  const handlePayment = async (totalPrice) => {
    try {
      const paymentResponse = await initializeKhaltiPaymentApi({
        bookings: bookings.filter(
          (booking) =>
            booking.status !== 'canceled' && booking.status !== 'Complete'
        ),
        totalPrice,
        website_url: window.location.origin,
      });
      if (paymentResponse.data.success) {
        const paymentUrl = paymentResponse.data.payment.payment_url;
        window.location.href = paymentUrl;
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(
        'Error processing payment: ' +
          (error.response?.data?.message || error.message || 'Unknown error')
      );
    }
  };

  const handleCancelBooking = (bookingId) => {
    cancelBookingApi(bookingId)
      .then((res) => {
        if (res.status === 200) {
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === bookingId
                ? { ...booking, status: 'canceled' }
                : booking
            )
          );
          toast.success('Booking cancelled successfully');
        } else {
          toast.error('Failed to cancel booking');
        }
      })
      .catch((err) => {
        toast.error('Failed to cancel booking');
        console.error(err);
      });
  };

  const handleDeleteBooking = (bookingId) => {
    deleteBookingApi(bookingId)
      .then((res) => {
        if (res.status === 200) {
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking.id !== bookingId)
          );
          toast.success('Booking deleted successfully');
        } else {
          toast.error('Failed to delete booking');
        }
      })
      .catch((err) => {
        toast.error('Failed to delete booking');
        console.error(err);
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString();
    }

    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const BookingCard = ({ booking }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden mb-6 border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300'>
      <div className='md:flex'>
        <div className='md:flex-shrink-0 relative'>
          <img
            className='h-48 w-full object-fit md:w-48'
            src={booking.bikeDetails.imageUrl}
            alt={booking.bikeDetails.bikeName}
          />
          {booking.status === 'canceled' && (
            <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center'>
              <span className='text-white text-lg font-bold px-3 py-1 bg-red-500 rounded-full'>
                Cancelled
              </span>
            </div>
          )}
        </div>
        <div className='p-6 w-full'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='text-xl font-bold text-gray-800 flex items-center'>
                {booking.bikeDetails.bikeName} {booking.bikeDetails.bikeModel}
                <span
                  className={`ml-3 text-xs uppercase font-semibold px-2 py-1 rounded-full ${
                    booking.status === 'canceled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                  {booking.status}
                </span>
              </div>
              <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='flex items-center text-gray-600'>
                  <FaCalendarAlt className='mr-2 text-blue-600' />
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>
                <div className='flex items-center text-gray-600'>
                  <FaClock className='mr-2 text-blue-600' />
                  <span>{formatTime(booking.bookingTime)}</span>
                </div>
                <div className='flex items-center text-gray-600'>
                  <FaMapMarkerAlt className='mr-2 text-blue-600' />
                  <span className='truncate'>
                    {booking.bookingAddress || 'Address not provided'}
                  </span>
                </div>
                <div className='flex items-center text-gray-600'>
                  <FaMotorcycle className='mr-2 text-blue-600' />
                  <span>Bike #{booking.bikeNumber || 'N/A'}</span>
                </div>
              </div>
            </div>
            <span className='text-2xl font-bold text-blue-600'>
              Rs {booking.total || booking.bikeDetails.bikePrice}
            </span>
          </div>

          <div className='mt-6 flex flex-wrap justify-end gap-2'>
            <button
              onClick={() => setSelectedBooking(booking)}
              className='px-4 py-2 flex items-center text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <FaEye className='mr-2' />
              View Details
            </button>
            {booking.status !== 'canceled' && (
              <button
                onClick={() => handleCancelBooking(booking.id)}
                className='px-4 py-2 flex items-center text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500'>
                <FaTimesCircle className='mr-2' />
                Cancel
              </button>
            )}
            <button
              onClick={() => handleDeleteBooking(booking.id)}
              className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200 focus:outline-none'
              title='Delete Booking'>
              <FaTrashAlt size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const BookingDetails = ({ booking, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center'>
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className='bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Booking Details</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='relative mb-6'>
          <img
            className='h-48 w-full object-cover rounded-lg'
            src={booking.bikeDetails.imageUrl}
            alt={booking.bikeDetails.bikeName}
          />
          <div className='absolute bottom-3 left-3 bg-blue-600 text-white py-1 px-3 rounded-full text-sm font-semibold'>
            {booking.bikeDetails.bikeName} {booking.bikeDetails.bikeModel}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center text-gray-600 mb-1'>
              <FaCalendarAlt className='mr-2 text-blue-600' />
              <span className='text-sm font-medium'>Date</span>
            </div>
            <span className='text-gray-800'>
              {formatDate(booking.bookingDate)}
            </span>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center text-gray-600 mb-1'>
              <FaClock className='mr-2 text-blue-600' />
              <span className='text-sm font-medium'>Time</span>
            </div>
            <span className='text-gray-800'>
              {formatTime(booking.bookingTime)}
            </span>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center text-gray-600 mb-1'>
              <FaIdCard className='mr-2 text-blue-600' />
              <span className='text-sm font-medium'>Status</span>
            </div>
            <span
              className={`font-semibold ${
                booking.status === 'canceled'
                  ? 'text-red-500'
                  : 'text-green-500'
              }`}>
              {booking.status}
            </span>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center text-gray-600 mb-1'>
              <FaDollarSign className='mr-2 text-blue-600' />
              <span className='text-sm font-medium'>Price</span>
            </div>
            <span className='text-gray-800 font-bold'>
              Rs {booking.total || booking.bikeDetails.bikePrice}
            </span>
          </div>
        </div>

        <div className='space-y-3 mb-6'>
          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center text-gray-600 mb-1'>
              <FaMotorcycle className='mr-2 text-blue-600' />
              <span className='text-sm font-medium'>Bike Details</span>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div>
                <span className='text-gray-500'>Model:</span>
                <span className='ml-1 text-gray-800'>
                  {booking.bikeDetails.bikeModel}
                </span>
              </div>
              <div>
                <span className='text-gray-500'>Bike #:</span>
                <span className='ml-1 text-gray-800'>
                  {booking.bikeNumber || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='flex items-center text-gray-600 mb-1'>
              <FaMapMarkerAlt className='mr-2 text-blue-600' />
              <span className='text-sm font-medium'>Service Address</span>
            </div>
            <span className='text-gray-800'>
              {booking.bookingAddress || 'Address not provided'}
            </span>
          </div>

          {booking.bikeDescription && (
            <div className='bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center text-gray-600 mb-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-2 text-blue-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                <span className='text-sm font-medium'>Description</span>
              </div>
              <p className='text-gray-800 text-sm'>{booking.bikeDescription}</p>
            </div>
          )}
        </div>

        <div className='flex space-x-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200'>
            Close
          </button>
          {booking.status !== 'canceled' && (
            <button
              onClick={() => {
                handleCancelBooking(booking.id);
                onClose();
              }}
              className='flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200'>
              Cancel Booking
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='relative'>
          <div className='h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <FaMotorcycle className='h-8 w-8 text-blue-600 animate-pulse' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50 px-4'>
        <div
          className='bg-white border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-lg max-w-lg w-full'
          role='alert'>
          <div className='flex items-center'>
            <svg
              className='h-6 w-6 mr-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
            </svg>
            <div>
              <p className='font-bold'>Error Loading Bookings</p>
              <p className='text-sm'>{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 w-full bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition duration-200'>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Your Bookings
          </h1>
          <p className='text-gray-600 mb-8'>
            Manage your motorcycle service appointments
          </p>

          <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
            <div className='w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <FaMotorcycle className='h-12 w-12 text-blue-600' />
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>
              No Bookings Found
            </h2>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              You don't have any active bookings at the moment. Book a service
              to keep your motorcycle in top condition.
            </p>
            <button
              onClick={() => (window.location.href = '/bike')}
              className='px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Your Bookings
            </h1>
            <p className='text-gray-600'>
              Manage your motorcycle service appointments
            </p>
          </div>

          <div className='mt-4 md:mt-0 flex space-x-2'>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}>
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}>
              Active
            </button>
            <button
              onClick={() => setFilter('canceled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'canceled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}>
              Canceled
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
            <p className='text-gray-600'>
              No {filter !== 'all' ? filter : ''} bookings found.
            </p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 gap-6'>
              <AnimatePresence>
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredBookings.some(
              (booking) => booking.status !== 'canceled'
            ) && (
              <div className='mt-8 bg-white p-6 rounded-xl shadow-lg'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                  <div className='mb-4 sm:mb-0'>
                    <p className='text-sm text-gray-500 mb-1'>
                      Total amount due
                    </p>
                    <p className='text-3xl font-bold text-gray-900'>
                      Rs {calculateTotal()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingDetails
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;
