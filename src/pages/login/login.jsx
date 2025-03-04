import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaMotorcycle, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  forgotPasswordApi,
  loginUserApi,
  resetPasswordApi,
} from '../../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSentOtp, setIsSentOtp] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const validate = () => {
    let isValid = true;
    if (email.trim() === '' || !email.includes('@')) {
      setEmailError('Valid email is required');
      isValid = false;
    } else {
      setEmailError('');
    }
    if (password.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { email, password };
    loginUserApi(data)
      .then((res) => {
        if (res.data.message == 'Login successful!') {
          toast.success(res.data.message);
          console.log(res.data.user);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          window.location.href = res.data.user.isAdmin
            ? '/admin/dashboard'
            : res.data.user.role === 'Mechanic'
            ? '/mechanic'
            : '/homepage';
        }
      })
      .catch((err) => {
        toast.error(err.response?.data.message || 'Something went wrong');
      });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (resetPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const data = { phone, otp, newPassword: resetPassword };
    resetPasswordApi(data)
      .then((res) => {
        toast.success(res.data.message);
        setShowResetModal(false);
        setIsSentOtp(false);
      })
      .catch((err) => {
        toast.error(err.response?.data.message || 'Something went wrong');
      });
  };

  const sendOtp = (e) => {
    e.preventDefault();
    forgotPasswordApi({ phone })
      .then((res) => {
        toast.success(res.data.message);
        setIsSentOtp(true);
      })
      .catch((err) => {
        toast.error(err.response?.data.message || 'Something went wrong');
      });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl'>
        <div>
          <FaMotorcycle className='mx-auto h-12 w-auto text-indigo-600' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Welcome to Ride Revive
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Your one-stop solution for bike home servicing
          </p>
        </div>
        <form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label
                htmlFor='email'
                className='sr-only'>
                Email address
              </label>
              <div className='relative'>
                <FaEnvelope className='absolute top-3 left-3 text-gray-400' />
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Email address'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='password'
                className='sr-only'>
                Password
              </label>
              <div className='relative'>
                <FaLock className='absolute top-3 left-3 text-gray-400' />
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {emailError && (
            <p className='text-red-500 text-xs italic'>{emailError}</p>
          )}
          {passwordError && (
            <p className='text-red-500 text-xs italic'>{passwordError}</p>
          )}

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <button
                type='button'
                onClick={() => setShowResetModal(true)}
                className='font-medium text-indigo-600 hover:text-indigo-500'>
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              Sign in
            </button>
          </div>
        </form>

        <div className='text-center'>
          <Link
            to='/register'
            className='font-medium text-indigo-600 hover:text-indigo-500'>
            Don't have an account? Sign up
          </Link>
        </div>
      </div>

      {showResetModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center'>
          <div className='bg-white p-5 rounded-lg shadow-xl w-96'>
            <h2 className='text-2xl font-bold mb-4'>Reset Password</h2>
            <form onSubmit={isSentOtp ? handleReset : sendOtp}>
              <div className='mb-4'>
                <label
                  htmlFor='phone'
                  className='block text-gray-700 text-sm font-bold mb-2'>
                  Phone Number
                </label>
                <div className='relative'>
                  <FaPhoneAlt className='absolute top-3 left-3 text-gray-400' />
                  <input
                    type='tel'
                    id='phone'
                    className='shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    placeholder='Enter your phone number'
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSentOtp}
                  />
                </div>
              </div>
              {!isSentOtp ? (
                <button
                  type='submit'
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                  Send OTP
                </button>
              ) : (
                <div className='space-y-4'>
                  <input
                    type='number'
                    placeholder='Enter OTP'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <input
                    type='password'
                    placeholder='New Password'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    onChange={(e) => setResetPassword(e.target.value)}
                  />
                  <input
                    type='password'
                    placeholder='Confirm Password'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type='submit'
                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                    Reset Password
                  </button>
                </div>
              )}
            </form>
            <button
              onClick={() => {
                setShowResetModal(false);
                setIsSentOtp(false);
              }}
              className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
