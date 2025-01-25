import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { sendFeedbackApi } from './../../api/api';
import StarRating from './StarRating';

const ContactUs = () => {
  const userId = useParams();
  console.log('userId:', userId); // Check if userId is being retrieved correctly

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [rating, setRating] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = { ...formData, rating, userId };

    console.log('Feedback data to be submitted:', feedbackData); // Check data before submission

    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }
      const response = await sendFeedbackApi(feedbackData);
      console.log('Form submitted:', response.data);
      setFormData({ subject: '', message: '' });
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <section className='bg-gradient-to-br from-indigo-100 to-purple-100 py-20'>
      <div className='container mx-auto px-4'>
        <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-101 transition-transform duration-300'>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white'>
              <h2 className='text-4xl font-extrabold mb-6 tracking-tight'>
                Contact Us
              </h2>
              <p className='mb-8 text-lg leading-relaxed'>
                We'd love to hear from you! Share your feedback or get in touch
                with us using the form.
              </p>
              <div className='space-y-6'>
                <div className='flex items-center'>
                  <svg
                    className='h-8 w-8 mr-4 text-indigo-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'></path>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
                  </svg>
                  <span className='text-lg'>
                    Dillibazzar Pipalbot, Kathmandu, Nepal
                  </span>
                </div>
                <div className='flex items-center'>
                  <svg
                    className='h-8 w-8 mr-4 text-indigo-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                  </svg>
                  <span className='text-lg'>bhatta.ayub1263@gmail.com</span>
                </div>
                <div className='flex items-center'>
                  <svg
                    className='h-8 w-8 mr-4 text-indigo-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                  </svg>
                  <span className='text-lg'>+977 9863589173</span>
                </div>
              </div>
            </div>
            <div className='md:w-3/5 p-12'>
              <h3 className='text-3xl font-bold mb-6 text-gray-800'>
                Send us a Feedback
              </h3>
              <form
                onSubmit={handleSubmit}
                className='space-y-6'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Subject
                  </label>
                  <input
                    type='text'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    className='w-full p-3 border border-gray-300 rounded-md'
                    required
                  />
                </div>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Message
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    className='w-full p-3 border border-gray-300 rounded-md'
                    rows='4'
                    required></textarea>
                </div>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Rate our service
                  </label>
                  <StarRating
                    rating={rating}
                    setRating={setRating}
                  />
                </div>
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg'>
                  Send Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
