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
        <div className='text-center pt-10 pb-8'>
          <h1 className='text-[42px] text-white fontClass'>TRY MEDGIC!</h1>
          <p className='text-white/70 fontClass'>
            Available free for all devices
          </p>
        </div>
        <div className='flex justify-center gap-4 flex-wrap lg:flex-nowrap px-10'>
          <div className='flex justify-center items-center cursor-pointer gap-2 bg-white px-6 py-3 rounded'>
            <img src={world} alt='img' />
            <p className='text-[#633991] font-medium fontClass1'>ALL</p>
          </div>
          <div className='flex justify-center items-center cursor-pointer gap-2 bg-white px-6 py-3 rounded'>
            <img src={android} alt='img' />
            <p className='text-[#633991] font-medium fontClass1'>ANDROID</p>
          </div>
          <div className='flex justify-center items-center cursor-pointer gap-2 bg-white px-6 py-3 rounded'>
            <img src={apple} alt='img' />
            <p className='text-[#633991] font-medium fontClass1'>IPHONE</p>
          </div>
          <div className='flex justify-center items-center cursor-pointer gap-2 bg-white px-6 py-3 rounded'>
            <img src={download} alt='img' />
            <p className='text-[#633991] font-medium fontClass1'>
              DOWNLOAD APK
            </p>
          </div>
          <div className='flex justify-center items-center cursor-pointer gap-2 bg-white px-6 py-3 rounded'>
            <img src={huawei} alt='img' />
            <p className='text-[#633991] font-medium fontClass1'>HUAWEI</p>
          </div>
        </div>
        <div className='w-full flex justify-center pt-10'>
          <p className='md:w-[72%] w-[85%] text-center text-white/40 text-[13px]'>
            *Not rated by FDA as a medical device. You need to be 21 years old
            and above. Medgic uses experimental AI technology to offer general
            information for general educational purposes only, subject to your
            agreement with all of Terms of Use and Privacy Policy . It is not
            meant to replace physician consultation and we make no guarantees to
            the accuracy of the results. Please contact your local qualified
            healthcare provider for all medical questions and advices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Start;
