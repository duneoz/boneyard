import React, { useState, useRef, useEffect } from "react";
import "../styles/Header.css";
import BowlBashLogo from '../assets/nicks/nbb-logo-3.png';

const Header = ({ onSwitch, username }) => {
  const [isNavOpen, setIsNavOpen] = useState(false); // State for toggling the nav menu
  const navItemsRef = useRef(null); // Create a reference for nav items
  const hamburgerRef = useRef(null); // Create a reference for hamburger button

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // Toggle nav visibility
  };

  // Handle click outside of nav-items or hamburger button to close the menu
  const handleClickOutside = (event) => {
    if (
      navItemsRef.current && !navItemsRef.current.contains(event.target) &&
      hamburgerRef.current && !hamburgerRef.current.contains(event.target)
    ) {
      setIsNavOpen(false); // Close the nav if clicked outside
    }
  };

  // Add event listener for clicks outside of the nav-items
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-logo-container">
        <img src={BowlBashLogo} alt="Nick's Bowl Bash Logo" className="homepage-logo" />
      </div>
      <nav className="nav">
        {/* Hamburger Button (only visible on mobile) */}
        <button 
          ref={hamburgerRef} // Attach ref to hamburger button
          className="hamburger" 
          onClick={toggleNav}
        >
          ☰
        </button>
        <div
          ref={navItemsRef} // Attach the ref to nav-items
          className={`nav-items ${isNavOpen ? 'active' : ''}`}
        >
          <button className="nav-button" onClick={() => onSwitch("userStats")}>
            Home
          </button>
          <div class="divider"/>
          <button className="nav-button" onClick={() => onSwitch("leaderboard")}>
            Leaderboard
          </button>
        </div>
      </nav>
      {username && (
        <div className="username-display">
          <span>{username}</span>
        </div>
      )}

      {/* Backdrop */}
      {isNavOpen && <div className="backdrop" onClick={toggleNav}></div>}
    </header>
  );
};

export default Header;
