import React, { useState, useEffect } from 'react';
import BackgroundGrid from './BackgroundGrid';
import '../styles/HomePage.css';
import SignUpModal from './SignUpModal';
import LogInModal from './LogInModal';
import Header from './Header';
import MakePicksForm from './MakePicksForm';
// import MakePicksForm from './MakePicksForm';

const HomePage = () => {
  const logoContext = require.context('../assets/logos', false, /\.(png|jpe?g|svg)$/);
  const logos = logoContext.keys().map(logoContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [picksSubmitted, setPicksSubmitted] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false); // To control header visibility
  const [isMakePicksModalOpen, setMakePicksModalOpen] = useState(false);


  const handleMakePicksClick = () => {
    // Navigate to the "Make Picks" form or route
    console.log('Navigating to Make Picks modal...');
    setMakePicksModalOpen(true);  // Open the modal
  };

  const handleCloseMakePicksModal = () => {
    setMakePicksModalOpen(false);  // Close the modal
  };

  // Open Log In Modal
  const handleLogin = () => {
    console.log('Log In button clicked, opening modal...');
    setIsLogInModalOpen(true); // Open Log In modal
  };

  useEffect(() => {
    console.log('isLogInModalOpen state:', isLogInModalOpen);
  }, [isLogInModalOpen]);  // This will log every time isLogInModalOpen changes

  // Open Sign Up Modal
  const openModal = () => {
    console.log('Sign Up button clicked, opening modal...');
    setIsModalOpen(true);
  };

  // Close Sign Up Modal
  const closeModal = () => {
    console.log('Closing modal...');
    setIsModalOpen(false);
  };

  // Close Log In Modal and handle successful login
  const handleLogInSuccess = () => {
    console.log('User logged in successfully!');
    setIsLogInModalOpen(false);  // Close Log In Modal
    setIsLoggedIn(true);         // Update logged-in state
    setIsHeaderVisible(true); // Show header upon successful login
  };

  // const handleOpenModal = () => setIsModalOpen(true);
  // const handleCloseModal = () => setIsModalOpen(false);

  // Switch to Sign Up modal from Log In modal
  const switchToSignUp = () => {
    setIsLogInModalOpen(false);  // Close Log In Modal
    setIsModalOpen(true);        // Open Sign Up Modal
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

  return (
    <div className="HomePage">
      {isHeaderVisible && <Header />} {/* Conditionally render header */}
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
      {isLogInModalOpen && (
  <>
    {console.log("Rendering LogInModal")} {/* Add this line */}
    <LogInModal
      isOpen={isLogInModalOpen}
      onClose={() => setIsLogInModalOpen(false)}
      onLogInSuccess={handleLogInSuccess}
      switchToSignUp={switchToSignUp}
      setUserPicksSubmitted={setPicksSubmitted}
    />
  </>
)}

      {/* {isLoggedIn && <div className="home-page">Welcome to Nick's Bowl Bash 2024!</div>} */}

      {!picksSubmitted ? (
        <button onClick={handleMakePicksClick} className="glowing-button">
          Make Picks
        </button>
      ) : (
        <div className="picks-table" >
          {/* Render user picks here */}
          <p>Your picks will show here.</p>
        </div>
      )}

      {/* Make Picks Modal */}
      {isMakePicksModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <MakePicksForm onClose={handleCloseMakePicksModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
