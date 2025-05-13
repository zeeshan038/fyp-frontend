import React from 'react';
import image from '../assets/TopImage.png';

const Home = () => {
  return (
    <div className='pt-50 lg:px-75'>
      <div className='flex justify-between'>
        <div>
          <h1 className='text-white text-[75px] mb-6 h1-font'>Reimagine Medicine</h1>
          <p>
            Use our powerful AI technology to scan, analyze and detect skin
            diseases in three simple steps. Fast and free!
          </p>
          <div>
            <button>START</button>
            <button>LEARN MORE</button>
          </div>
        </div>
        <div>
          <img src={image} alt='' />
        </div>
      </div>
    </div>
  );
};

export default Home;
