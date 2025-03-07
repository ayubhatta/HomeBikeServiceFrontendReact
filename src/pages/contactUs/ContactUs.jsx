import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { sendFeedbackApi, userID } from './../../api/api';
import StarRating from './StarRating';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Primary color palette
  const primaryColor = '#3b82f6'; // Bright blue as primary color
  const primaryDark = '#1e40af'; // Darker shade of primary
  const primaryLight = '#93c5fd'; // Lighter shade of primary

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = { ...formData, rating, userID };

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      if (!userID) {
        throw new Error('User ID is missing');
      }
      const response = await sendFeedbackApi(feedbackData);
      console.log('Form submitted:', response.data);
      setFormData({ subject: '', message: '' });
      setRating(0);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Auto-hide status message after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <motion.section
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='tw-py-20 tw-min-h-screen tw-flex tw-items-center tw-justify-center'
      style={{
        background: `radial-gradient(circle at 30% 107%, ${primaryLight}10, ${primaryColor}05 45%, ${primaryDark}08 80%, ${primaryDark}08 100%)`,
      }}>
      <div className='tw-container tw-mx-auto tw-px-4'>
        <motion.div
          variants={itemVariants}
          className='tw-max-w-5xl tw-mx-auto tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-overflow-hidden tw-transform tw-transition-all tw-duration-300 hover:tw-shadow-3xl'
          style={{ boxShadow: `0 10px 40px -10px ${primaryColor}40` }}>
          <div className='tw-flex tw-flex-col md:tw-flex-row'>
            {/* Left Section */}
            <div
              className='md:tw-w-2/5 tw-p-12 tw-text-white'
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryDark})`,
              }}>
              <motion.h2
                variants={itemVariants}
                className='tw-text-4xl tw-font-extrabold tw-mb-6 tw-tracking-tight'>
                Get in Touch
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className='tw-mb-8 tw-text-lg tw-leading-relaxed tw-opacity-90'>
                We'd love to hear from you! Share your feedback or get in touch
                with us using the form.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className='tw-space-y-8'>
                {/* Map/Location */}
                <div className='tw-flex tw-items-start'>
                  <div
                    className='tw-p-3 tw-rounded-full tw-mr-4 tw-flex-shrink-0'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <svg
                      className='tw-h-6 tw-w-6'
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
                  </div>
                  <div>
                    <h4 className='tw-text-lg tw-font-semibold tw-mb-1'>
                      Our Location
                    </h4>
                    <span className='tw-text-base tw-opacity-90'>
                      Dillibazzar Pipalbot, Kathmandu, Nepal
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className='tw-flex tw-items-start'>
                  <div
                    className='tw-p-3 tw-rounded-full tw-mr-4 tw-flex-shrink-0'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <svg
                      className='tw-h-6 tw-w-6'
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
                  </div>
                  <div>
                    <h4 className='tw-text-lg tw-font-semibold tw-mb-1'>
                      Email Us
                    </h4>
                    <span className='tw-text-base tw-opacity-90'>
                      bhatta.ayub1263@gmail.com
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className='tw-flex tw-items-start'>
                  <div
                    className='tw-p-3 tw-rounded-full tw-mr-4 tw-flex-shrink-0'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <svg
                      className='tw-h-6 tw-w-6'
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
                  </div>
                  <div>
                    <h4 className='tw-text-lg tw-font-semibold tw-mb-1'>
                      Call Us
                    </h4>
                    <span className='tw-text-base tw-opacity-90'>
                      +977 9863589173
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                variants={itemVariants}
                className='tw-mt-12 tw-p-4 tw-rounded-lg'
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <h4 className='tw-text-lg tw-font-semibold tw-mb-2'>
                  Business Hours
                </h4>
                <div className='tw-flex tw-justify-between tw-items-center tw-mb-2'>
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className='tw-flex tw-justify-between tw-items-center tw-mb-2'>
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className='tw-flex tw-justify-between tw-items-center'>
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className='md:tw-w-3/5 tw-p-12'>
              <motion.h3
                variants={itemVariants}
                className='tw-text-3xl tw-font-bold tw-mb-2 tw-text-gray-800'>
                Send us Feedback
              </motion.h3>

              <motion.p
                variants={itemVariants}
                className='tw-text-gray-600 tw-mb-6'>
                Your feedback helps us improve our service and provide a better
                experience.
              </motion.p>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='tw-mb-6 tw-p-4 tw-rounded-lg tw-bg-green-50 tw-border-l-4 tw-border-green-500 tw-text-green-700'>
                  Thank you for your feedback! We appreciate your time.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='tw-mb-6 tw-p-4 tw-rounded-lg tw-bg-red-50 tw-border-l-4 tw-border-red-500 tw-text-red-700'>
                  There was a problem submitting your feedback. Please try
                  again.
                </motion.div>
              )}

              <motion.form
                variants={containerVariants}
                onSubmit={handleSubmit}
                className='tw-space-y-6'>
                {/* Subject Field */}
                <motion.div variants={itemVariants}>
                  <label className='tw-block tw-text-gray-700 tw-font-semibold tw-mb-2'>
                    Subject
                  </label>
                  <div className='tw-relative'>
                    <input
                      type='text'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      className='tw-w-full tw-p-3 tw-pl-10 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 tw-transition-all'
                      style={{
                        borderColor: `${primaryColor}30`,
                        focusRing: primaryColor,
                      }}
                      placeholder="What's this about?"
                      required
                    />
                    <div className='tw-absolute tw-left-3 tw-top-3 tw-text-gray-400'>
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
                          d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'></path>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Message Field */}
                <motion.div variants={itemVariants}>
                  <label className='tw-block tw-text-gray-700 tw-font-semibold tw-mb-2'>
                    Message
                  </label>
                  <div className='tw-relative'>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      className='tw-w-full tw-p-3 tw-pl-10 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 tw-transition-all'
                      style={{
                        borderColor: `${primaryColor}30`,
                        focusRing: primaryColor,
                      }}
                      rows='4'
                      placeholder='How can we help you today?'
                      required></textarea>
                    <div className='tw-absolute tw-left-3 tw-top-3 tw-text-gray-400'>
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
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'></path>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Rating Field */}
                <motion.div variants={itemVariants}>
                  <label className='tw-block tw-text-gray-700 tw-font-semibold tw-mb-2'>
                    Rate our service
                  </label>
                  <div className='tw-p-4 tw-bg-gray-50 tw-rounded-lg'>
                    <StarRating
                      rating={rating}
                      setRating={setRating}
                      primaryColor={primaryColor}
                    />
                    <p className='tw-mt-2 tw-text-sm tw-text-gray-500'>
                      {rating === 0
                        ? 'Select a rating'
                        : rating === 1
                        ? 'Poor - We need to improve'
                        : rating === 2
                        ? 'Fair - Below expectations'
                        : rating === 3
                        ? 'Good - Meets expectations'
                        : rating === 4
                        ? 'Very good - Exceeds expectations'
                        : 'Excellent - Outstanding service'}
                    </p>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='tw-w-full tw-py-3 tw-px-6 tw-rounded-lg tw-font-semibold tw-text-lg tw-text-white tw-transition-all tw-duration-300 tw-relative tw-overflow-hidden'
                    style={{
                      background: `linear-gradient(90deg, ${primaryColor}, ${primaryDark})`,
                      boxShadow: `0 4px 14px -3px ${primaryColor}70`,
                    }}>
                    {isSubmitting ? (
                      <span className='tw-flex tw-items-center tw-justify-center'>
                        <svg
                          className='tw-animate-spin tw-h-5 tw-w-5 tw-mr-3'
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
                        Sending...
                      </span>
                    ) : (
                      <span className='tw-flex tw-items-center tw-justify-center'>
                        Send Feedback
                        <svg
                          className='tw-w-5 tw-h-5 tw-ml-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                        </svg>
                      </span>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactUs;
