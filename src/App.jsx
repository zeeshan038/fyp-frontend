import React, { Suspense, lazy } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './Pages/Authentication/ResetPassword';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  UploadOutlined, 
  HistoryOutlined, 
  TeamOutlined 
} from '@ant-design/icons';

// Lazy-loaded pages
const Home = lazy(() => import('./Pages/Home'));
const Signup = lazy(() => import('./Pages/Authentication/Signup'));
const Login = lazy(() => import('./Pages/Authentication/Login'));
const ForgotPassword = lazy(() => import('./Pages/Authentication/ForgotPassword'));
const Otp = lazy(() => import('./Pages/Authentication/Otp'));
const Analyze = lazy(() => import('./Pages/Analyze'));

const { Content, Sider } = Layout;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if navbar should be hidden
  const hideNavbar = [
    '/signup',
    '/login',
    '/forgot-password',
    '/otp',
    '/reset-password'
  ].includes(location.pathname);
  
  // Check if sidebar should be shown
  const showSidebar = [
    '/analyze',
    '/upload',
    '/history',
    '/patients'
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className=''>
      {!hideNavbar && !showSidebar && <Navbar />}

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
                <Route path='/upload' element={<Analyze initialView="upload" />} />
                <Route path='/history' element={<Analyze initialView="history" />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/analyze' element={<Analyze initialView="dashboard" />} />
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
