import React, { useState, useRef, useEffect } from "react";
import "../styles/Header.css";
import BowlBashLogo from '../assets/nicks/nbb-logo-3.png';

const Header = ({ onSwitch, username }) => {
  const [isNavOpen, setIsNavOpen] = useState(false); 
  const navItemsRef = useRef(null); 
  const hamburgerRef = useRef(null); 

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); 
  };

  const handleClickOutside = (event) => {
    if (
      navItemsRef.current && !navItemsRef.current.contains(event.target) &&
      hamburgerRef.current && !hamburgerRef.current.contains(event.target)
    ) {
      setIsNavOpen(false); 
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNavClick = (page) => {
    onSwitch(page);  
    setIsNavOpen(false); 
  };

  return (
    <header className="header">
      <div className="header-logo-container">
        <img src={BowlBashLogo} alt="Nick's Bowl Bash Logo" className="homepage-logo" />
      </div>
      <nav className="nav">
        <button 
          ref={hamburgerRef} 
          className="hamburger" 
          onClick={toggleNav}
        >
          ☰
        </button>
        <div
          ref={navItemsRef} 
          className={`nav-items ${isNavOpen ? 'active' : ''}`}
        >
          <button className="nav-button" onClick={() => handleNavClick("userStats")}>
            Home
          </button>
          <div className="divider"/>
          <button className="nav-button" onClick={() => handleNavClick("leaderboard")}>
            Leaderboard
          </button>
          <div className="divider"/>
          {/* ✅ New Leagues Button */}
          <button className="nav-button" onClick={() => handleNavClick("leagues")}>
            Leagues
          </button>
        </div>
      </nav>
      {username && (
        <div className="username-display">
          <span>{username}</span>
        </div>
      )}

      {isNavOpen && <div className="backdrop" onClick={toggleNav}></div>}
    </header>
  );
};

export default Header;
