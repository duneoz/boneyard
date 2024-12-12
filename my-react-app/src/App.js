import React, { useState } from 'react';
import Header from './components/Header';
import BackgroundGrid from './components/BackgroundGrid';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dynamically load the logos using require.context
  const logoContext = require.context('./assets/logos', false, /\.(png|jpe?g|svg)$/);
  const logos = logoContext.keys().map(logoContext);

  const handleLogin = () => {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.classList.add('fade-out'));
    setTimeout(() => setIsLoggedIn(true), 1500); // Delay for the fade-out animation
  };

  return (
    <div className="App">
      <Header />
      {!isLoggedIn && (
        <>
          <BackgroundGrid logos={logos} /> {/* Pass logos as a prop */}
          <div className="login-screen">
            <button className="login-btn" onClick={handleLogin}>Log In</button>
          </div>
        </>
      )}
      {isLoggedIn && <div className="home-page">Welcome to Nick's Bowl Bash 2024!</div>}
    </div>
  );
};

export default App;
