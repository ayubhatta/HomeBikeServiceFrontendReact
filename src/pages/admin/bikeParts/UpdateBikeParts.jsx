import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleBikeParts, updateBikePartsApi } from '../../../api/api';

const UpdateBikeParts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bikePartData, setBikePartData] = useState({
    partName: '',
    description: '',
    price: '',
    quantity: '',
    CompatibleBikesJson: '',
  });
  const [partImage, setPartImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getSingleBikeParts(id)
      .then((res) => {
        const part = res.data.bikePart;

        setBikePartData({
          partName: part.partName || '',
          description: part.description || '',
          price: part.price?.toString() || '',
          quantity: part.quantity?.toString() || '',
          // Handle the compatibleBikes as a JSON string
          CompatibleBikesJson:
            typeof part.compatibleBikes === 'object'
              ? JSON.stringify(part.compatibleBikes)
              : '{}',
        });

        setOldImage(part.partImage || part.partImageUrl);
      })
      .catch((err) => {
        console.error('Error fetching bike part:', err);
        toast.error('Failed to load bike part details');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBikePartData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPartImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, partImage: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Always ensure we're working with strings before using trim()
    if (!String(bikePartData.partName || '').trim())
      newErrors.partName = 'Bike Part Name is required';
    if (!String(bikePartData.description || '').trim())
      newErrors.description = 'Bike Part Description is required';
    if (!String(bikePartData.quantity || '').trim())
      newErrors.quantity = 'Bike Part Quantity is required';
    if (!String(bikePartData.price || '').trim())
      newErrors.price = 'Bike Part Price is required';

    // Validate the JSON structure
    let compatibleBikes;
    try {
      compatibleBikes = JSON.parse(bikePartData.CompatibleBikesJson);

      // Check if at least one brand with at least one model exists
      const hasBikesWithModels = Object.entries(compatibleBikes).some(
        ([brand, models]) => brand && Array.isArray(models) && models.length > 0
      );

      if (!hasBikesWithModels) {
        newErrors.CompatibleBikesJson =
          'At least one brand with one model is required';
      }
    } catch (error) {
      newErrors.CompatibleBikesJson =
        'Invalid JSON format. Please use the format: {"Brand": ["Model1", "Model2"]}';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('partName', bikePartData.partName);
    formData.append('description', bikePartData.description);
    formData.append('price', bikePartData.price);
    formData.append('quantity', bikePartData.quantity);

    // Only append new image if selected
    if (partImage) {
      formData.append('partImage', partImage);
    }

    // Add the compatible bikes as a JSON string
    formData.append('CompatibleBikesJson', bikePartData.CompatibleBikesJson);

    updateBikePartsApi(id, formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate('/admin/parts');
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className='flex justify-center items-center'>
      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
    </div>
  );

  if (isLoading && !bikePartData.partName) {
    return (
      <div className='bg-gray-900 text-white min-h-screen flex justify-center items-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='bg-gray-900 text-white min-h-screen'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto py-8'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Update Bike Part: {bikePartData.partName}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <form onSubmit={handleUpdate}>
                <div className='mb-4'>
                  <label
                    htmlFor='partName'
                    className='block text-sm font-medium'>
                    Part Name
                  </label>
                  <input
                    type='text'
                    name='partName'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter part name'
                    value={bikePartData.partName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {errors.partName && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.partName}
                    </p>
                  )}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter part description'
                    value={bikePartData.description}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='price'
                    className='block text-sm font-medium'>
                    Price
                  </label>
                  <input
                    type='number'
                    name='price'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter price'
                    value={bikePartData.price}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {errors.price && (
                    <p className='text-red-500 text-sm mt-1'>{errors.price}</p>
                  )}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='quantity'
                    className='block text-sm font-medium'>
                    Quantity
                  </label>
                  <input
                    type='number'
                    name='quantity'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter quantity'
                    value={bikePartData.quantity}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {errors.quantity && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.quantity}
                    </p>
                  )}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='CompatibleBikesJson'
                    className='block text-sm font-medium'>
                    Compatible Bikes (JSON format)
                  </label>
                  <textarea
                    name='CompatibleBikesJson'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='{"Benelli": ["TNT 300", "TNT 150i"], "Honda": ["CBR 600rr"]}'
                    value={bikePartData.CompatibleBikesJson}
                    onChange={handleInputChange}
                    rows={4}
                    disabled={isLoading}
                  />
                  <p className='text-gray-400 text-xs mt-1'>
                    Enter bike brands and models in JSON format: {'{'}"Brand":
                    ["Model1", "Model2"], "Brand2": ["Model3"]{'}'}
                  </p>
                  {errors.CompatibleBikesJson && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.CompatibleBikesJson}
                    </p>
                  )}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='partImage'
                    className='block text-sm font-medium'>
                    Part Image
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    disabled={isLoading}
                  />
                  <p className='text-gray-400 text-xs mt-1'>
                    Leave empty to keep the current image
                  </p>
                </div>

                <div className='flex justify-end'>
                  <button
                    type='submit'
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm transition-colors duration-200 ${
                      isLoading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                    disabled={isLoading}
                    style={{ minWidth: '150px' }}>
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        <span className='ml-2'>Updating...</span>
                      </>
                    ) : (
                      'Update Part'
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className='flex justify-center'>
              {previewImage ? (
                <img
                  src={previewImage}
                  className='object-cover rounded-lg w-full h-96'
                  alt='Preview'
                />
              ) : oldImage ? (
                <img
                  src={
                    oldImage.startsWith('http')
                      ? oldImage
                      : `http://localhost:5000/bikes/${oldImage}`
                  }
                  className='object-cover rounded-lg w-full h-96'
                  alt='Current Part'
                />
              ) : (
                <div className='flex items-center justify-center w-full h-96 bg-gray-800 rounded-lg'>
                  <p className='text-gray-400'>No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBikeParts;
