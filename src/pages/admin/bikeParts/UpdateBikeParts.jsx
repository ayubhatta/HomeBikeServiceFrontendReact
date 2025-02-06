import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleBikeParts, updateBikePartsApi } from '../../../api/api';

const UpdateBikeParts = () => {
  const { id } = useParams('id');

  const [bikeName, setBikePartsName] = useState('');
  const [bikeModel, setBikePartsModel] = useState('');
  const [bikePrice, setBikePartsPrice] = useState('');
  const [bikeImage, setBikePartsImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);

  useEffect(() => {
    getSingleBikeParts(id)
      .then((res) => {
        setBikePartsName(res.data.bikeParts.bikeName);
        setBikePartsModel(res.data.bikeParts.bikeModel);
        setBikePartsPrice(res.data.bikeParts.bikePrice);
        setOldImage(res.data.bikeParts.bikeImage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBikePartsImage(file);
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

    updateBikePartsApi(id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          window.location.replace('/admin/dashboard/bikeParts');
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
            Update BikeParts: {bikeName}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <form>
                <div className='mb-4'>
                  <label
                    htmlFor='bikeName'
                    className='block text-sm font-medium'>
                    BikeParts Name
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter bikeParts name'
                    value={bikeName}
                    onChange={(e) => setBikePartsName(e.target.value)}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='bikeModel'
                    className='block text-sm font-medium'>
                    BikeParts Model
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter bikeParts model'
                    value={bikeModel}
                    onChange={(e) => setBikePartsModel(e.target.value)}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='bikePrice'
                    className='block text-sm font-medium'>
                    BikeParts Price
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300 px-3 py-2'
                    placeholder='Enter bikeParts price'
                    value={bikePrice}
                    onChange={(e) => setBikePartsPrice(e.target.value)}
                  />
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='bikeImage'
                    className='block text-sm font-medium'>
                    BikeParts Image
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
                    Update BikeParts
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
                  alt='Old BikeParts'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBikeParts;
