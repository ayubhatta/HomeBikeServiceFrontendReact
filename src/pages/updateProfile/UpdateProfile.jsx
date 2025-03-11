import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUserApi, updateProfileApi } from '../../api/api';

const UpdateProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseData, setResponseData] = useState(null);

  // Primary blue color
  const primaryBlue = '#1a73e8';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserApi(id);
        const user = response.data;

        // Store complete response for display

        setUserData({
          fullName: user?.fullName || '',
          email: user?.email || '',
          phoneNumber: user?.phoneNumber || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', userData.fullName);
      formData.append('email', userData.email);
      formData.append('phoneNumber', userData.phoneNumber);

      const response = await updateProfileApi(formData);

      if (response.status === 200) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update user profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div
          className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4'
          style={{ borderColor: primaryBlue }}></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all hover:shadow-xl'
        style={{ borderTop: `4px solid ${primaryBlue}` }}>
        <h2
          className='text-3xl font-bold mb-6 text-center'
          style={{ color: primaryBlue }}>
          Update Profile
        </h2>
        <form
          onSubmit={saveChanges}
          className='space-y-6'>
          <div>
            <label
              htmlFor='fullName'
              className='block text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              value={userData.fullName}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-2'
              style={{
                focusBorderColor: primaryBlue,
                focusRingColor: `${primaryBlue}33`,
              }}
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={userData.email}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-2'
              style={{
                focusBorderColor: primaryBlue,
                focusRingColor: `${primaryBlue}33`,
              }}
            />
          </div>
          <div>
            <label
              htmlFor='phoneNumber'
              className='block text-sm font-medium text-gray-700'>
              Phone Number
            </label>
            <input
              type='text'
              id='phoneNumber'
              name='phoneNumber'
              value={userData.phoneNumber}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-2'
              style={{
                focusBorderColor: primaryBlue,
                focusRingColor: `${primaryBlue}33`,
              }}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-300'
              style={{
                backgroundColor: primaryBlue,
                opacity: isSubmitting ? 0.7 : 1,
                hover: { backgroundColor: '#1557b5' },
              }}>
              {isSubmitting ? (
                <div className='flex items-center'>
                  <svg
                    className='animate-spin h-5 w-5 mr-3'
                    viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
