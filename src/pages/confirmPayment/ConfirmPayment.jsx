import React from 'react';

const ConfirmPayment = () => {
  return (
    <div className='tw-bg-gray-100 tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-pt-20'>
      <div className='tw-container tw-mx-auto tw-px-4'>
        <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8'>
          {/* Billing Details Form */}
          <div className='tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-lg'>
            <h2 className='tw-text-2xl tw-font-bold tw-mb-6'>
              Billing Details
            </h2>
            <form>
              <div className='tw-mb-4'>
                <label className='tw-block tw-mb-1 tw-font-semibold'>
                  Full Name
                </label>
                <input
                  type='text'
                  className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded'
                  required
                />
              </div>
              <div className='tw-mb-4'>
                <label className='tw-block tw-mb-1 tw-font-semibold'>
                  Company Name
                </label>
                <input
                  type='text'
                  className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded'
                />
              </div>
              <div className='tw-mb-4'>
                <label className='tw-block tw-mb-1 tw-font-semibold'>
                  Street Address*
                </label>
                <input
                  type='text'
                  className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded'
                  required
                />
              </div>
              <div className='tw-mb-4'>
                <label className='tw-block tw-mb-1 tw-font-semibold'>
                  Apartment, floor, etc. (optional)
                </label>
                <input
                  type='text'
                  className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded'
                />
              </div>
              <div className='tw-mb-4'>
                <label className='tw-block tw-mb-1 tw-font-semibold'>
                  Town/City*
                </label>
                <input
                  type='text'
                  className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded'
                  required
                />
              </div>
              <div className='tw-mb-4'>
                <label className='tw-block tw-mb-1 tw-font-semibold'>
                  Phone Number*
                </label>
                <input
                  type='tel'
                  className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded'
                  required
                />
              </div>
              <div className='tw-mb-4'>
                <label className='tw-block tw-mb-1 tw-font-semibold'>
                  Email Address*
                </label>
                <input
                  type='email'
                  className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded'
                  required
                />
              </div>
              <div className='tw-mb-4'>
                <label className='tw-inline-flex tw-items-center'>
                  <input
                    type='checkbox'
                    className='tw-form-checkbox'
                  />
                  <span className='tw-ml-2'>
                    Save this information for faster check-out next time
                  </span>
                </label>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className='tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-lg'>
            <h2 className='tw-text-2xl tw-font-bold tw-mb-6'>Order Summary</h2>
            <ul className='tw-mb-4'>
              <li className='tw-flex tw-justify-between tw-mb-2'>
                <span>LCD Monitor</span>
                <span>$650</span>
              </li>
              <li className='tw-flex tw-justify-between tw-mb-2'>
                <span>H1 Gamepad</span>
                <span>$100</span>
              </li>
            </ul>
            <div className='tw-flex tw-justify-between tw-font-semibold tw-mb-2'>
              <span>Subtotal</span>
              <span>$750</span>
            </div>
            <div className='tw-flex tw-justify-between tw-font-semibold tw-mb-2'>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className='tw-flex tw-justify-between tw-font-bold tw-text-lg tw-mb-6'>
              <span>Total</span>
              <span>$750</span>
            </div>
            <div className='tw-mb-4'>
              <label className='tw-block tw-mb-1 tw-font-semibold'>
                Payment Method
              </label>
              <div className='tw-flex tw-items-center'>
                <input
                  type='radio'
                  name='payment'
                  className='tw-form-radio tw-mr-2'
                />
                <span className='tw-mr-4'>Bank</span>
                <input
                  type='radio'
                  name='payment'
                  className='tw-form-radio tw-mr-2'
                />
                <span>Cash on delivery</span>
              </div>
            </div>
            <div className='tw-mb-4'>
              <input
                type='text'
                placeholder='Coupon Code'
                className='tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded tw-mb-2'
              />
              <button className='tw-w-full tw-bg-red-500 tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-red-600'>
                Apply Coupon
              </button>
            </div>
            <button className='tw-w-full tw-bg-red-500 tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-red-600'>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
