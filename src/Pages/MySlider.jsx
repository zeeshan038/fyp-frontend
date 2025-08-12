import React from 'react';
import CardCarousel from '../Components/ui/CardCarousel';

import card1 from '../assets/image-1.jpg';
import card2 from '../assets/image-2.jpg';
import card3 from '../assets/image-3.jpg';
import card4 from '../assets/image-4.jpg';
import card5 from '../assets/image-5.jpg';

const MySlider = () => {
  const images = [
    { src: card1, alt: 'Image 1' },
    { src: card2, alt: 'Image 2' },
    { src: card3, alt: 'Image 3' },
    { src: card4, alt: 'Image 4' },
    { src: card5, alt: 'Image 5' },
    { src: card1, alt: 'Image 1' },
    { src: card2, alt: 'Image 2' },
    { src: card3, alt: 'Image 3' },
    { src: card4, alt: 'Image 4' },
    { src: card5, alt: 'Image 5' },
  ];

  return (
    <div className='pt-40'>
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  );
};

export default MySlider;
