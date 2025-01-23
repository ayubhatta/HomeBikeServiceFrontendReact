import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleBike, updateBikeApi } from '../../../api/api';

const UpdateBike = () => {
  const { id } = useParams('id');

  const [bikeName, setBikeName] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [bikePrice, setBikePrice] = useState('');
  const [bikeImage, setBikeImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);

  useEffect(() => {
    getSingleBike(id)
      .then((res) => {
        setBikeName(res.data.bike.bikeName);
        setBikeModel(res.data.bike.bikeModel);
        setBikePrice(res.data.bike.bikePrice);
        setOldImage(res.data.bike.bikeImage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBikeImage(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(bikeImage);
    const formData = new FormData();
    formData.append('bikeName', bikeName);
    formData.append('bikeModel', bikeModel);
    formData.append('bikePrice', bikePrice);
    formData.append('bikeImage', bikeImage || oldImage);

    updateBikeApi(id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          window.location.replace('/admin/dashboard/bike');
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
      });
  };

  return (
    <div className='bg-gray-900 text-white min-h-screen'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto py-8'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Update Bike: {bikeName}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <form>
                <div className='mb-4'>
                  <label
                    htmlFor='bikeName'
                    className='block text-sm font-medium'>
                    Bike Name
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter bike name'
                    value={bikeName}
                    onChange={(e) => setBikeName(e.target.value)}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='bikeModel'
                    className='block text-sm font-medium'>
                    Bike Model
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter bike model'
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='bikePrice'
                    className='block text-sm font-medium'>
                    Bike Price
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter bike price'
                    value={bikePrice}
                    onChange={(e) => setBikePrice(e.target.value)}
                  />
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='bikeImage'
                    className='block text-sm font-medium'>
                    Bike Image
                  </label>
                  <input
                    onChange={handleImageChange}
                    type='file'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                  />
                </div>
                <div className='flex justify-end'>
                  <button
                    type='submit'
                    className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    onClick={handleUpdate}>
                    Update Bike
                  </button>
                </div>
              </form>
            </div>
            <div className='flex justify-center'>
              {previewNewImage ? (
                <img
                  src={previewNewImage}
                  className='object-cover rounded-lg w-full h-96'
                  alt='Preview'
                />
              ) : (
                <img
                  src={`http://localhost:5000/bikes/${oldImage}`}
                  className='object-cover rounded-lg w-full h-96'
                  alt='Old Bike'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBike;
