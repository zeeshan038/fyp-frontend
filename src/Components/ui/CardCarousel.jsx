'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { SparklesIcon } from 'lucide-react';
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper/modules';

const CardCarousel = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  `;

  return (
    <section className='w-full space-y-4'>
      <style>{css}</style>
      <div className='mx-auto w-full max-w-5xl rounded-[24px] md:rounded-t-[44px]'>
        <div className='relative mx-auto flex w-full flex-col rounded-[24px] p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2'>
          <div className='flex flex-col justify-center w-full pb-2 pl-4 pt-4 md:items-center'>
            <div className='flex gap-2 w-full'>
              <div className='flex flex-col justify-center items-center w-full'>
                <h3 className=' text-[#998a9b] tracking-tight'>
                  GALLERY
                </h3>
                <p className='text-[#633991] text-3xl font-bold'>How I actually look like!</p>
              </div>
            </div>
          </div>

          <div className='flex w-full items-center justify-center gap-4'>
            <div className='w-full'>
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                      }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className='size-full rounded-3xl'>
                      <img
                        src={image.src}
                        className='w-full h-full rounded-xl object-cover'
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
