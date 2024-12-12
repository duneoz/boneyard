import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Nick's Bowl Bash 2024</h1>
      <nav>
        <button className="btn btn-primary">Log In</button>
        <button className="btn btn-secondary">Sign Up</button>
      </nav>
    </header>
  );
};

export default Header;
