import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/authApi';
import { toast } from 'react-toastify';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      const res = await login(formData).unwrap();
      console.log('API Response:', res);

      toast.success('Login successful');

      if (res.token || res.user) {
        navigate('/');
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div>
      <div className='flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className='bg-white p-8 rounded-lg shadow-lg md:w-96 w-83'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Log In</h2>
          {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <input
                type='email'
                id='email'
                onChange={handleChange}
                className='w-full px-3 py-2.5 bg-pink-100 rounded-lg focus:outline-none focus:ring focus:ring-purple-300'
                placeholder='Email'
              />
            </div>
            <div className='mb-4 relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={formData.password}
                onChange={handleChange}
                className='w-full px-3 py-2.5 pr-10 bg-pink-100 rounded-lg focus:outline-none focus:ring focus:ring-purple-300'
                placeholder='Password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPassword ? (
                  <VscEyeClosed className='text-xl text-purple-400 cursor-pointer' />
                ) : (
                  <VscEye className='text-xl text-purple-400 cursor-pointer' />
                )}
              </button>
            </div>
            <Link to='/forgot-password' className='w-full'>
              <p className='mb-4 ml-1 text-gray-600 w-fit duration-300 hover:text-purple-600 cursor-pointer'>
                Forgot Password?
              </p>
            </Link>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-purple-600 text-white py-2.5 rounded-lg cursor-pointer hover:bg-purple-700 transition duration-200'
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
            <div>
              <p className='mt-4 text-center text-gray-600'>
                Don't have an account?{' '}
                <Link to='/signup' className='text-purple-600 hover:underline'>
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
