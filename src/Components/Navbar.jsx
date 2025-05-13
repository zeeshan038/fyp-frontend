import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { HiOutlineBars3 } from 'react-icons/hi2';
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
  return (
    <div className='h-[200vh]'>
      <nav
        className={`fixed z-10 w-full flex justify-between px-7 duration-500 ease-in-out ${navbarBg}`}
      >
        <div className='flex justify-center items-center'>
          <img src={logo} alt='logo' className='w-25' />
        </div>

        {/* Hamburger  */}
        <div onClick={toggleMenu}>
          <HiOutlineBars3 className='text-white text-4xl border-1 border-gray-400 rounded w-12 h-10 mr-2' />
        </div>

        {/* Desktop Menu  */}
        <ul className='hidden md:flex gap-6 items-center '>
          <li className='cursor-pointer hover:text-gray-300'>HOME</li>
          <li className='cursor-pointer hover:text-gray-300'>FEATURE</li>
          <li className='cursor-pointer hover:text-gray-300'>FAQ</li>
          <li className='cursor-pointer hover:text-gray-300'>GALLERY</li>
          <li className='cursor-pointer hover:text-gray-300'>CONTACT</li>
          <button>START</button>
        </ul>
      </nav>

      {/* Mobile Menu  */}
      {menuOpen && (
        <ul className='fixed w-100 flex flex-col px-7 py-4 gap-4 bg-gray-900 md:hidden bg-[linear-gradient(135deg,_rgba(60,_8,_118,_0.8)_0%,_rgba(250,_0,_118,_0.8)_100%)] pt-80'>
          <li className='cursor-pointer hover:text-gray-300'>HOME</li>
          <li className='cursor-pointer hover:text-gray-300'>FEATURE</li>
          <li className='cursor-pointer hover:text-gray-300'>FAQ</li>
          <li className='cursor-pointer hover:text-gray-300'>GALLERY</li>
          <li className='cursor-pointer hover:text-gray-300'>CONTACT</li>
          <button>START</button>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
