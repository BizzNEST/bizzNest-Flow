import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from '../Auth/Auth'; // Auth utilities for managing token

/**
 * ProtectedRoute Component
 * Wraps protected pages and redirects users to the login page if:
 * - No token is found
 * - The token is invalid or expired
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected content to render if authorized
 */
const ProtectedRoute = ({ children }) => {
  const token = getToken(); // Get token from localStorage or other storage

  // If no token exists, redirect to login
  if (!token) {
    console.log('No token found. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the JWT token to verify its expiration
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert current time to seconds

    console.log('Decoded Token:', decodedToken);
    console.log('Current Time:', currentTime, 'Token Expiration:', decodedToken.exp);

    // Check if token is expired
    if (decodedToken.exp < currentTime) {
      console.log('Token expired. Logging out and redirecting to login.');
      removeToken(); // Remove expired token
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // If decoding fails (malformed token), remove it and redirect to login
    console.error('Error decoding token:', error);
    removeToken();
    return <Navigate to="/login" replace />;
  }

  // If everything is valid, render the protected children components
  return children;
};

export default ProtectedRoute;
