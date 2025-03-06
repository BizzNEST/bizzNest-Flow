import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginSignup.css';


const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, loginData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please check your credentials.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, adminKey } = signupData;
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    if (!email.includes('@digitalnest.org')) {
      alert('Please enter a valid email (@digitalnest.org)');
      return;
    }
  
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
        firstName,
        lastName,
        email,
        password,
        adminKey,
      });
      alert(response.data.message);
      setIsLogin(true); // Switch to Login tab after successful signup
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to register.');
    }
  };

  return (
    <div className="LoginSignupWrapper">
      <div className={`Waves ${isLogin ? 'signup' : 'login'}`} />
      <div className="LoginSignup">
        <div className="LoginSignup-container">
          <div className="tabs">
            <button
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
            <div className={`sliderTab ${isLogin ? 'login' : 'signup'}`}></div>
          </div>
          {isLogin ? (
            <form onSubmit={handleLogin} className="LoginSignup-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="LoginEmail"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="LoginPassword"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              <button type="submit">Log in</button>
              <span 
                className="ForgotPassword" 
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </span>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="LoginSignup-form">
              <div className="nameContainer">
                <input
                  className="signupFirstName"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={signupData.firstName}
                  onChange={handleSignupChange}
                />
                <input
                  className="signupLastName"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={signupData.lastName}
                  onChange={handleSignupChange}
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="signupEmail"
                value={signupData.email}
                onChange={handleSignupChange}
              />
              <div className="passwordContainer">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="signupPasswordInput"
                  value={signupData.password}
                  onChange={handleSignupChange}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="signupConfirmPasswordInput"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                />
              </div>
              <input
                type="password"
                name="adminKey"
                placeholder="Admin Key?"
                className="adminKeyInput"
                value={signupData.adminKey}
                onChange={handleSignupChange}
              />
              <button type="submit">Sign up</button>
              <span 
                className="internSignup" 
                onClick={() => navigate('/internSignUp')}
              >
                Are you an Intern?
              </span>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;