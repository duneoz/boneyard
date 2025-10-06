// src/api/leagues.js
import axios from 'axios';

// ✅ Dynamic base URL for local vs. production
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Helper: get the auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Create a new league
 */
export async function createLeague(name, description) {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/api/leagues/create`,
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating league:', error);
    throw error.response?.data || { message: 'Server error creating league' };
  }
}

/**
 * Join a league via join code
 */
export async function joinLeague(code) {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/api/leagues/join`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error joining league:', error);
    throw error.response?.data || { message: 'Server error joining league' };
  }
}

/**
 * Fetch all leagues that the logged-in user has joined
 */
export async function fetchUserLeagues() {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/api/leagues/my-leagues`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ The backend returns an array directly, not an object
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user leagues:', error);
    throw error.response?.data || { message: 'Server error fetching leagues' };
  }
}
