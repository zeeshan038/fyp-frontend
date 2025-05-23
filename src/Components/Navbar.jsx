import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { HiOutlineBars3 } from 'react-icons/hi2';
import { RxCross2 } from 'react-icons/rx';
import { a } from 'framer-motion/client';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('HOME');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setMenuOpen(false);
  };

  const navbarBg =
    menuOpen || !scrolled
      ? 'bg-transparent py-6'
      : 'bg-[linear-gradient(135deg,_rgba(60,_8,_118,_1)_0%,_rgba(250,_0,_118,_1)_100%)] py-1';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['HOME', 'FEATURE', 'FAQ', 'GALLERY', 'CONTACT'];

  return (
    <div className='relative'>
      <nav
        className={`fixed z-50 w-full flex justify-between xl:px-60 px-7 duration-500 ease-in-out ${navbarBg}`}
      >
        <div className='flex justify-center items-center'>
          <img src={logo} alt='logo' className='w-25' />
        </div>

        {/* Hamburger */}
        <button
          onClick={toggleMenu}
          className='md:hidden p-2 focus:outline-none'
          aria-label='Toggle menu'
        >
          {menuOpen ? (
            <RxCross2 className='text-white text-4xl' />
          ) : (
            <HiOutlineBars3 className='text-white text-4xl border-1 border-gray-400 rounded w-12 h-10 mr-2' />
          )}
        </button>

        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-6 lg:gap-8 items-center text-white/50'>
          {menuItems.map((item) => (
            <li key={item} onClick={() => handleItemClick(item)}>
              <a
                href={`#${item.toLowerCase()}`}
                className={`cursor-pointer hover:text-gray-300 transition pb-1 font-medium ${
                  activeItem === item
                    ? 'text-white md:border-b-2 border-white/50 hover:text-white'
                    : 'text-white/50'
                }`}
              >
                {item}
              </a>
            </li>
          ))}

          <button className='border border-white rounded text-white px-6 py-1 my-1 hover:bg-white cursor-pointer hover:text-pink-700 text-[14px] duration-300'>
            <a href='#start'>START!</a>
          </button>
        </ul>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='fixed right-0 left-0 z-40 bg-[linear-gradient(135deg,_rgba(60,_8,_118,_1)_0%,_rgba(250,_0,_118,_1)_100%)] pt-24'>
          <ul className='flex flex-col justify-center items-center px-7 py-4 gap-4'>
            {menuItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className={`text-xl transition ${
                    activeItem === item ? 'text-white' : 'text-white/50'
                  } hover:text-gray-300`}
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </a>
              </li>
            ))}
            <button
              onClick={() => handleItemClick(start)}
              className='border border-white rounded text-white px-8 py-2 hover:bg-white cursor-pointer hover:text-pink-700 text-[17px] w-fit mt-4'
            >
              <a href='#start'>START</a>
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
