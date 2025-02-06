import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createBikePartsApi,
  deleteBikeApi,
  getAllBikePartsApi,
} from '../../../api/api';

const BikePartsDashboard = () => {
  const [bikePartData, setBikeData] = useState({
    partName: '',
    description: '',
    price: '',
    partImage: null,
    quantity: '',
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [bikeParts, setBikeParts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBikeParts = useCallback(() => {
    getAllBikePartsApi()
      .then((res) => {
        if (res.status === 200) {
          setBikeParts(res.data.bikeParts);
        }
      })
      .catch((err) => {
        console.error('Error fetching bikeParts:', err);
        toast.error('Failed to fetch bikeParts');
      });
  }, []);

  useEffect(() => {
    fetchBikeParts();
  }, [fetchBikeParts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBikeData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBikeData((prev) => ({ ...prev, partImage: file }));
    setPreviewImage(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, partImage: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!bikePartData.partName.trim())
      newErrors.partName = 'Bike Part Part Name is required';
    if (!bikePartData.description.trim())
      newErrors.description = 'Bike Part Description is required';
    if (!bikePartData.quantity.trim())
      newErrors.description = 'Bike Part Quantity is required';
    if (!bikePartData.quantity.trim())
      newErrors.price = 'Bike Part Price is required';
    if (!bikePartData.partImage)
      newErrors.partImage = 'Bike Part Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    // if (!validate()) return;
    console.log('bikePartData', bikePartData);

    const formData = new FormData();
    Object.entries(bikePartData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    console.log('formData', formData);

    createBikePartsApi(formData)
      .then((res) => {
        console.log('bikePartData', bikePartData);

        if (res.status === 201) {
          toast.success(res.data.message);
          // setIsModalOpen(false);
          // fetchBikeParts();
          // resetForm();
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
            fetchBikeParts();
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
      bikePartName: '',
      bikePartModel: '',
      bikePartPrice: '',
      partImage: null,
    });
    setPreviewImage(null);
    setErrors({});
  };

  return (
    <div className='tw-ml-0 lg:tw-ml-64 min-h-screen bg-gray-900 text-white tw-relative p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>BikeParts Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300'>
          Add Bike Parts
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full bg-gray-800 rounded-lg overflow-hidden'>
          <thead>
            <tr className='bg-gray-700'>
              <th className='py-3 px-4 text-left'>Image</th>
              <th className='py-3 px-4 text-left'>Part Name</th>
              <th className='py-3 px-4 text-left'>Description</th>
              <th className='py-3 px-4 text-left'>Price</th>
              <th className='py-3 px-4 text-left'>Quantity</th>
              <th className='py-3 px-4 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikeParts.map((bikePart) => (
              <tr
                key={bikePart._id}
                className='border-t border-gray-700 hover:bg-gray-750 transition duration-200'>
                <td className='py-3 px-4'>
                  <img
                    src={bikePart.partImage}
                    alt={bikePart.partName}
                    className='w-16 h-16 object-cover rounded'
                  />
                </td>
                <td className='py-3 px-4'>{bikePart.partName}</td>
                <td className='py-3 px-4'>{bikePart.description}</td>
                <td className='py-3 px-4'>{bikePart.price}</td>

                <td className='py-3 px-4'>{bikePart.quantity}</td>

                <td className='py-3 px-4'>
                  <Link
                    to={`/admin/updatebikePart/${bikePart._id}`}
                    className='bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2 transition duration-300'>
                    Edit
                  </Link>
                  <button
                    type='button'
                    className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300'
                    onClick={() => handleDelete(bikePart._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md'>
            <h2 className='text-2xl font-semibold mb-6'>Add New Bike Parts</h2>
            <form
              onSubmit={handleSubmit}
              className='space-y-4'>
              {['partName', 'price', 'description', 'quantity'].map((field) => (
                <div key={field}>
                  <label className='block text-gray-300 mb-1 capitalize'>
                    {field.replace('bikePart', '')}
                  </label>
                  <input
                    type={
                      field === 'price' || field === 'quantity'
                        ? 'number'
                        : 'text'
                    }
                    name={field}
                    value={bikePartData[field]}
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
                  onChange={handleImageChange}
                  className='w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500'
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt='Preview'
                    className='mt-2 rounded max-w-full h-auto'
                  />
                )}
                {errors.partImage && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.partImage}
                  </p>
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
                  Add Bike Part Parts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikePartsDashboard;
