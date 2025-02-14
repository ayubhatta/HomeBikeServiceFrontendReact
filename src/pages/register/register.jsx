import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../api/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    const { fullName, email, phoneNumber, password, confirmPassword } =
      formData;

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword)
      newErrors.confirmPassword = 'Confirm Password is required';
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await registerUserApi(formData);
        if (response.data.success) {
          toast.success(response.data.message);
          window.location.href = '/login';
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Join us and start your journey
          </p>
        </div>
        <form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}>
          <div className='rounded-md shadow-sm -space-y-px'>
            {[
              'fullName',
              'email',
              'phoneNumber',
              'password',
              'confirmPassword',
            ].map((field, index) => (
              <div
                key={field}
                className='mb-4'>
                <label
                  htmlFor={field}
                  className='sr-only'>
                  {field.charAt(0).toUpperCase() +
                    field
                      .slice(1)
                      .replace(/([A-Z])/g, ' $1')
                      .trim()}
                </label>
                <input
                  id={field}
                  name={field}
                  type={
                    field.includes('password')
                      ? 'password'
                      : field === 'email'
                      ? 'email'
                      : 'text'
                  }
                  autoComplete={
                    field === 'email'
                      ? 'email'
                      : field.includes('password')
                      ? 'new-password'
                      : ''
                  }
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                    errors[field] ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder={
                    field.charAt(0).toUpperCase() +
                    field
                      .slice(1)
                      .replace(/([A-Z])/g, ' $1')
                      .trim()
                  }
                  onChange={handleChange}
                  value={formData[field]}
                />
                {errors[field] && (
                  <p className='text-red-500 text-xs italic mt-1'>
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105'>
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg
                  className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
              Sign up
            </button>
          </div>
        </form>
        <div className='text-center'>
          <Link
            to='/login'
            className='font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out'>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
