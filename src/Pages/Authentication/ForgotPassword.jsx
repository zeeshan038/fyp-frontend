import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../constant';

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/otp', { state: { email: email } });
        toast.success(data.msg || 'OTP sent to your email');
      } else {
        setError(data.msg || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className='bg-white p-8 rounded-lg shadow-lg md:w-96 w-83'>
          <h2 className='text-2xl font-bold mb-6 text-center'>
            Forgot Password
          </h2>
          {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
          <form onSubmit={handleSubmit} className=''>
            <div className='mb-4'>
              <input
                type='email'
                id='email'
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2.5 bg-pink-100 rounded-lg focus:outline-none focus:ring focus:ring-purple-300'
                placeholder='email@gmail.com'
              />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-purple-600 text-white py-2.5 rounded-lg cursor-pointer hover:bg-purple-700 transition duration-200'
            >
              {isLoading ? 'Sending...' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
