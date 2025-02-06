import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BarChat from './components/BarChart';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AboutUs from './pages/aboutUs/AboutUs';
import BikeDashboard from './pages/admin/Bike/BikeDashboard';
import UpdateBike from './pages/admin/Bike/UpdateBike';
import Dashboard from './pages/admin/adminDashboard/AdminDashboard';
import BikePartsDashboard from './pages/admin/bikeParts/BikeParts';
import AdminBookings from './pages/admin/bookings/AdminBookings';
import CustomerDashboard from './pages/admin/costumer/CustomerDashboard';
import Feedback from './pages/admin/feedback/Feedback';
import BookNow from './pages/bookNow/BookNow';
import Bookings from './pages/bookings/Bookings';
import Cart from './pages/cart/Cart';
import ChooseModel from './pages/chooseModel/chooseModel';
import ConfirmBooking from './pages/confirmBooking/ConfirmBooking';
import ConfirmPayment from './pages/confirmPayment/ConfirmPayment';
import ContactUs from './pages/contactUs/ContactUs';
import Homepage from './pages/dashboard/Homepage';
import Login from './pages/login/login';
import Marketplace from './pages/marketplace/Marketplace';
import Register from './pages/register/register';
import Search from './pages/search/Search';
import ThankYouPage from './pages/thankyouForBooking/ThankyouPage';
import UpdateProfile from './pages/updateProfile/UpdateProfile';
import AdminRoutes from './protected/Admin/AdminRoutes';
import UserRoutes from './protected/User/UserRoutes';

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/footer'
          element={<Footer />}
        />{' '}
        <Route
          path='/marketplace'
          element={<Marketplace />}
        />
       
        {/* =========================== END ADMIN ROUTE ============================ */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
