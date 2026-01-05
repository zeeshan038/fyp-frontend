import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../constant';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(15);
  const [showResend, setShowResend] = useState(false);
  const timerRef = useRef(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    if (!email) {
      setError('Email is missing. Please go back and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/user/verify-token`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || 'Account verified successfully!');
        navigate('/reset-password', { state: { email: email } });
      } else {
        setError(data.msg || 'Invalid or expired OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timerRef.current);
          setShowResend(true);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  const handleResendClick = async () => {
    if (!email) {
      setError('Email is missing. Please go back and try again.');
      return;
    }

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
        toast.success('OTP resent to your email');
        setSeconds(15);
        setShowResend(false);
        startTimer();
      } else {
        setError(data.msg || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Resend OTP error:', err);
    }
  };

  const handleOtpChange = (value) => {
    if (value === '' || /^[0-9]+$/.test(value)) {
      setOtp(value);
    }
  };

  return (
    <div>
      <div className='flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className='bg-white p-8 rounded-lg shadow-lg md:w-96 w-83'>
          <h2 className='text-2xl font-bold mb-6 text-center'>OTP</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <p className='text-center text-gray-600 mb-4'>
                Enter verification code sent to your email
              </p>
              {error && (
                <p className='text-red-500 text-center mb-4'>{error}</p>
              )}
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={4}
                renderInput={(props) => (
                  <input
                    {...props}
                    className='!w-13 h-10 mx-2 text-center text-lg rounded-[18px] border border-gray-300 bg-pink-100 focus:border-purple-500 focus:outline-none focus:ring focus:ring-purple-300'
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    maxLength={1}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
                containerStyle='flex justify-center'
                shouldAutoFocus={true}
              />
            </div>

            <button
              type='submit'
              className='w-full bg-purple-600 text-white py-2.5 rounded-lg cursor-pointer hover:bg-purple-700 transition duration-200'
              disabled={otp.length < 4 && isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <div className='w-full flex justify-between text-gray-600 font-medium mt-4'>
            {!showResend ? <p>{seconds} sec</p> : <p></p>}
            {showResend ? (
              <button
                type='button'
                onClick={handleResendClick}
                className='text-purple-600 hover:text-purple-800 transition-colors cursor-pointer'
              >
                Resend
              </button>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
