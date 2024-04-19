import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

// import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";
import HeroSection from "./Components/HeroSection";
import { useSelector } from 'react-redux';
import "./bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Productscreen from "./Screens/ProductScreen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import CartScreen from "./Screens/CartScreen";
import ProductHome from "./Screens/ProductHomeScreen";
// import { SignIn } from "./Screens/SignIn";
import Home from "./Screens/HomeScreen";
import RequestChangePass from "./Screens/RequestChangepass";
import ConfirmChangePass from "./Screens/ConfirmChangepass";
import UploadScreen from "./Screens/UploadScreen";
import OTPVerification from "./Screens/OTPVerification";
import HomeScreen from "./Screens/HomeScreen";
import StudentNav from "./Screens/StudentHomeScreen";
import StudentHomeScreen from "./Screens/StudentHomeScreen";
// need mag kakasunod amp
import ProfileScreen from "./Screens/ProfileScreen";
import EditScreen from "./Screens/EditScreen";
import VideoDetailScreen from './Screens/VideoDetailScreen';
import PaymentScreen from "./Screens/PaymentScreen";
import PlaceOrderScreen from "./Screens/PlaceOrderScreen";
import OrderScreen from "./Screens/OrderScreen";
import InstructorNav from "./Components/InstructorNav";
import DeleteScreen from "./Screens/DeleteScreen";
import Protect from "./Screens/Utils/ProtectedRoutes";
import Student from "./Screens/Utils/StudentProutes";
import StudentProductHome from "./Screens/StudentProductHomescreen";
import AdminPanel from "./Screens/AdminPanelScreen";
import EditUsers from "./Screens/EditUsers";
import EditProduct from "./Screens/EditProducts";
import AdminUserDetails from "./Screens/AdminUserDetail";
import AdminProductDetail from "./Screens/AdminProductDetail";
import AdminVideoDetails from "./Screens/AdminVideoDetail";
import SalesStatisticScreen from "./Screens/SalesStatisticScreen";
import ProductListScreen from "./Screens/ProductListScreen";
import ProfileWithProductScreen from "./Screens/ProfileWithProductScreen";
import VideoDetailViewScreen from "./Screens/VideoDetailViewScreen";
import Contact from "./Screens/ContactUsScreen";
import AdminConcern from "./Screens/AdminConcern";
import ReviewScreen from "./Screens/ReviewScreen";
import Admin from "./Screens/Utils/AdminProutes";
import Footer from "./Components/Footer";
import About from "./Components/AboutUs";

function App() {
  // const { isSubscribed } = useSelector((state) => state.userSubscription); // Assuming you have a slice of state that stores subscription status

  // // Define a protected route component
  // const ProtectedRoute = ({ element, path }) => {
  //   if (isSubscribed) {
  //     return element;
  //   } else {
  //     return <Navigate to="/" replace />;
  //   }
  // };
  return (
    <Router>
      {/* <Header /> */}
      
      <Container>
        <Routes>
          <Route path="/HeroSection" element={<HeroSection />} />
          <Route path="/delete" element={<Protect><DeleteScreen /></Protect>} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/about" element={<About />} />

          <Route path="/studenthomescreen" element={<Student><StudentHomeScreen /></Student>} />
          <Route path="/edit/:id" element={<Protect><EditScreen /></Protect>} />
          <Route path="/homeScreen" element={<Protect><HomeScreen/></Protect>} />
          <Route path="/StudentNav" element={<Student><StudentNav /></Student>} />
          <Route path="/InstructorNav" element={<Protect><InstructorNav /></Protect>} />
          <Route path="/navbar" element={<Protect>-<Navbar /></Protect>} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/:userId" element={<ProfileWithProductScreen />} />
          <Route path="/productlist" element={<ProductListScreen />} />
          <Route path="/Statistics" element={<SalesStatisticScreen />} />
          <Route path="/cart/:id?" element={<CartScreen />} />  
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/request-changepass" element={<RequestChangePass />} />
          <Route
            path="/confirm-changepass/:uid/:token"
            element={<ConfirmChangePass />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/review/:id" element={<ReviewScreen />} />

          <Route path="/products" element={<Protect><ProductHome /></Protect>} exact />
          <Route path="/Stuproducts" element={<Student><StudentProductHome /></Student>} exact />

          <Route path="/product/:id" element={<Productscreen />} />
          <Route path="/upload" element={<Protect><UploadScreen /></Protect>} />
          <Route
            path={`/verify-otp/user_id/:userId/otp/:otpId`}
            element={<OTPVerification />}
          />
          
          <Route path="/product/:productId/video/:videoId" element={<VideoDetailViewScreen />} />
         <Route path="/videos/:videoId/" element={<VideoDetailScreen />} />


          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/edit-user/:userId/" element={<EditUsers/>} /> 
          <Route path="/admin/user-details/:userId/" element={<AdminUserDetails/>} /> 
          <Route path="/admin/video-details/:videoId/" element={<AdminVideoDetails/>} /> 
          <Route path="/admin/edit-product/:productId/" element={<EditProduct/>} /> 
          <Route path="/admin/product-details/:productId" element={<Admin><AdminProductDetail /></Admin>} />
          <Route path="/concerns" element={<AdminConcern />} />

          

          {/* <Route path='/sign-in' element={<SignIn />} /> */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
      {/* <Footer/> */}
    </Router>
  );
}

export default App;
