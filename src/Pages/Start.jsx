import React from 'react';
import { TfiMobile } from 'react-icons/tfi';
import world from '../assets/world.png';
import android from '../assets/android.png';
import apple from '../assets/apple.png';
import download from '../assets/download.png';
import huawei from '../assets/huawei.png';

const Start = () => {
  return (
    <div id='start' className='py-30'>
      <div className='w-full flex justify-center border-red-500'>
        <div className='inline-block bg-white p-2 rounded'>
          <TfiMobile className='text-pink-700 text-[45px]' />
        </div>
      </div>
      <div>
        <div className='text-center pt-4 w-full flex flex-col justify-center items-center'>
          <h1 className='text-[42px] text-white fontClass'>TRY MEDGIC!</h1>
          <p className='text-gray-200 w-170'>
            Our AI tool helps you identify potential skin conditions using image
            analysis. Upload a photo to get a preliminary skin health
            assessment. Quick, secure, and easy to use.
          </p>
          <button className='bg-white rounded-lg text-pink-600 px-6 font-semibold py-1 mt-10'>
            Try Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
