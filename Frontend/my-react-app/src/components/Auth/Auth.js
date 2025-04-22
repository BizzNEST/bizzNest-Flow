import axios from 'axios';

/**
 * Save the token to localStorage
 * @param {string} token - The authentication token to store
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Retrieve the token from localStorage
 * @returns {string|null} - The stored token, or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove the token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Fetch data from a protected route using the stored token
 * 
 * @async
 * @returns {Promise<any>} - The response data from the protected API
 * @throws {Error} - If the token is missing or the request fails
 */
export const getProtectedData = async () => {
  const token = getToken();

  if (token) {
    try {
      // Make an authorized GET request to the protected route
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/protected-route`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error accessing protected route:', error);
      throw new Error('Failed to access protected route');
    }
  } else {
    // Throw error if no token is found
    throw new Error('No token found, please log in');
  }
};
