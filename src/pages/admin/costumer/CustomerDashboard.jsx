import React, { useCallback, useEffect, useState } from 'react';
import { FaEllipsisH, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllUsersApi, updateRoleToMechanicApi } from '../../../api/api';

const CustomerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    getAllUsersApi()
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setUsers(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('No User Found');
        setLoading(false);
      });
  }, []);

  // Function to show confirmation dialog
  const promptConfirmation = (id) => {
    setSelectedUserId(id);
    setShowConfirmation(true);
  };

  // Function to update user role to Mechanic after confirmation
  const handleRoleUpdate = () => {
    console.log('Updating user role to Mechanic:', selectedUserId);
    updateRoleToMechanicApi(selectedUserId)
      .then((res) => {
        if (res.status === 200) {
          toast.success('User role updated successfully!');
          fetchUsers(); // Refresh the user list
          setShowConfirmation(false); // Close confirmation dialog
        }
      })
      .catch((err) => {
        console.error('Error updating user role:', err);
        toast.error('Failed to update user role. Please try again.');
        setShowConfirmation(false); // Close confirmation dialog
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
  );

  return (
    <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative'>
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto'>
            <h2 className='text-xl font-bold mb-4'>Confirm Role Change</h2>
            <p className='mb-6'>
              Are you sure you want to change this user's role to Mechanic?
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
                onClick={() => setShowConfirmation(false)}>
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                onClick={handleRoleUpdate}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
        <div className='mb-6 flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>User Dashboard</h1>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search users...'
              className='bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className='text-center py-10'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
            <p className='mt-4'>Loading users...</p>
          </div>
        ) : error ? (
          <div className='text-center py-10 text-red-500'>{error}</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-gray-700 rounded-lg overflow-hidden'>
              <thead className='bg-gray-600'>
                <tr>
                  <th className='py-3 px-4 text-left'>No</th>
                  <th className='py-3 px-4 text-left'>User Name</th>
                  <th className='py-3 px-4 text-left'>User Email</th>
                  <th className='py-3 px-4 text-left'>User Phone</th>
                  <th className='py-3 px-4 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.userId}
                    className='border-t border-gray-600 hover:bg-gray-650 transition duration-150 ease-in-out'>
                    <td className='py-3 px-4'>{index + 1}</td>
                    <td className='py-3 px-4 flex items-center'>
                      <FaUserCircle className='mr-2 text-blue-400' />
                      {user.fullName}
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex items-center'>
                        <FaEnvelope className='mr-2 text-green-400' />
                        {user.email}
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex items-center'>
                        <FaPhone className='mr-2 text-yellow-400' />
                        {user.phoneNumber}
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <button
                        className='flex items-center bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded'
                        onClick={() => promptConfirmation(user.id)}>
                        <FaEllipsisH className='mr-2' />
                        Change To Mechanic
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className='text-center py-10 text-gray-400'>
            No users found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
