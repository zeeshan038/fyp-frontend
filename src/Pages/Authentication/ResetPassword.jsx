import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { BASE_URL } from '../../constant';

const ResetPassword = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    // Password validation
    if (!formData.newPassword) {
      setError('Password is required.');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be greater than 6 characters');
      return false;
    }
    if (formData.newPassword.length > 200) {
      setError('Password cannot exceed 200 characters.');
      return false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      setError('Confirm password is required.');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is missing. Please start the process again.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/user/reset-password/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || 'Password reset successful!');
        navigate('/login');
      } else {
        setError(data.msg || 'Password reset failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className='bg-white p-8 rounded-lg shadow-lg md:w-96 w-83'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Reset Password</h2>
          {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className='mb-4 relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='newPassword'
                value={formData.newPassword}
                onChange={handleChange}
                className='w-full px-3 py-2.5 pr-10 bg-pink-100 rounded-lg focus:outline-none focus:ring focus:ring-purple-300'
                placeholder='New Password'
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div>
              <p className='mt-4 text-center text-gray-600'>
                Remember your password?{' '}
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

export default ResetPassword;
