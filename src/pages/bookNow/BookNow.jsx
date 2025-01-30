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
        const bikes = await getAllBikeApi();
        setBikes(bikes.data.bikes);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
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
      <div className='tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-red-50'>
        <div className='tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-md tw-text-center'>
          <h2 className='tw-text-2xl tw-font-bold tw-text-red-600 tw-mb-4'>
            Error
          </h2>
          <p className='tw-text-gray-700'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-100'>
      <div className='tw-container tw-mx-auto tw-p-8'>
        <motion.h1
          className='tw-text-5xl tw-font-extrabold tw-text-center tw-mb-12 tw-text-indigo-900'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          Choose Your Bike
        </motion.h1>

        {loading ? (
          <div className='tw-flex tw-justify-center tw-items-center tw-h-64'>
            <div className='tw-animate-spin tw-rounded-full tw-h-32 tw-w-32 tw-border-t-2 tw-border-b-2 tw-border-indigo-500'></div>
          </div>
        ) : (
          <motion.div
            className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-gap-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            {bikes.map((singleBike, index) => (
              <motion.div
                key={singleBike._id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}>
                <MyCard
                  bikeInformation={singleBike}
                  color={'indigo'}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookNow;
