import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { SlLocationPin } from 'react-icons/sl';
import { TfiEmail, TfiHeadphoneAlt } from 'react-icons/tfi';

const Footer = () => {
  return (
    <div className=''>
      <div id='contact' className='flex lg:justify-between justify-center items-center flex-wrap gap-5 lg:flex-nowrap xl:px-60 lg:px-20 md:px-50 px-15 bg-gray-100 md:py-15 py-10'>
        <div>

          <div className='flex md:gap-6 gap-2 flex-col md:flex-row'>
            <div className='flex items-center gap-3'>
              <TfiEmail className='text-gray-600/80' />
              <p className='text-pink-500/60 font-medium'>hello@neutzee.com</p>
            </div>
            <div className='flex items-center gap-3'>
              <TfiHeadphoneAlt className='text-gray-600/80' />
              <p className='text-pink-500/60 font-medium'>+92-3001234567</p>
            </div>
          </div>
        </div>
        <div className='flex gap-3'>
          <div className='bg-white p-3 rounded cursor-pointer shadow-[0_0_45px_0_rgba(0,0,0,0.1)] duration-300 ease-in-out text-pink-500/50 hover:text-pink-500/80'>
            <FaFacebookF className='text-xl' />
          </div>
          <div className='bg-white p-3 rounded cursor-pointer shadow-[0_0_45px_0_rgba(0,0,0,0.1)] duration-300 ease-in-out text-pink-500/50 hover:text-pink-500/80'>
            <FaTwitter className='text-xl' />
          </div>
          <div className='bg-white p-3 rounded cursor-pointer shadow-[0_0_45px_0_rgba(0,0,0,0.1)] duration-300 ease-in-out text-pink-500/50 hover:text-pink-500/80'>
            <FaInstagram className='text-xl ' />
          </div>
        </div>
      </div>
   
    </div>
  );
};

export default Footer;
