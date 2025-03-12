import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaFileAlt,
  FaFilter,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaMotorcycle,
  FaPhoneAlt,
  FaSort,
  FaUser,
  FaWrench,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  assignMechanicToBookingApi,
  getAllBookingApi,
  getAllMechanicsApi,
} from '../../../api/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'bookingDate',
    direction: 'descending',
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [mechanics, setMechanics] = useState([]);
  const [showMechanicModal, setShowMechanicModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [loadingMechanics, setLoadingMechanics] = useState(false);
  const [assigningMechanic, setAssigningMechanic] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllBookingApi()
      .then((res) => {
        if (res.status === 200) {
          setBookings(
            Array.isArray(res.data?.bookings) ? res.data.bookings : []
          );
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

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'complete' || statusLower === 'completed') {
      return 'tw-bg-green-500';
    } else if (statusLower === 'pending') {
      return 'tw-bg-yellow-500';
    } else if (statusLower === 'canceled') {
      return 'tw-bg-red-500';
    }
    return 'tw-bg-gray-500';
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
        } else if (sortConfig.key === 'total') {
          aValue = parseFloat(a.total || 0);
          bValue = parseFloat(b.total || 0);
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

  const filteredBookings = sortedBookings.filter((booking) => {
    // First filter by search term
    const matchesSearch =
      booking.userDetails?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.bikeDetails?.bikeName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.bikeNumber || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.userDetails?.email || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    (booking.mechanicDetails?.name || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Then filter by status if a specific status is selected
    const matchesStatus =
      selectedStatus === 'all' ||
      booking.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const toggleBookingDetails = (id) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  const openMechanicModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setLoadingMechanics(true);
    setShowMechanicModal(true);

    // Fetch mechanics list
    getAllMechanicsApi()
      .then((res) => {
        if (res.status === 200) {
          setMechanics(Array.isArray(res.data.data) ? res.data.data : []);
        } else {
          setMechanics([]);
          toast.error('Failed to load mechanics list');
        }
        setLoadingMechanics(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to load mechanics. Please try again.');
        setMechanics([]);
        setLoadingMechanics(false);
      });
  };

  const closeMechanicModal = () => {
    setShowMechanicModal(false);
    setSelectedBookingId(null);
    setSelectedMechanic(null);
  };

  const handleMechanicSelect = (mechanic) => {
    setSelectedMechanic(mechanic);
    console.log('Selected mechanic:', mechanic);
  };

  const assignMechanic = () => {
    if (!selectedMechanic || !selectedBookingId) {
      toast.error('Please select a mechanic first');
      return;
    }

    setAssigningMechanic(true);
    const data = {
      isAssignedTo: [selectedBookingId],
    };
    const id = selectedMechanic.mechanicId;
    assignMechanicToBookingApi(id, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Mechanic assigned successfully');

          // Update the booking in the local state
          const updatedBookings = bookings.map((booking) =>
            booking.id === selectedBookingId
              ? {
                  ...booking,
                  mechanicId: selectedMechanic.mechanicId,
                  mechanicName: selectedMechanic.fullName,
                  mechanicDetails: selectedMechanic, // Add mechanic details
                }
              : booking
          );
          setBookings(updatedBookings);

          closeMechanicModal();
        } else {
          toast.error('Failed to assign mechanic');
        }
        setAssigningMechanic(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast.error(err.response.data.message);
        setAssigningMechanic(false);
      });
  };

  // Check if booking status is canceled
  const isBookingCanceled = (status) => {
    return status?.toLowerCase() === 'canceled';
  };

  const statuses = ['all', 'pending', 'complete', 'canceled'];

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

      {/* Mechanic Assignment Modal */}
      {showMechanicModal && (
        <div className='tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-75 tw-flex tw-items-center tw-justify-center tw-z-50'>
          <div className='tw-bg-gray-800 tw-rounded-lg tw-p-6 tw-w-full tw-max-w-lg tw-max-h-[80vh] tw-overflow-y-auto'>
            <div className='tw-flex tw-justify-between tw-items-center tw-mb-4'>
              <h2 className='tw-text-2xl tw-font-bold'>Assign Mechanic</h2>
              <button
                onClick={closeMechanicModal}
                className='tw-bg-gray-700 tw-rounded-full tw-p-2 hover:tw-bg-gray-600'>
                <svg
                  className='tw-w-5 tw-h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'></path>
                </svg>
              </button>
            </div>

            {loadingMechanics ? (
              <div className='tw-flex tw-justify-center tw-items-center tw-py-10'>
                <div className='tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-t-2 tw-border-b-2 tw-border-blue-500'></div>
              </div>
            ) : mechanics.length === 0 ? (
              <div className='tw-text-center tw-py-8'>
                <FaWrench className='tw-mx-auto tw-text-4xl tw-text-gray-500 tw-mb-3' />
                <p className='tw-text-gray-400 tw-text-lg'>
                  No mechanics available at the moment
                </p>
                <button
                  onClick={closeMechanicModal}
                  className='tw-mt-4 tw-bg-blue-600 tw-text-white tw-py-2 tw-px-6 tw-rounded hover:tw-bg-blue-700 tw-transition-colors'>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className='tw-mb-4'>
                  <input
                    type='text'
                    placeholder='Search mechanics...'
                    className='tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-bg-gray-700 tw-text-white tw-border tw-border-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500'
                  />
                </div>
                <div className='tw-mb-6 tw-max-h-96 tw-overflow-y-auto tw-border tw-border-gray-700 tw-rounded-lg'>
                  {mechanics.map((mechanic) => (
                    <div
                      key={mechanic.mechanicId}
                      onClick={() => handleMechanicSelect(mechanic)}
                      className={`tw-flex tw-items-center tw-p-3 tw-border-b tw-border-gray-700 hover:tw-bg-gray-700 tw-cursor-pointer tw-transition-colors ${
                        selectedMechanic?.mechanicId === mechanic.mechanicId
                          ? 'tw-bg-blue-900'
                          : ''
                      }`}>
                      <div className='tw-w-10 tw-h-10 tw-bg-blue-600 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-3'>
                        <FaWrench className='tw-text-white' />
                      </div>
                      <div className='tw-flex-1'>
                        <h3 className='tw-font-medium'>{mechanic.fullName}</h3>
                        <div className='tw-flex tw-items-center tw-text-sm tw-text-gray-400'>
                          <FaPhoneAlt className='tw-mr-1 tw-text-xs' />
                          {mechanic.phoneNumber || 'N/A'}
                        </div>
                        {/* Display mechanic's email if available */}
                        {mechanic.email && (
                          <div className='tw-flex tw-items-center tw-text-sm tw-text-gray-400'>
                            <FaEnvelope className='tw-mr-1 tw-text-xs' />
                            {mechanic.email}
                          </div>
                        )}
                      </div>
                      <div className='tw-w-6 tw-h-6 tw-rounded-full tw-border tw-border-gray-500 tw-flex tw-items-center tw-justify-center'>
                        {selectedMechanic?.mechanicId ===
                          mechanic.mechanicId && (
                          <div className='tw-w-4 tw-h-4 tw-bg-blue-500 tw-rounded-full'></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='tw-flex tw-justify-end tw-gap-3'>
                  <button
                    onClick={closeMechanicModal}
                    className='tw-bg-gray-700 hover:tw-bg-gray-600 tw-text-white tw-py-2 tw-px-4 tw-rounded'>
                    Cancel
                  </button>
                  <button
                    onClick={assignMechanic}
                    disabled={!selectedMechanic || assigningMechanic}
                    className={`tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-2 tw-px-4 tw-rounded tw-flex tw-items-center ${
                      !selectedMechanic || assigningMechanic
                        ? 'tw-opacity-50 tw-cursor-not-allowed'
                        : ''
                    }`}>
                    {assigningMechanic && (
                      <svg
                        className='tw-animate-spin tw-mr-2 tw-h-4 tw-w-4 tw-text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle
                          className='tw-opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'></circle>
                        <path
                          className='tw-opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                    )}
                    Assign Mechanic
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className='tw-flex tw-justify-between tw-items-center tw-mb-8'>
        <h1 className='tw-text-4xl tw-font-bold tw-text-white'>
          Bookings{' '}
          <span className='tw-text-lg tw-text-gray-400 tw-ml-2'>
            ({filteredBookings.length})
          </span>
        </h1>
        <div className='tw-flex tw-gap-4'>
          <button
            onClick={() => setViewMode('grid')}
            className={`tw-p-2 tw-rounded-lg ${
              viewMode === 'grid' ? 'tw-bg-blue-600' : 'tw-bg-gray-700'
            }`}
            title='Grid View'>
            <svg
              className='tw-w-6 tw-h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'></path>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`tw-p-2 tw-rounded-lg ${
              viewMode === 'list' ? 'tw-bg-blue-600' : 'tw-bg-gray-700'
            }`}
            title='List View'>
            <svg
              className='tw-w-6 tw-h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'></path>
            </svg>
          </button>
        </div>
      </div>

      <div className='tw-mb-6 tw-flex tw-flex-wrap tw-items-center tw-gap-4'>
        <div className='tw-flex-grow tw-relative'>
          <input
            type='text'
            placeholder='Search by name, email, bike...'
            className='tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className='tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400'>
            <svg
              className='tw-w-5 tw-h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
            </svg>
          </div>
        </div>

        <div className='tw-flex tw-items-center tw-gap-2'>
          <span className='tw-text-gray-400 tw-flex tw-items-center'>
            <FaFilter className='tw-mr-1' /> Filter:
          </span>
          <select
            className='tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500'
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}>
            {statuses.map((status) => (
              <option
                key={status}
                value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='tw-mb-6 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-justify-start'>
        <button
          onClick={() => requestSort('bookingDate')}
          className={`tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 hover:tw-bg-gray-700 tw-transition-colors ${
            sortConfig.key === 'bookingDate' ? 'tw-bg-blue-600' : ''
          }`}>
          Date <FaSort className='tw-inline tw-ml-1' />
        </button>
        <button
          onClick={() => requestSort('customerName')}
          className={`tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 hover:tw-bg-gray-700 tw-transition-colors ${
            sortConfig.key === 'customerName' ? 'tw-bg-blue-600' : ''
          }`}>
          Name <FaSort className='tw-inline tw-ml-1' />
        </button>
        <button
          onClick={() => requestSort('status')}
          className={`tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 hover:tw-bg-gray-700 tw-transition-colors ${
            sortConfig.key === 'status' ? 'tw-bg-blue-600' : ''
          }`}>
          Status <FaSort className='tw-inline tw-ml-1' />
        </button>
        <button
          onClick={() => requestSort('total')}
          className={`tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700 hover:tw-bg-gray-700 tw-transition-colors ${
            sortConfig.key === 'total' ? 'tw-bg-blue-600' : ''
          }`}>
          Amount <FaSort className='tw-inline tw-ml-1' />
        </button>
      </div>

      {loading ? (
        <div className='tw-flex tw-justify-center tw-items-center tw-h-64'>
          <div className='tw-animate-spin tw-rounded-full tw-h-32 tw-w-32 tw-border-t-2 tw-border-b-2 tw-border-blue-500'></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-64 tw-bg-gray-800 tw-rounded-lg tw-p-8'>
          <svg
            className='tw-w-16 tw-h-16 tw-text-gray-500 tw-mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
          </svg>
          <p className='tw-text-center tw-text-xl tw-text-gray-400 tw-mb-2'>
            No bookings found.
          </p>
          <p className='tw-text-center tw-text-gray-500'>
            Try changing your search criteria or filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6'>
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='tw-bg-gray-800 tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-transition-transform tw-duration-300 hover:tw-transform hover:tw-scale-105'>
              {booking.bikeDetails?.imageUrl && (
                <div className='tw-h-48 tw-bg-gray-700 tw-overflow-hidden'>
                  <img
                    src={booking.bikeDetails.imageUrl}
                    alt={booking.bikeDetails.bikeName}
                    className='tw-w-full tw-h-full tw-object-cover'
                  />
                </div>
              )}
              <div className='tw-p-6'>
                <div className='tw-flex tw-justify-between tw-items-center tw-mb-4'>
                  <h2 className='tw-text-2xl tw-font-semibold'>
                    {booking.userDetails?.fullName || 'Unknown User'}
                  </h2>
                  <span
                    className={`tw-inline-block tw-px-3 tw-py-1 tw-text-sm tw-font-semibold tw-rounded-full ${getStatusColor(
                      booking.status
                    )}`}>
                    {booking.status || 'Unknown'}
                  </span>
                </div>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaMotorcycle className='tw-mr-2 tw-text-blue-500' />
                  <p>
                    {booking.bikeDetails?.bikeName || 'Unknown Bike'}{' '}
                    {booking.bikeDetails?.bikeModel || ''} -{' '}
                    {booking.bikeNumber || 'No Number'}
                  </p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaUser className='tw-mr-2 tw-text-purple-400' />
                  <p>{booking.userDetails?.fullName || 'No Name'}</p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaEnvelope className='tw-mr-2 tw-text-indigo-400' />
                  <p className='tw-truncate'>
                    {booking.userDetails?.email || 'No Email'}
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
                  <p>
                    {booking.bookingDate
                      ? formatDate(booking.bookingDate)
                      : 'No Date'}
                  </p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-2'>
                  <FaClock className='tw-mr-2 tw-text-purple-500' />
                  <p>{booking.bookingTime || 'No Time'}</p>
                </div>
                <div className='tw-flex tw-items-center tw-mb-4'>
                  <FaMoneyBillWave className='tw-mr-2 tw-text-green-400' />
                  <p className='tw-font-bold'>
                    Rs {parseFloat(booking.total || 0).toFixed(2)}
                  </p>
                </div>

                {booking.mechanicDetails ? (
                  <div className='tw-flex tw-items-center tw-mb-4 tw-bg-blue-900 tw-bg-opacity-40 tw-p-2 tw-rounded'>
                    <FaWrench className='tw-mr-2 tw-text-blue-400' />
                    <p>
                      Assigned to:{' '}
                      <span className='tw-font-medium'>
                        {booking.mechanicDetails.name}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className='tw-flex tw-items-center tw-mb-4 tw-bg-blue-900 tw-bg-opacity-40 tw-p-2 tw-rounded'>
                    <FaWrench className='tw-mr-2 tw-text-blue-400' />
                    <p>
                      <span className='tw-font-medium'>Not Assigned</span>
                    </p>
                  </div>
                )}

                <div className='tw-flex tw-justify-between tw-items-center tw-mt-6'>
                  <button
                    onClick={() => toggleBookingDetails(booking.id)}
                    className='tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-transition-colors tw-duration-300'>
                    {expandedBooking === booking.id
                      ? 'Hide Details'
                      : 'View Details'}
                  </button>
                </div>

                {expandedBooking === booking.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className='tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-700'>
                    <div className='tw-mb-4'>
                      <h3 className='tw-text-lg tw-font-semibold tw-mb-2 tw-flex tw-items-center'>
                        <FaFileAlt className='tw-mr-2 tw-text-yellow-400' />
                        Service Details
                      </h3>
                      <p className='tw-text-gray-300'>
                        {booking.serviceDescription ||
                          'No service description provided.'}
                      </p>
                    </div>

                    {/* Services List */}
                    {booking.services && booking.services.length > 0 && (
                      <div className='tw-mb-4'>
                        <h4 className='tw-font-medium tw-mb-2 tw-text-blue-300'>
                          Requested Services:
                        </h4>
                        <ul className='tw-list-disc tw-list-inside tw-text-gray-300'>
                          {booking.services.map((service, index) => (
                            <li
                              key={index}
                              className='tw-mb-1'>
                              {service.name} - Rs
                              {parseFloat(service.price || 0).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {booking.additionalNotes && (
                      <div className='tw-mb-4'>
                        <h4 className='tw-font-medium tw-mb-2 tw-text-blue-300'>
                          Additional Notes:
                        </h4>
                        <p className='tw-text-gray-300 tw-italic'>
                          "{booking.additionalNotes}"
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className='tw-flex tw-gap-2 tw-flex-wrap tw-mt-4'>
                      {!booking.mechanicId && booking.status !== 'canceled' && (
                        <button
                          onClick={() => openMechanicModal(booking.id)}
                          className='tw-bg-purple-600 hover:tw-bg-purple-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-flex tw-items-center tw-transition-colors'>
                          <FaWrench className='tw-mr-2' /> Assign Mechanic
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className='tw-bg-gray-800 tw-rounded-lg tw-overflow-hidden tw-shadow-xl'>
          <div className='tw-overflow-x-auto'>
            <table className='tw-min-w-full tw-divide-y tw-divide-gray-700'>
              <thead className='tw-bg-gray-700'>
                <tr>
                  <th
                    scope='col'
                    className='tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-300 tw-uppercase tw-tracking-wider'>
                    Booking Details
                  </th>
                  <th
                    scope='col'
                    className='tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-300 tw-uppercase tw-tracking-wider'>
                    Customer
                  </th>
                  <th
                    scope='col'
                    className='tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-300 tw-uppercase tw-tracking-wider'>
                    Bike
                  </th>
                  <th
                    scope='col'
                    className='tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-300 tw-uppercase tw-tracking-wider'>
                    Status
                  </th>
                  <th
                    scope='col'
                    className='tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-300 tw-uppercase tw-tracking-wider'>
                    Amount
                  </th>
                  <th
                    scope='col'
                    className='tw-px-6 tw-py-3 tw-text-right tw-text-xs tw-font-medium tw-text-gray-300 tw-uppercase tw-tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='tw-bg-gray-800 tw-divide-y tw-divide-gray-700'>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className='hover:tw-bg-gray-700 tw-transition-colors'>
                    <td className='tw-px-6 tw-py-4 tw-whitespace-nowrap'>
                      <div className='tw-flex tw-items-center'>
                        <div className='tw-flex-shrink-0 tw-h-10 tw-w-10'>
                          <div className='tw-h-10 tw-w-10 tw-rounded-full tw-bg-blue-500 tw-flex tw-items-center tw-justify-center'>
                            <FaCalendarAlt className='tw-text-white' />
                          </div>
                        </div>
                        <div className='tw-ml-4'>
                          <div className='tw-text-sm tw-font-medium tw-text-white'>
                            {booking.bookingDate
                              ? formatDate(booking.bookingDate)
                              : 'No Date'}
                          </div>
                          <div className='tw-text-sm tw-text-gray-400'>
                            {booking.bookingTime || 'No Time'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='tw-px-6 tw-py-4 tw-whitespace-nowrap'>
                      <div className='tw-text-sm tw-font-medium tw-text-white'>
                        {booking.userDetails?.fullName || 'Unknown User'}
                      </div>
                      <div className='tw-text-sm tw-text-gray-400'>
                        {booking.userDetails?.email || 'No Email'}
                      </div>
                      <div className='tw-text-sm tw-text-gray-400'>
                        {booking.userDetails?.phoneNumber || 'No Phone'}
                      </div>
                    </td>
                    <td className='tw-px-6 tw-py-4 tw-whitespace-nowrap'>
                      <div className='tw-text-sm tw-font-medium tw-text-white'>
                        {booking.bikeDetails?.bikeName || 'Unknown Bike'}
                      </div>
                      <div className='tw-text-sm tw-text-gray-400'>
                        {booking.bikeNumber || 'No Number'}
                      </div>
                    </td>
                    <td className='tw-px-6 tw-py-4 tw-whitespace-nowrap'>
                      <span
                        className={`tw-px-3 tw-py-1 tw-inline-flex tw-text-xs tw-leading-5 tw-font-semibold tw-rounded-full ${getStatusColor(
                          booking.status
                        )}`}>
                        {booking.status || 'Unknown'}
                      </span>
                      {booking.mechanicName && (
                        <div className='tw-text-sm tw-text-gray-400 tw-mt-2'>
                          <span className='tw-flex tw-items-center'>
                            <FaWrench className='tw-mr-1 tw-text-blue-400' />
                            {booking.mechanicName}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className='tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-white'>
                      Rs {parseFloat(booking.total || 0).toFixed(2)}
                    </td>
                    <td className='tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-right tw-text-sm tw-font-medium'>
                      <div className='tw-flex tw-justify-end tw-space-x-2'>
                        {!booking.mechanicId &&
                          booking.status !== 'canceled' && (
                            <button
                              onClick={() => openMechanicModal(booking.id)}
                              className='tw-text-purple-500 hover:tw-text-purple-400 tw-transition-colors'>
                              Assign
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className='tw-flex tw-justify-between tw-items-center tw-mt-8'>
        <div className='tw-text-sm tw-text-gray-400'>
          Showing{' '}
          <span className='tw-font-medium'>{filteredBookings.length}</span> of{' '}
          <span className='tw-font-medium'>{bookings.length}</span> bookings
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBookings;
