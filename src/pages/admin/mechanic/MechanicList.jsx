import React, { useCallback, useEffect, useState } from 'react';
import { FaEye, FaPhone, FaUserCircle } from 'react-icons/fa';
import { getAllMechanicsApi } from '../../../api/api';

const MechanicList = () => {
  const [mechanics, setMechanics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchMechanics = useCallback(() => {
    setLoading(true);
    getAllMechanicsApi()
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.data);
          setMechanics(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching mechanics:', err);
        setError('No Mechanics Found');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchMechanics();
  }, [fetchMechanics]);

  const filteredMechanics = mechanics.filter(
    (mechanic) =>
      mechanic.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.userDetails?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mechanic.phoneNumber?.includes(searchTerm)
  );

  const handleViewBookings = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowBookingModal(true);
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedMechanic(null);
  };

  return (
    <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
        <div className='mb-6 flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Mechanic Dashboard</h1>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search mechanic...'
              className='bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className='text-center py-10'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
            <p className='mt-4'>Loading mechanics...</p>
          </div>
        ) : error ? (
          <div className='text-center py-10 text-red-500'>{error}</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-gray-700 rounded-lg overflow-hidden'>
              <thead className='bg-gray-600'>
                <tr>
                  <th className='py-3 px-4 text-left'>No</th>
                  <th className='py-3 px-4 text-left'>Mechanic Name</th>
                  <th className='py-3 px-4 text-left'>Mechanic Phone</th>
                  <th className='py-3 px-4 text-left'>Bookings</th>
                  <th className='py-3 px-4 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMechanics.map((mechanic, index) => (
                  <tr
                    key={mechanic.mechanicId}
                    className='border-t border-gray-600 hover:bg-gray-650 transition duration-150 ease-in-out'>
                    <td className='py-3 px-4'>{index + 1}</td>
                    <td className='py-3 px-4 flex items-center'>
                      <FaUserCircle className='mr-2 text-blue-400' />
                      {mechanic.fullName}
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex items-center'>
                        <FaPhone className='mr-2 text-yellow-400' />
                        {mechanic.phoneNumber}
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex items-center'>
                        {mechanic.bookingDetails?.length || 0} bookings
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <button
                        onClick={() => handleViewBookings(mechanic)}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center transition duration-150 ease-in-out'
                        disabled={!mechanic.bookingDetails?.length}>
                        <FaEye className='mr-1' />
                        View Bookings
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredMechanics.length === 0 && (
          <div className='text-center py-10 text-gray-400'>
            No mechanics found matching your search criteria.
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedMechanic && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
          <div className='bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold'>
                Booking Details for {selectedMechanic.fullName}
              </h2>
              <button
                onClick={closeModal}
                className='text-gray-400 hover:text-white text-xl'>
                ×
              </button>
            </div>

            {selectedMechanic.bookingDetails &&
            selectedMechanic.bookingDetails.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-gray-700 rounded-lg overflow-hidden'>
                  <thead className='bg-gray-600'>
                    <tr>
                      <th className='py-3 px-4 text-left'>ID</th>
                      <th className='py-3 px-4 text-left'>Bike</th>
                      <th className='py-3 px-4 text-left'>Bike Number</th>
                      <th className='py-3 px-4 text-left'>Date</th>
                      <th className='py-3 px-4 text-left'>Time</th>
                      <th className='py-3 px-4 text-left'>Status</th>
                      <th className='py-3 px-4 text-left'>Total</th>
                      <th className='py-3 px-4 text-left'>Customer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMechanic.bookingDetails.map((booking) => (
                      <tr
                        key={booking.id}
                        className='border-t border-gray-600 hover:bg-gray-650 transition duration-150 ease-in-out'>
                        <td className='py-3 px-4'>{booking.id}</td>
                        <td className='py-3 px-4'>
                          {booking.bikeDetails?.bikeName}{' '}
                          {booking.bikeDetails?.bikeModel}
                        </td>
                        <td className='py-3 px-4'>{booking.bikeNumber}</td>
                        <td className='py-3 px-4'>{booking.bookingDate}</td>
                        <td className='py-3 px-4'>{booking.bookingTime}</td>
                        <td className='py-3 px-4'>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              booking.status === 'Complete'
                                ? 'bg-green-600 text-white'
                                : booking.status === 'Pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className='py-3 px-4'>
                          ₹{booking.total.toFixed(2)}
                        </td>
                        <td className='py-3 px-4'>
                          {booking.userDetails?.fullName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='text-center py-10 text-gray-400'>
                No booking details available for this mechanic.
              </div>
            )}

            <div className='mt-6 flex justify-end'>
              <button
                onClick={closeModal}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out'>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicList;
