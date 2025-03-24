import React, { useState } from 'react';
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMotorcycle,
  FaPhoneAlt,
} from 'react-icons/fa';
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPasswords, setShowResetPasswords] = useState({
    resetPassword: false,
    confirmPassword: false,
  });

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

    setIsLoading(true);
    const data = { email, password };
    loginUserApi(data)
      .then((res) => {
        if (res.data.message === 'Login successful!') {
          toast.success(res.data.message);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (resetPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const data = { phone, otp, newPassword: resetPassword };
    resetPasswordApi(data)
      .then((res) => {
        toast.success(res.data.message);
        setShowResetModal(false);
        setIsSentOtp(false);
      })
      .catch((err) => {
        toast.error(err.response?.data.message || 'Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const sendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.trim() === '') {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    forgotPasswordApi({ phone })
      .then((res) => {
        toast.success(res.data.message);
        setIsSentOtp(true);
      })
      .catch((err) => {
        toast.error(err.response?.data.message || 'Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleResetPassword = (field) => {
    setShowResetPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl transform transition-all duration-300'>
        <div>
          <FaMotorcycle className='mx-auto h-12 w-auto text-blue-600' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Welcome to Ride Revive
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Your one-stop solution for bike home servicing
          </p>
          <div className='mt-4 flex justify-center'>
            <div className='h-1 w-16 bg-blue-500 rounded'></div>
          </div>
        </div>
        <form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}>
          <div className='space-y-4'>
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
                  className={`appearance-none rounded-lg relative block w-full px-4 py-3 pl-10 border ${
                    emailError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200`}
                  placeholder='Email address'
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                />
                {emailError && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {emailError}
                  </p>
                )}
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`appearance-none rounded-lg relative block w-full px-4 py-3 pl-10 pr-10 border ${
                    passwordError
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200`}
                  placeholder='Password'
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={toggleShowPassword}>
                  {showPassword ? (
                    <FaEyeSlash className='h-5 w-5 text-gray-400' />
                  ) : (
                    <FaEye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
                {passwordError && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {passwordError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
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
                className='font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out'>
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed'>
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                {isLoading ? (
                  <svg
                    className='animate-spin h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
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
                ) : (
                  <FaLock className='h-5 w-5 text-blue-400 group-hover:text-blue-300' />
                )}
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className='text-center mt-4'>
          <Link
            to='/register'
            className='font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out flex justify-center items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
            Don't have an account? Sign up
          </Link>
        </div>
      </div>

      {showResetModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
          <div className='bg-white p-8 rounded-xl shadow-2xl w-96 max-w-md transition-all transform duration-300'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Reset Password
              </h2>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setIsSentOtp(false);
                }}
                className='text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={isSentOtp ? handleReset : sendOtp}
              className='space-y-6'>
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
                    className='appearance-none rounded-lg relative block w-full px-4 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    placeholder='Enter your phone number'
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSentOtp}
                  />
                </div>
              </div>

              {!isSentOtp ? (
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out'>
                  {isLoading ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
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
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              ) : (
                <div className='space-y-4'>
                  <div>
                    <label
                      htmlFor='otp'
                      className='block text-gray-700 text-sm font-bold mb-2'>
                      OTP
                    </label>
                    <input
                      type='number'
                      id='otp'
                      placeholder='Enter OTP'
                      className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='newPassword'
                      className='block text-gray-700 text-sm font-bold mb-2'>
                      New Password
                    </label>
                    <div className='relative'>
                      <input
                        type={
                          showResetPasswords.resetPassword ? 'text' : 'password'
                        }
                        id='newPassword'
                        placeholder='New Password'
                        className='appearance-none rounded-lg relative block w-full px-4 py-3 pr-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                        onChange={(e) => setResetPassword(e.target.value)}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() => toggleResetPassword('resetPassword')}>
                        {showResetPasswords.resetPassword ? (
                          <FaEyeSlash className='h-5 w-5 text-gray-400' />
                        ) : (
                          <FaEye className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='confirmPassword'
                      className='block text-gray-700 text-sm font-bold mb-2'>
                      Confirm Password
                    </label>
                    <div className='relative'>
                      <input
                        type={
                          showResetPasswords.confirmPassword
                            ? 'text'
                            : 'password'
                        }
                        id='confirmPassword'
                        placeholder='Confirm Password'
                        className='appearance-none rounded-lg relative block w-full px-4 py-3 pr-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() => toggleResetPassword('confirmPassword')}>
                        {showResetPasswords.confirmPassword ? (
                          <FaEyeSlash className='h-5 w-5 text-gray-400' />
                        ) : (
                          <FaEye className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out'>
                    {isLoading ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
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
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              )}
            </form>

            <div className='mt-6'>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setIsSentOtp(false);
                }}
                className='w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
