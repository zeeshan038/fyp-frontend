import React, { Suspense, lazy } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded pages
const Home = lazy(() => import('./Pages/Home'));
const Signup = lazy(() => import('./Pages/Authentication/Signup'));
const Login = lazy(() => import('./Pages/Authentication/Login'));
const ForgotPassword = lazy(() =>
  import('./Pages/Authentication/ForgotPassword')
);
const Otp = lazy(() => import('./Pages/Authentication/Otp'));
const UploadImage = lazy(() => import('./Pages/UploadImage'));

const App = () => {
  const location = useLocation();

  // Check if current path is /upload
  const hideNavbar = [
    '/upload',
    '/signup',
    '/login',
    '/forgot-password',
    '/otp',
  ].includes(location.pathname);

  return (
    <div className=''>
      {!hideNavbar && <Navbar />}

      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-screen bg-black'>
            <div className='loading-spinner'></div>
          </div>
        }
      >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/otp' element={<Otp />} />
          <Route path='/upload' element={<UploadImage />} />
        </Routes>
      </Suspense>

      {!hideNavbar && <Footer />}

      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
};

export default App;
