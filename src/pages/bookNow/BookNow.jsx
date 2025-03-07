import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { getAllBikeApi } from '../../api/api';
import MyCard from '../../components/MyCard';

const BookNow = () => {
  const [bikes, setBikes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bikeCounts, setBikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 8;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllBikeApi();
        console.log('API Response:', response);

        // Make sure we're accessing the bikes array correctly
        const bikesData = response.data.bikes;
        setBikes(bikesData);

        // Calculate total pages
        const total = bikesData.length;
        setBikeCount(total);
        setTotalPages(Math.ceil(total / limit));
      } catch (err) {
        console.error('Error fetching bikes:', err);
        setError(
          err.response?.data?.message ||
            'An error occurred while fetching bikes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handlePagination = (pageNum) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='rounded-lg bg-red-50 p-8 shadow-lg'>
          <h2 className='mb-4 text-2xl font-bold text-red-600'>Error</h2>
          <p className='text-red-500'>{error}</p>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.h1
        className='mb-8 text-center text-4xl font-bold text-indigo-600'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        Choose Your Bike
      </motion.h1>

      {loading ? (
        <div className='flex h-64 items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500'></div>
        </div>
      ) : (
        <>
          <div className='mb-6 flex items-center justify-between'>
            <p className='text-gray-600'>
              Showing <span className='font-medium'>{bikes.length}</span> bikes
              {bikeCounts > 0 && (
                <span>
                  {' '}
                  out of <span className='font-medium'>{bikeCounts}</span> total
                </span>
              )}
            </p>

            <div className='rounded-md bg-indigo-50 px-4 py-2'>
              <select
                className='bg-indigo-50 text-indigo-700 focus:outline-none'
                onChange={(e) => {
                  /* Add sorting functionality */
                }}>
                <option value='price-low'>Price: Low to High</option>
                <option value='price-high'>Price: High to Low</option>
                <option value='newest'>Newest First</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {bikes.map((singleBike, index) => (
              <motion.div
                key={singleBike.id || index}
                variants={fadeInUp}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className='transform transition duration-300 hover:scale-105'>
                {/* Only render MyCard if singleBike is defined */}
                {singleBike && <MyCard bike={singleBike} />}
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className='mt-12 flex justify-center'>
              <div className='flex space-x-2'>
                <button
                  onClick={() => handlePagination(page - 1)}
                  disabled={page === 1}
                  className={`rounded-md px-4 py-2 ${
                    page === 1
                      ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}>
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePagination(i + 1)}
                    className={`rounded-md px-4 py-2 ${
                      page === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}>
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePagination(page + 1)}
                  disabled={page === totalPages}
                  className={`rounded-md px-4 py-2 ${
                    page === totalPages
                      ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}>
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookNow;
