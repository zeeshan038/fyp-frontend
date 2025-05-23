import React from 'react';
import Home from './Pages/Home';
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

const App = () => {
  return (
    <div className=''>
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
