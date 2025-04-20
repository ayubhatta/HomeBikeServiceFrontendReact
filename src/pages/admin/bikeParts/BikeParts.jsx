import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createBikePartsApi,
  deleteBikePartsApi,
  getAllBikePartsApi,
} from '../../../api/api';

const BikePartsDashboard = () => {
  const [bikePartData, setBikeData] = useState({
    partName: '',
    description: '',
    price: '',
    partImage: null,
    quantity: '',
    CompatibleBikesJson: '',
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [bikeParts, setBikeParts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);

  const processBikePartsResponse = (response) => {
    // Create a Map to store unique parts by ID
    const uniquePartsMap = new Map();

    // First level: loop through brands
    response.data.forEach((brandData) => {
      const bikeBrand = brandData.bikeBrand;

      // Second level: loop through models for each brand
      brandData.bikeModels.forEach((modelData) => {
        const bikeModel = modelData.bikeModel;

        // Third level: loop through parts for each model
        modelData.parts.forEach((part) => {
          // If this part ID isn't in our map yet, add it
          if (!uniquePartsMap.has(part.id)) {
            // Format the compatible bikes as an array for display
            const compatibleBikesArray = [];

            // Convert the nested compatibleBikes object to a flat array
            Object.entries(part.compatibleBikes).forEach(([brand, models]) => {
              models.forEach((model) => {
                compatibleBikesArray.push(`${brand} ${model}`);
              });
            });

            uniquePartsMap.set(part.id, {
              ...part,
              _id: part.id, // Map id to _id to match the existing code
              partImage: part.partImageUrl, // Map partImageUrl to partImage
              compatibleBikes: compatibleBikesArray, // Store as array for display
            });
          }
        });
      });
    });

    // Convert the Map values to an array
    return Array.from(uniquePartsMap.values());
  };

  const fetchBikeParts = useCallback(() => {
    setIsTableLoading(true);
    getAllBikePartsApi()
      .then((res) => {
        if (res.status === 200) {
          const uniqueParts = processBikePartsResponse(res.data);
          setBikeParts(uniqueParts);
        }
      })
      .catch((err) => {
        console.error('Error fetching bikeParts:', err);
        toast.error('Failed to fetch bikeParts');
      })
      .finally(() => {
        setIsTableLoading(false);
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
    if (file) {
      setBikeData((prev) => ({ ...prev, partImage: file }));
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, partImage: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!bikePartData.partName.trim())
      newErrors.partName = 'Bike Part Name is required';
    if (!bikePartData.description.trim())
      newErrors.description = 'Bike Part Description is required';
    if (!bikePartData.quantity.trim())
      newErrors.quantity = 'Bike Part Quantity is required';
    if (!bikePartData.price.trim())
      newErrors.price = 'Bike Part Price is required';
    if (!bikePartData.partImage)
      newErrors.partImage = 'Bike Part Image is required';
    if (!bikePartData.CompatibleBikesJson.trim())
      newErrors.CompatibleBikesJson = 'At least one compatible bike is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Parse comma-separated bikes into an array
    const bikesArray = bikePartData.CompatibleBikesJson.split(',')
      .map((bike) => bike.trim())
      .filter((bike) => bike.length > 0);

    if (bikesArray.length === 0) {
      setErrors((prev) => ({
        ...prev,
        CompatibleBikesJson: 'At least one compatible bike is required',
      }));
      return;
    }

    const formData = new FormData();
    // Add all form fields except compatibleBikes
    Object.entries(bikePartData).forEach(([key, value]) => {
      if (key !== 'compatibleBikes') {
        formData.append(key, value);
      }
    });

    // Add each compatible bike as a separate entry
    bikesArray.forEach((bike) => {
      formData.append('compatibleBikes', bike);
    });

    setIsLoading(true);

    createBikePartsApi(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          setIsModalOpen(false);
          fetchBikeParts();
          resetForm();
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      setIsTableLoading(true);
      deleteBikePartsApi(id)
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
          setIsTableLoading(false);
        });
    }
  };

  const resetForm = () => {
    setBikeData({
      partName: '',
      description: '',
      price: '',
      quantity: '',
      partImage: null,
      CompatibleBikesJson: '',
    });
    setPreviewImage(null);
    setErrors({});
  };

  // Handle click outside modal to close
  const handleClickOutside = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className='flex justify-center items-center'>
      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
    </div>
  );

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

      {isTableLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full bg-gray-800 rounded-lg overflow-hidden'>
            <thead>
              <tr className='bg-gray-700'>
                <th className='py-3 px-4 text-left'>Image</th>
                <th className='py-3 px-4 text-left'>Part Name</th>
                <th className='py-3 px-4 text-left'>Description</th>
                <th className='py-3 px-4 text-left'>Price</th>
                <th className='py-3 px-4 text-left'>Quantity</th>
                <th className='py-3 px-4 text-left'>Compatible Bikes</th>
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
                    {bikePart.compatibleBikes &&
                      bikePart.compatibleBikes.join(', ')}
                  </td>
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
              {bikeParts.length === 0 && (
                <tr>
                  <td
                    colSpan='7'
                    className='py-4 text-center text-gray-400'>
                    No bike parts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay'
          onClick={handleClickOutside}>
          <div className='bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-4 overflow-y-auto max-h-screen'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6'>
              Add New Bike Parts
            </h2>
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
                    disabled={isLoading}
                  />
                  {errors[field] && (
                    <p className='text-red-500 text-sm mt-1'>{errors[field]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className='block text-gray-300 mb-1'>
                  Compatible Bikes
                </label>
                <input
                  type='text'
                  name='CompatibleBikesJson'
                  value={bikePartData.CompatibleBikesJson}
                  onChange={handleInputChange}
                  placeholder='Honda, Benelli, Dominar, etc.'
                  className='w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500'
                  disabled={isLoading}
                />
                <p className='text-gray-400 text-xs mt-1'>
                  Enter bike names separated by commas (e.g., Honda, Benelli,
                  Dominar)
                </p>
                {errors.compatibleBikes && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.compatibleBikes}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-gray-300 mb-1'>Image</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500'
                  disabled={isLoading}
                />
                {previewImage && (
                  <div className='mt-2 relative'>
                    <img
                      src={previewImage}
                      alt='Preview'
                      className='rounded max-w-full h-auto object-contain max-h-48'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setPreviewImage(null);
                        setBikeData((prev) => ({ ...prev, partImage: null }));
                      }}
                      className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                      disabled={isLoading}>
                      ×
                    </button>
                  </div>
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
                  className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300'
                  disabled={isLoading}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className={`flex items-center justify-center px-4 py-2 rounded-lg transition duration-300 ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  disabled={isLoading}
                  style={{ minWidth: '120px' }}>
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span className='ml-2'>Adding...</span>
                    </>
                  ) : (
                    'Add Bike Part'
                  )}
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
