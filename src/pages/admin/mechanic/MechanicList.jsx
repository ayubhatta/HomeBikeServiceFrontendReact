import React, { useCallback, useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';
import { getAllMechanicsApi } from '../../../api/api';

const MechanicList = () => {
  const [users, setMechanics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMechanics = useCallback(() => {
    setLoading(true);
    getAllMechanicsApi()
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setMechanics(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('No Mechanic Found');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchMechanics();
  }, [fetchMechanics]);

  const filteredMechanics = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
  );

  return (
    <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
        <div className='mb-6 flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Mechanic Dashboard</h1>
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
                  <th className='py-3 px-4 text-left'>Mechanic Name</th>
                  <th className='py-3 px-4 text-left'>Mechanic Email</th>
                  <th className='py-3 px-4 text-left'>Mechanic Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredMechanics.map((user, index) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredMechanics.length === 0 && (
          <div className='text-center py-10 text-gray-400'>
            No users found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicList;
