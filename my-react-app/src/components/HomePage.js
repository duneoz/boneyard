import React, { useState, useEffect } from 'react';
import BackgroundGrid from './BackgroundGrid';
import '../styles/HomePage.css';
import SignUpModal from './SignUpModal';
import LogInModal from './LogInModal';
import Header from './Header';
import PicksModal from './PicksModal';
import UserStats from './UserStats'; // Assuming you have this component
import BowlBashLogo from '../assets/nicks/bb-logo.png';
import axios from 'axios';

const HomePage = () => {
  const logoContext = require.context('../assets/logos', false, /\.(png|jpe?g|svg)$/);
  const logos = logoContext.keys().map(logoContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [picksSubmitted, setPicksSubmitted] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isPicksModalOpen, setPicksModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userStats, setUserStats] = useState(null);

  const handlePicksModalClick = () => {
    console.log('Navigating to Picks modal...');
    setPicksModalOpen(true); // Open the modal
  };

  const handleClosePicksModal = () => {
    setPicksModalOpen(false); // Close the modal
  };

  const handleLogin = () => {
    console.log('Log In button clicked, opening modal...');
    setIsLogInModalOpen(true); // Open Log In modal
  };

  const handleLogInSuccess = async (userId) => {
    console.log('User logged in successfully! UserID:', userId);
    setIsLogInModalOpen(false);
    setIsLoggedIn(true);
    setIsHeaderVisible(true);
    setCurrentUserId(userId);

    try {
      const response = await axios.get(`/api/picks/user/${userId}/picks-and-stats`);
      console.log('User stats response:', response.data);

      setPicksSubmitted(true); // Assume picks are submitted if stats are returned
      setUserStats(response.data); // Store user stats for UserStats component
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const switchToSignUp = () => {
    setIsLogInModalOpen(false); // Close Log In Modal
    setIsModalOpen(true); // Open Sign Up Modal
  };

  useEffect(() => {
    console.log('isModalOpen has changed:', isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSaveAndClose = () => {
    setPicksSubmitted(true); // Update the state to hide the "Make Picks" button
    setPicksModalOpen(false); // Close the Picks Modal
  };

  const openModal = () => {
    console.log('Sign Up button clicked, opening modal...');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing Sign Up modal...');
    setIsModalOpen(false);
  };

  return (
    <div className="HomePage">
      {isHeaderVisible && <Header />} {/* Conditionally render header */}
      {!isLoggedIn && (
        <>
          <BackgroundGrid logos={logos} />
          <div className="logo-container">
            <img src={BowlBashLogo} alt="Nick's Bowl Bash Logo" className="homepage-logo" />
          </div>
          <div className="button-container">
            <button className="home-page-button" type="button" onClick={handleLogin}>
              Log In
            </button>
            <button className="home-page-button" type="button" onClick={openModal}>
              Sign Up
            </button>
          </div>
        </>
      )}
      {isModalOpen && <SignUpModal closeModal={closeModal} />}
      {isLogInModalOpen && (
        <>
          <LogInModal
            isOpen={isLogInModalOpen}
            onClose={() => setIsLogInModalOpen(false)}
            onLogInSuccess={handleLogInSuccess}
            switchToSignUp={switchToSignUp}
            setUserPicksSubmitted={setPicksSubmitted}
          />
        </>
      )}

      {picksSubmitted ? (
        userStats ? (
          <UserStats stats={userStats} />
        ) : (
          <div className="loading">Loading your stats...</div>
        )
      ) : (
        <button onClick={handlePicksModalClick} className="glowing-button">
          Make Picks
        </button>
      )}

      {isPicksModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PicksModal
              onClose={handleClosePicksModal}
              currentUserId={currentUserId}
              onSaveAndClose={handleSaveAndClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
