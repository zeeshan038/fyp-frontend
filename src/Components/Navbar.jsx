
import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { HiOutlineBars3 } from 'react-icons/hi2';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('HOME'); // Default to HOME

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setMenuOpen(false); // Close mobile menu when an item is selected
  };

  const navbarBg =
    menuOpen || !scrolled
      ? 'bg-transparent py-8'
      : 'bg-[linear-gradient(135deg,_rgba(60,_8,_118,_0.8)_0%,_rgba(250,_0,_118,_0.8)_100%)] py-2';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu items data
  const menuItems = ['HOME', 'FEATURE', 'FAQ', 'GALLERY', 'CONTACT'];

  return (
    <div className=''>
      <nav
        className={`fixed z-10 w-full flex justify-between lg:px-80 px-7 duration-500 ease-in-out ${navbarBg}`}
      >
        <div className='flex justify-center items-center'>
          <img src={logo} alt='logo' className='w-35' />
        </div>

        {/* Hamburger */}
        <div onClick={toggleMenu}>
          <HiOutlineBars3 className='text-white text-4xl border-1 border-gray-400 rounded w-12 h-10 mr-2 block md:hidden' />
        </div>

        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-6 lg:gap-10 items-center text-white/50 font-medium'>
          {menuItems.map((item) => (
            <li
              key={item}
              className={`cursor-pointer hover:text-gray-300 transition pb-1 text-[18px] ${
                activeItem === item ? 'text-white border-b-3 border-white/50 hover:text-white ' : ''
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
          <button className='border border-white rounded text-white px-8 py-2 hover:bg-white cursor-pointer hover:text-pink-700 text-[16px] duration-300'>
            START!
          </button>
        </ul>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className='fixed z-10 w-full flex flex-col px-7 py-4 gap-4 bg-gray-900 md:hidden bg-[linear-gradient(135deg,_rgba(60,_8,_118,_0.8)_0%,_rgba(250,_0,_118,_0.8)_100%)] pt-20'>
          {menuItems.map((item) => (
            <li
              key={item}
              className={`cursor-pointer hover:text-gray-300 transition ${
                activeItem === item ? 'text-white underline' : 'text-white/50'
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
          <button className='border border-white rounded text-white px-8 py-2 hover:bg-white cursor-pointer hover:text-pink-700 text-[17px] w-fit'>
            START
          </button>
        </ul>
      )}
    </div>
  );
};

export default Navbar;