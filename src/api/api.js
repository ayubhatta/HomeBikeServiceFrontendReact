import axios from 'axios';
//const baseURL = 'http://192.168.1.69:4056';
const baseURL = 'https://api-rj9q.onrender.com';
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
export const registerUserApi = (data) => 
  Api.post('/api/user/register', data);

// Login API
export const loginUserApi = (data) => 
  Api.post('/api/user/login', data);

// Forgot Password API
export const forgotPasswordApi = (data) =>
  Api.post('/api/user/forgot_password', data);

// Reset Password API
export const resetPasswordApi = (data) =>
  Api.post(`/api/user/changepassword/${userID}`, data);

export const changePasswordApi = (data) =>
  Api.post(`/api/user/changepassword/${userID}`, data);

// Update Profile API
export const updateProfileApi = (data) =>
  Api.put(`/api/user/updateprofile/${userID}`, data);

// Get current user API
export const getCurrentUserApi = () => Api.get(`/api/user/${userID}`, config);

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
export const getAllBikeApi = () => 
  Api.get('/api/bikeProducts/all', config);

// get bike model
export const getBikeByModel = (bikeName) =>
  Api.get(`api/bikeProducts/bikeName/${bikeName}`, config);

// get single bike api
export const getSingleBike = (id) => 
  Api.get(`api/bikeProducts/${id}`, config);

// delete bike api
export const deleteBikeApi = (id) =>
  Api.delete(`api/bikeProducts/${id}`, config);

// update bike api
export const updateBikeApi = (id, data) =>
  FileApi.put(`api/bikeProducts/${id}`, data, config);

// =============================== Bike Parts API ===========================================
export const createBikePartsApi = (data) =>
  FileApi.post('/api/bikeParts/create', data);

export const getAllBikePartsApi = () => 
  Api.get('/api/bikeParts', config);

export const updateBikePartsApi = (id, data) =>
  FileApi.put(`/api/bikeParts/${id}`, data, config);

export const getSingleBikeParts = (id) =>
  Api.get(`/api/bikeParts/${id}`, config);

// delete bike api
export const deleteBikePartsApi = (id) =>
  Api.delete(`api/bikeParts/${id}`, config);


// ================================ Cart Api =============
export const addToCartApi = (data) => 
  Api.post('/api/cart/add', data, config);

export const getCartApi = () => 
  Api.get('/api/cart/user', config);

export const deleteCartApi = (userId = userID) =>
  Api.delete(`/api/cart/delete/${userId}`, config);

export const deleteCartItemApi = (cartid) => {
  return Api.delete(`/api/cart/${cartid}`, config);
};

export const updateCartApi = (cartid, data) =>
  Api.put(`/api/cart/${cartid}`, data, config);

export const createOrderApi = (data) => 
  Api.put(`/api/cart/pay`, data, config);

// =============================== Bookings API ===========================================

// Add to Boking API
export const addToBookingApi = (data) =>
  Api.post('/api/booking/add', data, config);

// Display Booking
export const getAllBookingApi = () => 
  Api.get('/api/booking/getall', config);

// Delete Booking
export const deleteBookingApi = (id) => 
  Api.delete(`/api/booking/delete/${id}`);

// User Booking
export const userBookingApi = (userID) =>
  Api.get(`/api/booking/getall/${userID}`, config);

export const cancelBookingApi = (id) => {
  return Api.post(`/api/booking/cancel/${id}`, config);
};

// ============================= Admin Panel ===========================================

export const getDashboardStats = () =>
  Api.get('/api/dashboard/total-counts', config);

// ================================ Feedback API ==============================

export const sendFeedbackApi = (data) =>
  Api.post('/api/feedback/add', data, config);

export const getFeedbackApi = () => Api.get('/api/feedback/all', config);

// =================== Payment ======================
export const initializeKhaltiPaymentApi = (data) =>
  Api.post('/api/payment/makepayment', data, jsonConfig);

// ===================== Mechanic API ========================
export const getAllMechanicsApi = () => Api.get('/api/mechanics', config);

export const createMechanicApi = (data) =>
  FileApi.post('/api/mechanic/create', data, config);

export const updateMechanicApi = (id, data) =>
  FileApi.put(`/api/mechanic/update/${id}`, data, config);

export const deleteMechanicApi = (id) =>
  Api.delete(`/api/mechanic/delete/${id}`, config);

export const getMechanicByIdApi = (id) =>
  Api.get(`/api/mechanics/${id}`, config);

export const getAssignedBookingMechanicApi = () =>
  Api.get(`/api/mechanics/assigned/${userID}`, config);

export const assignMechanicToBookingApi = (id, data) =>
  Api.put(`/api/mechanics/${id}`, data, config);

export const updateBookingStatusApi = (data) => {
  return Api.put(`/api/mechanics/update-status/${userID}`, data, config);
};

export const updateBookingStatusToCompletedApi = (data) => {
  return Api.put(`/api/mechanics/mark-complete/${userID}`, data, config);
};

export const updateMechanicProfileApi = (id, data) =>
  Api.put(`/api/mechanics/updateprofile/${id}`, data, config);

export const getMechanicProfileApi = () =>
  Api.get(`/api/mechanics/${userID}`, config);
