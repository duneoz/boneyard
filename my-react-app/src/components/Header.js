import React from "react";
import "../styles/Header.css";
import BowlBashLogo from '../assets/nicks/nbb-logo-3.png';

const Header = ({ onSwitch, username }) => {
  return (
    <header className="header">
      <div className="header-logo-container">
        <img src={BowlBashLogo} alt="Nick's Bowl Bash Logo" className="homepage-logo" />
      </div>
      <nav className="nav">
        <button className="nav-button" onClick={() => onSwitch("userStats")}>
          Home
        </button>
        <button className="nav-button" onClick={() => onSwitch("leaderboard")}>
          Leaderboard
        </button>
      </nav>
      {username && (
        <div className="username-display">
          <span>{username}</span>
        </div>
      )}
    </header>
  );
};

export default Header;


