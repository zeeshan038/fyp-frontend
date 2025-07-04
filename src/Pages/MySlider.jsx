import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import img1 from '../assets/image-1.jpg';
import img2 from '../assets/image-2.jpg';
import img3 from '../assets/image-3.jpg';
import img4 from '../assets/image-4.jpg';
import img5 from '../assets/image-5.jpg';

const MySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    arrows: true,
    autoplaySpeed: 2000,
    autoplay: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
  };

  const images = [img1, img2, img3, img4, img5];

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <Slider {...settings}>
        {images.map((item, id) => (
          <div key={id} style={{ padding: '10px' }} className='flex gap-20'>
            <img
              src={item}
              alt={`Slide ${id + 1}`}
              style={{
                width: '300px',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MySlider;
