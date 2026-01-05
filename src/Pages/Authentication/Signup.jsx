import React, { useState } from 'react';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; 
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { BASE_URL } from '../../constant';

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      setError('Name is required.');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError('Please provide a valid email address.');
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Password is required.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (formData.password.length > 200) {
      setError('Password cannot exceed 200 characters.');
      return false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      setError('Confirm password is required.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || 'Signup successful!');
        navigate('/login');
      } else {
        setError(data.msg || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
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
            {/* <div className='flex items-center my-4'>
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
            </button> */}
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
