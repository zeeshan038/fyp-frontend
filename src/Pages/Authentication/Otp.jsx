import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useVerifyOTPMutation } from '../../features/auth/authApi';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(15);
  const [showResend, setShowResend] = useState(false);
  const timerRef = useRef(null);
  const [error, setError] = useState('');
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      const res = await verifyOTP({ otp, email }).unwrap();
      console.log('API Response:', res);

      if (res.error) {
        setError(res.msg);
      } else {
        navigate('/login', { state: { email: email } });
      }
    } catch (err) {
      setError(err.data?.msg || 'Something went wrong');
    }
    console.log('Submitting:', otp);
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

  const handleResendClick = () => {
    setSeconds(15);
    setShowResend(false);
    startTimer();
    console.log('Resending OTP...');
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
