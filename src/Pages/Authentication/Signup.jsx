import React, { useState } from 'react';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../features/auth/authApi';
import { toast } from 'react-toastify';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const Signup = () => {
  const [signup, { isLoading }] = useSignupMutation('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.name) {
      setError('Name are required');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    console.log('Submitting:', formData);

    try {
      const res = await signup(formData).unwrap();
      console.log('API Response:', res);

      if (res.error) {
        setError(res.msg);
      } else {
        navigate('/login');
        toast.success(res.msg);
      }
    } catch (err) {
      setError(err.data?.msg || 'Signup failed');
    }
  };

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Is valid?
  const isValidEmail = emailRegex.test(formData.email);

  return (
    <div>
      <div className='flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className='bg-white p-8 rounded-lg shadow-lg md:w-96 w-83'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up</h2>
          <form onSubmit={handleSubmit} className=''>
            {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
            <div className='mb-4'>
              <input
                type='text'
                id='name'
                onChange={handleChange}
                className='w-full px-3 py-2.5 bg-pink-100 rounded-lg focus:outline-none focus:ring focus:ring-purple-300'
                placeholder='Username'
              />
            </div>
            <div className='relative w-full max-w-80 mb-4 md:max-w-86'>
              <input
                type='email'
                id='email'
                placeholder='mail@gmail.com'
                className={`w-full text-[16px] profile-font px-3 py-2.5 bg-pink-100 pr-10 rounded-lg transition-all duration-200 focus:outline-none focus:ring focus:ring-purple-300 ${
                  isValidEmail
                    ? 'focus:ring-2 focus:ring-blue-500 border border-blue-500'
                    : 'border-[#5B5B5B] outline-none '
                }`}
                value={formData.email}
                onChange={handleChange}
              />

              {/* Blue tick */}
              {isValidEmail && (
                <FaCheckCircle className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 ' />
              )}
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
            <div className='mb-6 relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='w-full px-3 py-2.5 pr-10 bg-pink-100 rounded-lg focus:outline-none focus:ring focus:ring-purple-300'
                placeholder='Confirm Password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showConfirmPassword ? (
                  <VscEyeClosed className='text-xl text-purple-400 cursor-pointer' />
                ) : (
                  <VscEye className='text-xl text-purple-400 cursor-pointer' />
                )}
              </button>
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-purple-600 text-white py-2.5 rounded-lg cursor-pointer hover:bg-purple-700 transition duration-200'
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
            <div className='flex items-center my-4'>
              <div className='flex-grow h-px bg-gray-300'></div>
              <p className='mx-4 text-gray-500 font-medium'>OR</p>
              <div className='flex-grow h-px bg-gray-300'></div>
            </div>
            <button
              type='button'
              className='w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200 shadow-sm'
            >
              <FcGoogle className='text-xl' />
              <span className='text-gray-700 font-medium'>
                Sign up with Google
              </span>
            </button>
            <div>
              <p className='mt-4 text-center text-gray-600'>
                Already have an account?{' '}
                <Link to='/login' className='text-purple-600 hover:underline'>
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
