import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaIdCard,
  FaMapMarkerAlt,
  FaMotorcycle,
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
            // Handle the specific no bookings message
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
          // Handle the specific no bookings message when it comes as an error
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

  const calculateTotal = () => {
    return bookings
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
        bookings: bookings,
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
    // Handle if timeString is just a time (HH:MM:SS) or a full datetime
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString();
    }

    // If it's just a time string
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getImageUrl = (bikeId) => {
    // You may need to adjust this based on your API structure
    return `http://localhost:5000/bikes/bike-${bikeId}.jpg`;
  };

  const BookingCard = ({ booking }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.02 }}
      className='bg-white rounded-lg shadow-lg overflow-hidden mb-6'>
      <div className='md:flex'>
        <div className='md:flex-shrink-0'>
          <img
            className='h-40 w-full object-cover md:w-40'
            src={booking.bikeDetails.imageUrl}
            alt={booking.bikeDetails.bikeName}
          />
        </div>
        <div className='p-8 w-full'>
          <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>
            {booking.bikeDetails.bikeName} {booking.bikeDetails.bikeModel}
          </div>
          <div className='mt-2 flex flex-wrap justify-between items-center'>
            <div className='flex items-center text-gray-600 mr-8'>
              <FaCalendarAlt className='mr-2' />
              <span>{formatDate(booking.bookingDate)}</span>
            </div>
            <div className='flex items-center text-gray-600'>
              <FaClock className='mr-2' />
              <span>{formatTime(booking.bookingTime)}</span>
            </div>
          </div>
          <div className='mt-2'>
            <div className='flex items-center text-gray-600'>
              <FaMapMarkerAlt className='mr-2' />
              <span>{booking.bookingAddress || 'Address not provided'}</span>
            </div>
            <div className='flex items-center text-gray-600 mt-1'>
              <FaIdCard className='mr-2' />
              <span>
                Status:{' '}
                <span
                  className={`font-semibold ${
                    booking.status === 'canceled'
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}>
                  {booking.status}
                </span>
              </span>
            </div>
          </div>
          <div className='mt-4 flex justify-between items-center'>
            <span className='text-2xl font-bold text-gray-900'>
              Rs {booking.total || booking.bikeDetails.bikePrice}
            </span>
            <div className='flex items-center'>
              <button
                onClick={() => setSelectedBooking(booking)}
                className='px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                View Details
              </button>
              <button
                onClick={() => handleCancelBooking(booking.id)}
                className='px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                Cancel Booking
              </button>
              <button
                onClick={() => handleDeleteBooking(booking.id)}
                className='p-2 text-red-600 hover:text-red-800 focus:outline-none'
                title='Delete Booking'>
                <FaTrashAlt size={20} />
              </button>
            </div>
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
      className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center'>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className='bg-white p-8 rounded-lg shadow-xl max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-4'>
          {booking.bikeDetails.bikeName}
        </h2>
        <img
          className='h-40 w-full object-cover rounded-lg mb-4'
          src={getImageUrl(booking.bikeId)}
          alt={booking.bikeDetails.bikeName}
        />
        <div className='mb-4'>
          <div className='flex items-center mb-2'>
            <FaCalendarAlt className='mr-2 text-indigo-600' />
            <span>{formatDate(booking.bookingDate)}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaClock className='mr-2 text-indigo-600' />
            <span>{formatTime(booking.bookingTime)}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaMotorcycle className='mr-2 text-indigo-600' />
            <span>{booking.bikeDetails.bikeModel}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaIdCard className='mr-2 text-indigo-600' />
            <span>Chasis Number: {booking.bikeChasisNumber}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaIdCard className='mr-2 text-indigo-600' />
            <span>Bike Number: {booking.bikeNumber}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaMapMarkerAlt className='mr-2 text-indigo-600' />
            <span>Address: {booking.bookingAddress}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaIdCard className='mr-2 text-indigo-600' />
            <span>
              Status:{' '}
              <span
                className={`font-semibold ${
                  booking.status === 'canceled'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}>
                {booking.status}
              </span>
            </span>
          </div>
          <div className='flex items-center'>
            <FaDollarSign className='mr-2 text-indigo-600' />
            <span className='text-xl font-bold'>
              Rs {booking.total || booking.bikeDetails.bikePrice}
            </span>
          </div>
          {booking.bikeDescription && (
            <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
              <p className='text-gray-700'>{booking.bikeDescription}</p>
            </div>
          )}
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            Close
          </button>
          <button
            onClick={() => {
              handleCancelBooking(booking.id);
              onClose();
            }}
            className='flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            Cancel Booking
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'>
          <strong className='font-bold'>Error!</strong>
          <span className='block sm:inline'> {error}</span>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>
            Your Bookings
          </h1>
          <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
            <h2 className='text-2xl font-bold text-gray-700 mb-4'>
              No Bookings For You
            </h2>
            <p className='text-gray-600'>
              You don't have any active bookings at the moment.
            </p>
            <div className='mt-8'>
              <button
                onClick={() => (window.location.href = '/bike')}
                className='px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                Browse Bikes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8'>
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
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>
          Your Bookings
        </h1>
        <div className='grid grid-cols-1 gap-6'>
          <AnimatePresence>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
              />
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {selectedBooking && (
            <BookingDetails
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
            />
          )}
        </AnimatePresence>
        <div className='mt-8 flex justify-end'>
          <span className='text-2xl font-bold'>
            Total: Rs {calculateTotal()}
          </span>
          <button
            onClick={() => handlePayment(calculateTotal())}
            className='ml-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
