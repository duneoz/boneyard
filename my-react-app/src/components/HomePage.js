import React, { useState, useEffect } from 'react';
import BackgroundGrid from './BackgroundGrid';
import '../styles/HomePage.css';
import SignUpModal from './SignUpModal';

const HomePage = () => {
  const logoContext = require.context('../assets/logos', false, /\.(png|jpe?g|svg)$/);
  const logos = logoContext.keys().map(logoContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.classList.add('fade-out'));
    setTimeout(() => setIsLoggedIn(true), 1500);
  };

  // Open Modal function with logging
  const openModal = () => {
    console.log('Sign Up button clicked, opening modal...');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal...');
    setIsModalOpen(false);
  };

  // useEffect to track modal open state
  useEffect(() => {
    console.log('isModalOpen has changed:', isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = 'hidden';
    return () => {
      // Re-enable scrolling on unmount
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="HomePage">
      {!isLoggedIn && (
        <>
          <BackgroundGrid logos={logos} />
          <div className="button-container">
            <button className="home-page-button" type="button" onClick={handleLogin}>Log In</button>
            <button className="home-page-button" type="button" onClick={openModal}>Sign Up</button>
          </div>
        </>
      )}
      {isModalOpen && <SignUpModal closeModal={closeModal} />}
      {isLoggedIn && <div className="home-page">Welcome to Nick's Bowl Bash 2024!</div>}
    </div>
  );
};

export default HomePage;
