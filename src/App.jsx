import React from 'react';
import Home from './Pages/Home';
import './App.css';
import Navbar from './Components/Navbar';

const App = () => {
  return (
    <div className='h-[100vh] bg-[linear-gradient(135deg,_rgba(60,_8,_118,_0.8)_0%,_rgba(250,_0,_118,_0.8)_100%)] w-[100%]'>
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
