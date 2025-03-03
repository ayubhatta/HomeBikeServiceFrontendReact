import axios from 'axios';
//const baseURL = 'https://192.168.1.195:7080';
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
  FileApi.put(`api/bikeProducts/${id}`, data, config);

// pagination
export const paginationApi = (page, limit) =>
  Api.get(`/api/bike/pagination?page=${page}&limit=${limit}`, config);

//
export const bikeCount = () => {
  return Api.get(`/api/bike/bike_count`, config);
};
// =============================== Bike Parts API ===========================================
export const createBikePartsApi = (data) =>
  FileApi.post('/api/bikeParts/create', data);

export const getAllBikePartsApi = () => Api.get('/api/bikeParts', config);

export const updateBikePartsApi = (id, data) =>
  FileApi.put(`/api/bikeParts/${id}`, data, config);

// ================================ Cart Api =============
export const addToCartApi = (data) => Api.post('/api/cart/add', data, config);

export const getCartApi = () => Api.get('/api/cart/user', config);

export const deleteCartApi = (userId = userID) =>
  Api.delete(`/api/cart/delete/${userId}`, config);

export const deleteCartItemApi = (cartid) => {
  return Api.delete(`/api/cart/${cartid}`, config);
};

export const updateCartApi = (cartid, data) =>
  Api.put(`/api/cart/${cartid}`, data, config);

// =============================== Bookings API ===========================================

// Add to Boking API
export const addToBookingApi = (data) =>
  Api.post('/api/booking/add', data, config);

// Display Booking
export const getAllBookingApi = () => Api.get('/api/booking/getall', config);

// Delete Booking
export const deleteBookingApi = (id) => Api.delete(`/api/booking/delete/${id}`);

// User Booking
export const userBookingApi = (userID) =>
  Api.get(`/api/booking/getall/${userID}`, config);

export const cancelBookingApi = (id) => {
  return Api.post(`/api/booking/cancel/${id}`, config);
};

// ============================= Admin Panel ===========================================

export const getDashboardStats = () =>
  Api.get('/api/admin/dashboard_stats', config);

// ================================= Message API ===========================================
export const sendMessageApi = (message) =>
  Api.post('/api/messages/send', message, config);
export const getMessagesApi = (id, page) =>
  Api.get(`/api/messages/get/${id}?page=${page}`, config);

export const getByIdApi = (id) =>
  Api.get(`/api/messages/get_by_id/${id}`, config);

export const updateMessageApi = (id, message) =>
  Api.put(`/api/messages/update/${id}`, message, config);

export const deleteMessageApi = (id) =>
  Api.delete(`/api/messages/delete/${id}`, config);

export const getChatListApi = () => Api.get(`/api/messages/get`, config);

export const sendFileApi = (data, config) =>
  Api.post(`/api/messages/send/file`, data, config);

// ================================== Message File ==========================
export const messageFileUrl = 'http://localhost:5000/messages/files';
export const messageImageUrl = 'http://localhost:5000/messages/images';

// =============================== Notification =========================
export const getNotificationApi = () =>
  Api.get(`/api/notifications/get`, config);

export const readNotificationApi = (id) =>
  Api.put(`/api/notifications/read/${id}`, config);

// ================================ send notification =======================
export const sendNotificationApi = (data) =>
  Api.post(`/api/notifications/send`, data, jsonConfig);

// ================================ Feedback API ==============================

export const sendFeedbackApi = (data) =>
  Api.post('/api/feedback/postFeedback', data, config);

export const getFeedbackApi = () => Api.get('/api/feedback/all', config);
// =================== Payment ======================
export const initializeKhaltiPaymentApi = (data) =>
  Api.post('/api/payment/initialize_khalti', data, jsonConfig);

// ===================== Mechanic API ========================
export const getAllMechanicsApi = () => Api.get('/api/mechanic/all', config);

export const createMechanicApi = (data) =>
  FileApi.post('/api/mechanic/create', data, config);

export const updateMechanicApi = (id, data) =>
  FileApi.put(`/api/mechanic/update/${id}`, data, config);

export const deleteMechanicApi = (id) =>
  Api.delete(`/api/mechanic/delete/${id}`, config);

export const getMechanicByIdApi = (id) =>
  Api.get(`/api/mechanic/${id}`, config);

export const getAssignedBookingMechanicApi = (id) =>
  Api.get(`/api/mechanic/assigned/${id}`, config);

export const assignMechamnicToBookingApi = (id) =>
  Api.put(`/api/mechanic/${id}`, config);
