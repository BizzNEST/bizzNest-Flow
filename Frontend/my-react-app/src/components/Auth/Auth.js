import axios from 'axios';

// Save the token to localStorage
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Retrieve the token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove the token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getProtectedData = async () => {
  const token = getToken();
  if (token) {
    try {
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
    throw new Error('No token found, please log in');
  }
};
