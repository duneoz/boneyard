import React, { useState } from 'react';
import '../styles/LoginModal.css'; // Reuse modal styles

const LogInModal = ({ isOpen, onClose, onLogInSuccess, switchToSignUp, setUserPicksSubmitted }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Determine the correct API URL based on the environment
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://bowl-bash.herokuapp.com/api/auth/login' // Replace with your Heroku app URL
      : 'http://localhost:5000/api/auth/login';

  const handleLogIn = async (e) => {
    e.preventDefault();
    console.log('Attempting to log in with', { email, password });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response data:', data); // Log the entire response

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        console.log('Login successful!', data.userId);  // Log the userId
        setUserPicksSubmitted(data.picksSubmitted);
        onLogInSuccess(data.userId, data.username); // Pass userId up to HomePage
        onClose();  // Close the modal
      } else {
        setError(data.message);
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
