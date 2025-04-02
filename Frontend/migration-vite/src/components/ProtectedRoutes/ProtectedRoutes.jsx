import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from '../Auth/Auth';// Adjust path as necessary

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    console.log('No token found. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    console.log('Decoded Token:', decodedToken);
    console.log('Current Time:', currentTime, 'Token Expiration:', decodedToken.exp);

    if (decodedToken.exp < currentTime) {
      console.log('Token expired. Logging out and redirecting to login.');
      removeToken();
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    removeToken();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
