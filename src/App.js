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
import MechanicList from './pages/admin/mechanic/MechanicList';
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
import MechanicDashboard from './pages/mechanic/MechanicDashboard/MechanicDashboard';
import Register from './pages/register/register';
import Search from './pages/search/Search';
import ThankYouPage from './pages/thankyouForBooking/ThankyouPage';
import UpdateProfile from './pages/updateProfile/UpdateProfile';
import AdminRoutes from './protected/Admin/AdminRoutes';
import MechanicRoutes from './protected/Mechanic/MechanicRoutes';
import UserRoutes from './protected/User/UserRoutes';

const user = JSON.parse(localStorage.getItem('user'));

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route
          path='/'
          element={user?.isAdmin ? <Dashboard /> : <Homepage />}
        />
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
        {/* =========================== USER ROUTE ============================ */}
        <Route element={<UserRoutes />}>
          <Route
            path='/homepage'
            element={<Homepage />}
          />
          <Route
            path='/bike'
            element={<BookNow />}
          />
          <Route
            path='/bike/:model'
            element={<ChooseModel />}
          />
          <Route
            path='/user/update'
            element={<UpdateProfile />}
          />
          <Route
            path='/user/booking'
            element={<Bookings />}
          />
          <Route
            path='/user/cart'
            element={<Cart />}
          />
          <Route
            path='/confirmBooking/:id'
            element={<ConfirmBooking />}
          />
          <Route
            path='/search'
            element={<Search />}
          />
          <Route
            path='/confirmPayment'
            element={<ConfirmPayment />}
          />
          <Route
            path='/aboutus'
            element={<AboutUs />}
          />{' '}
          <Route
            path='/contactus'
            element={<ContactUs />}
          />
          <Route
            path='/thankyou'
            element={<ThankYouPage />}
          />
        </Route>
        {/* =========================== END USER ROUTE ============================ */}
        {/* =========================== ADMIN ROUTE ============================ */}
        <Route element={<AdminRoutes />}>
          <Route
            path='/admin/dashboard'
            element={<Dashboard />}
          />
          <Route
            path='/admin/dashboard/bike'
            element={<BikeDashboard />}
          />
          <Route
            path='/admin/updatebike/:id'
            element={<UpdateBike />}
          />
          <Route
            path='/admin/parts'
            element={<BikePartsDashboard />}
          />
          <Route
            path='/admin/customerDashboard'
            element={<CustomerDashboard />}
          />

          <Route
            path='/admin/mechanic'
            element={<MechanicList />}
          />
          <Route
            path='/admin/barchart'
            element={<BarChat />}
          />
          <Route
            path='/admin/bookings'
            element={<AdminBookings />}
          />

          <Route
            path='/admin/feedback'
            element={<Feedback />}
          />
        </Route>
        {/* =========================== END ADMIN ROUTE ============================ */}
        {/* =========================== Mechanic ROUTE ============================ */}
        <Route element={<MechanicRoutes />}>
          <Route
            path='/mechanic'
            element={<MechanicDashboard />}
          />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
