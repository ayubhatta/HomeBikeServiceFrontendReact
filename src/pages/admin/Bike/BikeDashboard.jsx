import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBikeApi, deleteBikeApi, getAllBikeApi } from '../../../api/api';

const BikeDashboard = () => {
  const [bikeData, setBikeData] = useState({
    bikeName: '',
    bikeModel: '',
    bikePrice: '',
    bikeImage: null,
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [bikes, setBikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBikes = useCallback(() => {
    getAllBikeApi()
      .then((res) => {
        if (res.status === 200) {
          setBikes(res.data.bikes);
        }
      })
      .catch((err) => {
        console.error('Error fetching bikes:', err);
        toast.error('Failed to fetch bikes');
      });
  }, []);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBikeData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBikeData((prev) => ({ ...prev, bikeImage: file }));
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, bikeImage: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!bikeData.bikeName.trim()) newErrors.bikeName = 'Bike Name is required';
    if (!bikeData.bikeModel.trim())
      newErrors.bikeModel = 'Bike Model is required';
    if (!bikeData.bikePrice.trim())
      newErrors.bikePrice = 'Bike Price is required';
    if (!bikeData.bikeImage) newErrors.bikeImage = 'Bike Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(bikeData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    createBikeApi(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          setIsModalOpen(false);
          fetchBikes();
          resetForm();
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      deleteBikeApi(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            fetchBikes();
          }
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message || 'Something went wrong';
          toast.error(errorMessage);
        });
    }
  };

  const resetForm = () => {
    setBikeData({
      bikeName: '',
      bikeModel: '',
      bikePrice: '',
      bikeImage: null,
    });
    setPreviewImage(null);
    setErrors({});
  };

  return (
    <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Bikes Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300'>
          Add Bike
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full bg-gray-800 rounded-lg overflow-hidden'>
          <thead>
            <tr className='bg-gray-700'>
              <th className='py-3 px-4 text-left'>Image</th>
              <th className='py-3 px-4 text-left'>Bike Name</th>
              <th className='py-3 px-4 text-left'>Bike Model</th>
              <th className='py-3 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr
                key={bike._id}
                className='border-t border-gray-700 hover:bg-gray-750 transition duration-200'>
                <td className='py-3 px-4'>
                  <img
                    src={bike.bikeImageUrl}
                    alt={bike.bikeName}
                    className='w-16 h-16 object-cover rounded'
                  />
                </td>
                <td className='py-3 px-4'>{bike.bikeName}</td>
                <td className='py-3 px-4'>{bike.bikeModel}</td>
                <td className='py-3 px-4'>
                  <Link
                    to={`/admin/updatebike/${bike.id}`}
                    className='bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2 transition duration-300'>
                    Edit
                  </Link>
                  <button
                    type='button'
                    className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300'
                    onClick={() => handleDelete(bike.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md overflow-auto max-h-[90vh]'>
            <h2 className='text-2xl font-semibold mb-6'>Add New Bike</h2>
            <form
              onSubmit={handleSubmit}
              className='space-y-4'>
              {['bikeName', 'bikeModel', 'bikePrice'].map((field) => (
                <div key={field}>
                  <label className='block text-gray-300 mb-1 capitalize'>
                    {field.replace('bike', '')}
                  </label>
                  <input
                    type={field === 'bikePrice' ? 'number' : 'text'}
                    name={field}
                    value={bikeData[field]}
                    onChange={handleInputChange}
                    className='w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500'
                  />
                  {errors[field] && (
                    <p className='text-red-500 text-sm mt-1'>{errors[field]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className='block text-gray-300 mb-1'>Image</label>
                <input
                  type='file'
                  accept="image/*"
                  onChange={handleImageChange}
                  className='w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500'
                />
                {errors.bikeImage && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.bikeImage}
                  </p>
                )}
                {previewImage && (
                  <div className="mt-3 relative">
                    <div className="relative w-full aspect-video bg-gray-700 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setBikeData(prev => ({ ...prev, bikeImage: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className='flex justify-end space-x-2 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300'>
                  Add Bike
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeDashboard;