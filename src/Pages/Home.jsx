import React, { useEffect, useRef, useState } from 'react';
import image from '../assets/TopImage.png';
import { IoMdHeartEmpty } from 'react-icons/io';
import medgic from '../assets/medgic.png';
import { TfiRocket } from 'react-icons/tfi';
import mission from '../assets/mission.png';
import camera from '../assets/camera.png';
import analyze from '../assets/analyze.png';
import result from '../assets/result.png';
import Start from './Start';

const Home = () => {
  const [activeImage, setActiveImage] = useState(camera);
  const [activeBox, setActiveBox] = useState(1);
  const [hoveredBox, setHoveredBox] = useState(null);

  return (
    <div className=''>
      <section id='home'>
        <div className='flex justify-between items-center flex-wrap gap-15 md:gap-0 bg-[linear-gradient(135deg,_rgba(60,_8,_118,_0.8)_0%,_rgba(250,_0,_118,_0.8)_100%)] w-[100%] pt-28 xl:px-55 md:px-10 px-5'>
          <div className='md:w-[55%] text-center m-auto md:m-0 md:text-left'>
            <h1 className='text-white text-[35px] lg:text-[57px] md:text-[50px] md:leading-14 md:mb-6 mb-4 fontClass'>
              Reimagine Medicine
            </h1>
            <p className='lg:text-2xl md:text-xl m-auto md:m-0 text-white/60 md:leading-7 w-[88%] fontClass'>
              Use our powerful AI technology to scan, analyze and detect skin
              diseases in three simple steps. Fast and free!
            </p>
            <div className='flex gap-4 mt-10 justify-center md:justify-start'>
              <button className='border-2 border-white bg-white text-pink-800 w-[37%] py-2 lg:w-[30%] md:w-[37%] lg:py-3.5 md:py-3 font-medium rounded-lg'>
                START
              </button>
              <button className='border-2 border-white w-[37%] py-2 lg:w-[30%] md:w-[37%] text-white lg:py-3.5 md:py-3 font-medium rounded-lg'>
                LEARN MORE
              </button>
            </div>
          </div>
          <div className='md:w-[45%]'>
            <img src={image} alt='img' className='w-96' />
          </div>
        </div>
      </section>
      <section>
        <div className='lg:flex relative justify-end pt-20 hidden'>
          <div>
            <img
              src={medgic}
              alt=''
              className='absolute xl:left-60 lg:left-10 top-52'
            />
          </div>
          <div className='xl:pl-200 lg:pl-130'>
            <div className='p-2 bg-white w-fit shadow-[0_0_45px_0_rgba(0,0,0,0.15)] mb-7'>
              <IoMdHeartEmpty className='text-[50px] text-pink-700' />
            </div>
            <h1 className='xl:text-[43px] lg:text-[38px] fontClass text-purple-900'>
              Hi, I am Medgic :)
            </h1>
            <p className='xl:text-lg text-gray-400 pt-2 w-[90%] fontClass'>
              I am a very advanced Artificial Intelligence (AI) robot built by
              my human founders to analyze* skin conditions
            </p>
            <button className='text-white py-2 mt-6 px-6 rounded text-[14px] font-medium bg-gradient-to-br from-[#fd378e] to-[#e54595] hover:from-[#e54595] hover:to-[#fd378e] hover:shadow-[0_0_45px_0_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-300'>
              READ MORE
            </button>
          </div>
        </div>
        <div className='xl:pt-160 lg:pt-190 xl:px-60 lg:px-15 lg:flex hidden justify-center gap-16 items-center'>
          <div>
            <img src={mission} alt='' className='xl:w-220 lg:w-300' />
          </div>
          <div>
            <div className='p-2 bg-white w-fit shadow-[0_0_45px_0_rgba(0,0,0,0.15)] mb-7'>
              <TfiRocket className='text-5xl text-pink-700 ' />
            </div>
            <div>
              <h1 className='xl:text-[43px] lg:text-[38px] fontClass text-purple-900'>
                My Mission
              </h1>
              <p className='xl:text-lg text-gray-400 pt-2 w-[90%] fontClass'>
                I can think and learn. I become smarter every time you use me.
                With your participation, one day I will be able to solve global
                healthcare challenges!
              </p>
              <button className='text-white py-2 mt-6 px-6 rounded text-[14px] font-medium bg-gradient-to-br from-[#fd378e] to-[#e54595] hover:from-[#e54595] hover:to-[#fd378e] hover:shadow-[0_0_45px_0_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300'>
                READ MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id='feature'
        className='bg-[#faf6fb] flex justify-center xl:px-60 lg:px-10 px-5 xl:justify-between items-center lg:gap-30 gap-5 md:flex-nowrap flex-wrap pt-20'
      >
        <div className='flex flex-col'>
          {/* Box 1 */}
          <div
            className='flex items-center gap-7 border-b border-gray-300 pb-10'
            onMouseEnter={() => {
              setActiveImage(camera);
              setHoveredBox(1);
            }}
            onMouseLeave={() => {
              if (activeBox !== 1)
                setActiveImage(activeBox === 2 ? analyze : result);
              setHoveredBox(null);
            }}
            onClick={() => {
              setActiveBox(1);
              setActiveImage(camera);
            }}
          >
            <div
              className={`lg:px-9 lg:py-6.5 px-8 py-5 rounded-full transition-colors cursor-pointer ${
                activeBox === 1 || hoveredBox === 1
                  ? 'bg-gradient-to-br from-[#fd374e] to-[#e54590]'
                  : 'bg-white'
              }`}
            >
              <p
                className={`lg:text-5xl text-4xl ${
                  activeBox === 1 || hoveredBox === 1
                    ? 'text-white'
                    : 'text-pink-700'
                }`}
              >
                1
              </p>
            </div>
            <div>
              <h2 className='text-purple-900 lg:text-3xl text-2xl pb-1'>
                Camera, action!
              </h2>
              <p className='text-gray-500 lg:text-[16px] text-[14px]'>
                <span className='cursor-pointer text-pink-500'>
                  Download me
                </span>{' '}
                to your phone. Take a photo of your skin condition
              </p>
            </div>
          </div>

          {/* Box 2  */}
          <div
            className='flex items-center gap-7 py-10 border-b border-gray-300 '
            onMouseEnter={() => {
              setActiveImage(analyze);
              setHoveredBox(2);
            }}
            onMouseLeave={() => {
              if (activeBox !== 2)
                setActiveImage(activeBox === 1 ? camera : result);
              setHoveredBox(null);
            }}
            onClick={() => {
              setActiveBox(2);
              setActiveImage(analyze);
            }}
          >
            <div
              className={`lg:px-9 lg:py-6.5 px-8 py-5 rounded-full transition-colors cursor-pointer ${
                activeBox === 2 || hoveredBox === 2
                  ? 'bg-gradient-to-br from-[#fd374e] to-[#e54590]'
                  : 'bg-white'
              }`}
            >
              <p
                className={`text-4xl lg:text-5xl ${
                  activeBox === 2 || hoveredBox === 2
                    ? 'text-white'
                    : 'text-pink-700'
                }`}
              >
                2
              </p>
            </div>
            <div>
              <h2 className='text-purple-900 lg:text-3xl text-2xl pb-3'>
                I analyze
              </h2>
              <p className='text-gray-500 lg:text-[16px] text-[14px]'>
                Let me think about it.. No humans involved, but some electricity
                pls..
              </p>
            </div>
          </div>

          {/* Box 3 */}
          <div
            className='flex items-center gap-7 pt-10'
            onMouseEnter={() => {
              setActiveImage(result);
              setHoveredBox(3);
            }}
            onMouseLeave={() => {
              if (activeBox !== 3)
                setActiveImage(activeBox === 1 ? camera : analyze);
              setHoveredBox(null);
            }}
            onClick={() => {
              setActiveBox(3);
              setActiveImage(result);
            }}
          >
            <div
              className={`lg:px-9 lg:py-6.5 px-8 py-5 rounded-full transition-colors cursor-pointer ${
                activeBox === 3 || hoveredBox === 3
                  ? 'bg-gradient-to-br from-[#fd374e] to-[#e54590]'
                  : 'bg-white'
              }`}
            >
              <p
                className={`text-4xl lg:text-5xl ${
                  activeBox === 3 || hoveredBox === 3
                    ? 'text-white'
                    : 'text-pink-700'
                }`}
              >
                3
              </p>
            </div>
            <div>
              <h2 className='text-purple-900 lg:text-3xl text-2xl pb-3'>
                Get results
              </h2>
              <p className='text-gray-500 lg:text-[16px] text-[14px]'>
                I will tell you what I think it is*, along with some friendly
                advices*
              </p>
            </div>
          </div>
        </div>

        <div>
          <img
            src={activeImage}
            alt=''
            className='xl:w-90 transition-opacity duration-300'
          />
        </div>
      </section>
      <section className='bg-[linear-gradient(135deg,_rgba(60,_8,_118,_0.8)_0%,_rgba(250,_0,_118,_0.8)_100%)]'>
        <Start />
      </section>
    </div>
  );
};

export default Home;
