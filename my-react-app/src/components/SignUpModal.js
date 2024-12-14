import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SignUpModal.css';

const SignUpModal = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    setError(''); // Clear previous error if any

    try {
      console.log('Sending sign-up request...');
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        username,
        password,
      });

      console.log('Response received:', response.data);  // Check the response structure

      if (response.data.message === 'User created successfully') {
        // Store the JWT token in localStorage
        localStorage.setItem('authToken', response.data.token);
        console.log('Sign-up successful, closing modal...');
        closeModal(); // Close the modal after successful sign-up
      } else {
        setError(response.data.message); // Show any error from the backend
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error during sign-up:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
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
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="username">Username</label>
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

          <div className="input-container">
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          {error && <p className="error">{error}</p>}
          
          {/* Modal Footer with buttons */}
          <div className="modal-footer">
            <button className="modal-button submit" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
            <button className="modal-button close" type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
