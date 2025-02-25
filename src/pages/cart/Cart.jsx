import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaMotorcycle,
  FaTrashAlt,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  deleteCartItemApi,
  getCartApi,
  initializeKhaltiPaymentApi,
} from '../../api/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getCartApi()
      .then((res) => {
        if (res.data.success) {
          setCartItems(res.data.carts || []);
        } else {
          setError('Failed to fetch cart items');
        }
      })
      .catch((err) => {
        setError('Failed to fetch cart items');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.totalPrice, 0)
      .toFixed(2);
  };

  const handlePayment = async (totalPrice) => {
    try {
      const paymentResponse = await initializeKhaltiPaymentApi({
        cartItems: cartItems,
        totalPrice,
        website_url: window.location.origin,
      });
      if (paymentResponse.data.success) {
        const paymentUrl = paymentResponse.data.payment.payment_url;
        window.location.href = paymentUrl;
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(
        'Error processing payment: ' +
          (error.response?.data?.message || error.message || 'Unknown error')
      );
    }
  };

  const handleRemoveFromCart = (itemId) => {
    deleteCartItemApi(itemId)
      .then((res) => {
        if (res.status === 200) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
          toast.success('Item removed from cart successfully');
        } else {
          toast.error('Failed to remove item from cart');
        }
      })
      .catch((err) => {
        toast.error('Failed to remove item from cart');
        console.error(err);
      });
  };

  const CartItemCard = ({ item }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.02 }}
      className='bg-white rounded-lg shadow-lg overflow-hidden mb-6'>
      <div className='md:flex'>
        <div className='md:flex-shrink-0'>
          <img
            className='h-40 w-full object-cover md:w-40'
            src={item.bikePartDetails.imageUrl}
            alt='Bike Part'
          />
        </div>
        <div className='p-8 w-full'>
          <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>
            {item.bikePartDetails.partName}
          </div>
          <div className='mt-2 flex flex-wrap justify-between items-center'>
            <div className='flex items-center text-gray-600 mr-8'>
              <FaCalendarAlt className='mr-2' />
              <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
            </div>
            <div className='flex items-center text-gray-600'>
              <FaClock className='mr-2' />
              <span>{new Date(item.dateAdded).toLocaleTimeString()}</span>
            </div>
          </div>
          <div className='mt-2 flex items-center text-gray-600'>
            <span className='mr-2 font-medium'>Quantity:</span>
            <span>{item.quantity}</span>
          </div>
          <div className='mt-4 flex justify-between items-center'>
            <span className='text-2xl font-bold text-gray-900'>
              Rs {item.totalPrice.toFixed(2)}
            </span>
            <div className='flex items-center'>
              <button
                onClick={() => setSelectedItem(item)}
                className='px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                View Details
              </button>
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className='p-2 text-red-600 hover:text-red-800 focus:outline-none'
                title='Remove from Cart'>
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ItemDetails = ({ item, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center'>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className='bg-white p-8 rounded-lg shadow-xl max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-4'>
          {item.bikePartDetails.partName}
        </h2>
        <img
          className='h-40 w-full object-cover rounded-lg mb-4'
          src={item.bikePartDetails.imageUrl}
          alt='Bike Part'
        />
        <div className='mb-4'>
          <div className='flex items-center mb-2'>
            <FaCalendarAlt className='mr-2 text-indigo-600' />
            <span>Added: {new Date(item.dateAdded).toLocaleDateString()}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaClock className='mr-2 text-indigo-600' />
            <span>Time: {new Date(item.dateAdded).toLocaleTimeString()}</span>
          </div>
          <div className='flex items-center mb-2'>
            <FaMotorcycle className='mr-2 text-indigo-600' />
            <span>Quantity: {item.quantity}</span>
          </div>
          <div className='flex items-center'>
            <FaDollarSign className='mr-2 text-indigo-600' />
            <span className='text-xl font-bold'>
              Rs {item.totalPrice.toFixed(2)}
            </span>
          </div>
          <div className='mt-2 text-sm text-gray-500'>
            <p>Payment Status: {item.isPaymentDone ? 'Paid' : 'Not Paid'}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className='w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
          Close
        </button>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'>
          <strong className='font-bold'>Error!</strong>
          <span className='block sm:inline'> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>
          Your Cart
        </h1>
        <div className='grid grid-cols-1 gap-6'>
          <AnimatePresence>
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
              />
            ))}
          </AnimatePresence>
        </div>
        {selectedItem && (
          <ItemDetails
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
        <div className='mt-8 flex justify-end'>
          <span className='text-2xl font-bold'>
            Total: Rs {calculateTotal()}
          </span>
          <button
            onClick={() => handlePayment(calculateTotal())}
            className='ml-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
