import React, { useCallback, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getFeedbackApi } from '../../../api/api';

const StarRating = ({ rating }) => (
  <div className='flex'>
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-yellow-500' : 'text-gray-600'}
      />
    ))}
  </div>
);

const FeedbackCard = ({ feedback }) => (
  <div className='bg-gray-800 rounded-lg shadow-lg p-6 mb-4 transition-transform duration-300 hover:transform hover:scale-105'>
    <div className='flex items-center mb-4 justify-between'>
      <div>
        <p className='text-white font-semibold'>{feedback.user.fullName}</p>
        <div className='flex items-center'>
          <StarRating rating={feedback.rating} />
          {feedback.date && (
            <span className='ml-2 text-green-500'>
              • {new Date(feedback.date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
    {feedback.subject && (
      <p className='text-gray-300 font-medium mb-2'>{feedback.subject}</p>
    )}
    {feedback.message && <p className='text-gray-400'>{feedback.message}</p>}
  </div>
);

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFeedbackApi();
      console.log(res.data); // For debugging

      if (res.status === 200) {
        setFeedbacks(res.data.data);
      } else {
        throw new Error('Invalid data received from the server');
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again.');
      toast.error('Failed to load feedbacks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  if (loading) {
    return (
      <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative p-6'>
        {error}
      </div>
    );
  }

  return (
    <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative p-6'>
      <h1 className='text-4xl font-bold mb-8'>Customer Feedbacks</h1>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <FeedbackCard
            key={feedback._id || index}
            feedback={feedback}
          />
        ))
      ) : (
        <p className='text-center text-xl text-gray-400'>
          No Feedbacks available at the moment.
        </p>
      )}
    </div>
  );
};

export default Feedback;
