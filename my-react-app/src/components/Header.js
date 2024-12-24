import React from "react";
import "../styles/Header.css";
import BowlBashLogo from '../assets/nicks/nbb-logo-3.png';

const Header = ({ onSwitch }) => {
  return (
    <header className="header">
      <div className="header-logo-container">
        <img src={BowlBashLogo} alt="Nick's Bowl Bash Logo" className="homepage-logo" />
      </div>
      {/* <h1>Nick's Bowl Bash 2024</h1> */}
      <nav className="nav">
            <button className="nav-button" onClick={() => onSwitch("userStats")}>
              Home
            </button>
            <button className="nav-button" onClick={() => onSwitch("leaderboard")}>
              Leaderboard
            </button>
      </nav>
    </header>
  );
};

export default Header;

