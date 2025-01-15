import axios from 'axios';
const baseURL = 'https://192.168.1.195:7080';
// const baseURL = 'http://localhost:7080';
// Creating backend config
const Api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const FileApi = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};
const jsonConfig = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};
const user = JSON.parse(localStorage.getItem('user'));

export const userID = user?.id || '';
// Create API
export const registerUserApi = (data) => Api.post('/api/user/register', data);

// Login API
export const loginUserApi = (data) => Api.post('/api/user/login', data);

// Forgot Password API
export const forgotPasswordApi = (data) =>
  Api.post('/api/user/forgot_password', data);

// Reset Password API
export const resetPasswordApi = (data) =>
  Api.post('/api/user/reset_password', data);

// Update Profile API
export const updateProfileApi = (data) =>
  Api.put('/api/user/update_profile', data, config);

// Get current user API
export const getCurrentUserApi = (id) =>
  Api.get(`/api/user/current_profile`, config);

// Get all users API
export const getAllUsersApi = () => Api.get('/api/user', config);

// Update Role to Mechanic

export const updateRoleToMechanicApi = (id) =>
  Api.put(`/api/user/updateuserroletomechanic/${id}`, config);

// =============================== BIKE API ===========================================
// create bike API
export const createBikeApi = (data) =>
  FileApi.post('/api/bikeProducts/create', data, config);

// get all bike API
export const getAllBikeApi = () => Api.get('/api/bikeProducts/all', config);

// get bike model
export const getBikeByModel = (bikeName) =>
  Api.get(`api/bikeProducts/bikeName/${bikeName}`, config);

// get single bike api
export const getSingleBike = (id) => Api.get(`api/bikeProducts/${id}`, config);

// delete bike api
export const deleteBikeApi = (id) =>
  Api.delete(`api/bike/delete_bike/${id}`, config);

// update bike api
export const updateBikeApi = (id, data) =>
  Api.put(`api/bike/update_bike/${id}`, data, config);

// pagination
export const paginationApi = (page, limit) =>
  Api.get(`/api/bike/pagination?page=${page}&limit=${limit}`, config);

//
export const bikeCount = () => {
  return Api.get(`/api/bike/bike_count`, config);
};
