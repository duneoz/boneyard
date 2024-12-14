import React, { useState } from 'react';
import '../styles/LogInModal.css'; // Reuse modal styles

const LogInModal = ({ isOpen, onClose, onLogInSuccess, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogIn = async (e) => {
    e.preventDefault();

    // Debug: Check the values being sent
    console.log({ email, password });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data); // Add this to see what the server is responding with

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        console.log('Login successful!');
        onLogInSuccess();  // Trigger success handler passed from HomePage
        onClose();  // Close the modal
      } else {
        setError(data.message); // Display error message
      }
    } catch (err) {
      console.error('Log in error:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Log In</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogIn}>
          <div className="input-container">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-container">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          {/* The Log In button triggers the form submission */}
          <div className="modal-footer">
            <button className="modal-button submit" type="submit">
              Log In
            </button>
            <button className="modal-button close" onClick={onClose}>
              Close
            </button>
          </div>
        </form>

        <p>
          Don’t have an account?{' '}
          <span onClick={switchToSignUp} className="switch-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogInModal;
