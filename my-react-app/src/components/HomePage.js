import React, { useState, useEffect } from 'react';
import BackgroundGrid from './BackgroundGrid';
import '../styles/HomePage.css';
import SignUpModal from './SignUpModal';
import LogInModal from './LogInModal';
import Header from './Header';
import PicksModal from './PicksModal';
import UserStats from './UserStats';
import Leaderboard from './Leaderboard';
import BowlBashLogo from '../assets/nicks/nbb-logo-3.png';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [myStats, setMyStats] = useState(null);
  const [username, setUsername] = useState(''); // State for username
  const [activeComponent, setActiveComponent] = useState("userStats"); // New state for active component

  const handlePicksModalClick = () => {
    setPicksModalOpen(true);
  };

  const handleClosePicksModal = () => {
    setPicksModalOpen(false);
  };

  const handleLogin = () => {
    setIsLogInModalOpen(true);
  };

  const handleLogInSuccess = async (userId, username) => {
    setIsLogInModalOpen(false);
    setIsLoggedIn(true);
    setIsHeaderVisible(true);
    setCurrentUserId(userId);
    setActiveComponent("userStats"); // Automatically show UserStats after login

    toast.success('Log In successful!');

      // Pass the username to the header
    setUserStats((prev) => ({
      ...prev,
      username, // Add username to userStats state
    }));
  };

  useEffect(() => {
    if (currentUserId) {
      const fetchUserStats = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/picks/user/${currentUserId}/picks-and-stats`);
          setPicksSubmitted(true);
          setUserStats(response.data);
          setUsername(response.data.username); // Set the username from the response
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }
      };
      fetchUserStats();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      const fetchMyStats = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/mystats/${currentUserId}`);
          // setPicksSubmitted(true);
          setMyStats(response.data);
        } catch (error) {
          console.error('Error fetching my stats:', error);
        }
      };
      fetchMyStats();
    }
  }, [currentUserId]);

  const handleSaveAndClose = async () => {
    setPicksSubmitted(true);
    setPicksModalOpen(false);

    try {
      const response = await axios.get(`http://localhost:5000/api/picks/user/${currentUserId}/picks-and-stats`);
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const renderActiveComponent = () => {
    if (!isLoggedIn) {
      return (
        <>
          <BackgroundGrid logos={logos} />
          <div className="logo-button-container">
            <div className="logo-container">
              <img src={BowlBashLogo} alt="Nick's Bowl Bash Logo" className="homepage-logo" />
            </div>
            <div className="button-container">
              <button className="home-page-button" onClick={handleLogin}>
                Log In
              </button>
              <button className="home-page-button" onClick={() => setIsModalOpen(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </>
      );
    }

    switch (activeComponent) {
      case "userStats":
        return picksSubmitted ? (
          userStats ? <UserStats stats={userStats} mystats={myStats}/> : <div className="loading">Loading your stats...</div>
        ) : (
          <button onClick={handlePicksModalClick} className="glowing-button">
            Make Picks
          </button>
        );
      case "leaderboard":
        return <Leaderboard />;
      default:
        return null;
    }
  };

  return (
    <div className="HomePage">
      {isHeaderVisible && (
          <Header
            onSwitch={(component) => setActiveComponent(component)}
            username={username} // Pass the username from the userStats
          />
        )}
      {isModalOpen && <SignUpModal closeModal={() => setIsModalOpen(false)} />}
      {isLogInModalOpen && (
        <LogInModal
          isOpen={isLogInModalOpen}
          onClose={() => setIsLogInModalOpen(false)}
          onLogInSuccess={handleLogInSuccess}
          switchToSignUp={() => {
            setIsLogInModalOpen(false);
            setIsModalOpen(true);
          }}
          setUserPicksSubmitted={setPicksSubmitted}
        />
      )}
      {isPicksModalOpen && (
        <div className="modal-overlay">
          <PicksModal
            onClose={handleClosePicksModal}
            currentUserId={currentUserId}
            onSaveAndClose={handleSaveAndClose}
          />
        </div>
      )}
      <main>{renderActiveComponent()}</main>
    </div>
  );
};

export default HomePage;
