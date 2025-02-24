import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToBookingApi, getSingleBike, userID } from '../../api/api';

const ConfirmBooking = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    bikeName: '',
    bikeChasisNumber: '',
    bookingDate: '',
    bookingTime: '',
    bikeDescription: '',
    bikeNumber: '',
    bookingAddress: '',
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const params = useParams();

  useEffect(() => {
    getSingleBike(params.id)
      .then((res) => {
        setFormData((prevData) => ({
          ...prevData,
          bikeName: `${res.data.bike.bikeName} ${res.data.bike.bikeModel}`,
        }));
        setTotal(res.data.bike.bikePrice);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch bike details');
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = (e) => {
    console.log(userID);
    e.preventDefault();
    const extraCharge = 200;

    const data = {
      ...formData,
      userId: userID,
      bikeId: params.id,
      total: total + extraCharge,
    };

    setLoading(true);
    addToBookingApi(data)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            toast.success(res.data.message);
            window.location.href = '/user/booking';
          } else if (res.data.success === false) {
            toast.error(res.data.message);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Something went wrong');
        }
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-extrabold text-center text-gray-900 mb-8'>
          Fill this form to confirm your booking
        </h1>
        <div className='bg-white shadow-2xl rounded-lg overflow-hidden'>
          <div className='p-8'>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className='block text-sm font-medium text-gray-700 mb-1'>
                      {key.charAt(0).toUpperCase() +
                        key
                          .slice(1)
                          .replace(/([A-Z])/g, ' $1')
                          .trim()}
                    </label>
                    <input
                      type={
                        key === 'bookingDate'
                          ? 'date'
                          : key === 'bookingTime'
                          ? 'time'
                          : 'text'
                      }
                      name={key}
                      id={key}
                      value={value}
                      onChange={handleInputChange}
                      disabled={key === 'bikeName'}
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                      required
                    />
                  </div>
                ))}
              </div>

              <div className='flex items-center'>
                <input
                  id='terms'
                  name='terms'
                  type='checkbox'
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='terms'
                  className='ml-2 block text-sm text-gray-900'>
                  I agree to the{' '}
                  <a
                    href='#'
                    className='font-medium text-blue-600 hover:text-blue-500'>
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div>
                <button
                  type='submit'
                  disabled={!isChecked || loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isChecked && !loading
                      ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}>
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>

          <div className='bg-gray-50 px-4 py-5 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Booking Summary
            </h3>
            <div className='mt-2 flex justify-between'>
              <p className='text-sm text-gray-500'>Bike Price:</p>
              <p className='text-sm font-semibold text-gray-900'>${total}</p>
            </div>
            <div className='mt-1 flex justify-between'>
              <p className='text-sm text-gray-500'>Extra Charge:</p>
              <p className='text-sm font-semibold text-gray-900'>$200</p>
            </div>
            <div className='mt-4 flex justify-between border-t border-gray-200 pt-4'>
              <p className='text-base font-medium text-gray-900'>Total:</p>
              <p className='text-base font-bold text-blue-600'>
                ${total + 200}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
