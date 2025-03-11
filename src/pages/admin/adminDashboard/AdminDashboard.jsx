import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FaCalendarCheck,
  FaMotorcycle,
  FaSearch,
  FaUsers,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllBikeApi,
  getAllUsersApi,
  getDashboardStats,
} from '../../../api/api';
import BarChart from '../../../components/BarChart';
import PieChart from '../../../components/PieChart.jsx';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBikeProducts: 0,
    totalBookings: 0,
    totalBikeParts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([getAllUsersApi(), getAllBikeApi(), getDashboardStats()])
      .then(([usersRes, bikesRes, statsRes]) => {
        if (usersRes.status === 200) setUsers(usersRes.data);
        if (bikesRes.status === 200) setBikes(bikesRes.data.bikes);
        if (statsRes.status === 200) setStats(statsRes.data.totalCount);
        setLoading(false);

        console.log(statsRes.data.totalCount); // For debugging
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch dashboard data');
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
  );

  const filteredBikes = bikes.filter(
    (bike) =>
      bike.bikeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.bikeModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-900 text-white'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-4 text-xl font-semibold'>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white tw-relative'>
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
      <main className='flex-1 p-6'>
        <h1 className='text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>
          Admin Dashboard
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg'>
            <div className='flex items-center'>
              <FaUsers className='text-4xl mr-4' />
              <div>
                <h2 className='text-xl font-semibold'>Total Users</h2>
                <p className='text-3xl font-bold'>{users.length}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg'>
            <div className='flex items-center'>
              <FaMotorcycle className='text-4xl mr-4' />
              <div>
                <h2 className='text-xl font-semibold'>Total Bikes</h2>
                <p className='text-3xl font-bold'>{bikes.length}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg'>
            <div className='flex items-center'>
              <FaCalendarCheck className='text-4xl mr-4' />
              <div>
                <h2 className='text-xl font-semibold'>Total Bookings</h2>
                <p className='text-3xl font-bold'>{stats.totalBookings}</p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className='flex flex-col lg:flex-row lg:space-x-6 mb-8'>
          <div className='lg:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>Statistics Overview</h2>
            <BarChart data={stats} />
          </div>
          <div className='lg:w-1/3 mt-6 lg:mt-0 bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>
              Booking Distribution
            </h2>
            <PieChart data={stats} />
          </div>
        </div>
        <div className='mb-6'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search users or bikes...'
              className='w-full py-2 px-4 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className='absolute left-3 top-3 text-gray-400' />
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>Users</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-gray-700 text-white rounded-lg'>
                <thead className='bg-gray-600'>
                  <tr>
                    <th className='py-3 px-4 text-left'>User Name</th>
                    <th className='py-3 px-4 text-left'>Email</th>
                    <th className='py-3 px-4 text-left'>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.userId}
                      className='hover:bg-gray-600 transition-colors duration-200'>
                      <td className='py-2 px-4'>{user.fullName}</td>
                      <td className='py-2 px-4'>{user.email}</td>
                      <td className='py-2 px-4'>{user.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>Bikes</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-gray-700 text-white rounded-lg'>
                <thead className='bg-gray-600'>
                  <tr>
                    <th className='py-3 px-4 text-left'>Image</th>
                    <th className='py-3 px-4 text-left'>Bike Name</th>
                    <th className='py-3 px-4 text-left'>Model</th>
                    <th className='py-3 px-4 text-left'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBikes.map((bike) => (
                    <tr
                      key={bike.bikeId}
                      className='hover:bg-gray-600 transition-colors duration-200'>
                      <td className='py-2 px-4'>
                        <img
                          src={bike.bikeImageUrl}
                          alt={bike.bikeName}
                          className='w-12 h-12 object-cover rounded'
                        />
                      </td>
                      <td className='py-2 px-4'>{bike.bikeName}</td>
                      <td className='py-2 px-4'>{bike.bikeModel}</td>
                      <td className='py-2 px-4'>${bike.bikePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
