import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mail from "../assets/mail.svg";
import Lock from "../assets/lock.svg";
import Visibility_Off from "../assets/visibility_off.svg";
import Visibility from "../assets/visibility.svg";
import './LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false); // For admin key visibility
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', adminKey: ''
  });

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

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
    if (signupData.password !== signupData.confirmPassword) return alert('Passwords do not match');
    if (!signupData.email.includes('@digitalnest.org')) return alert('Use a @digitalnest.org email');
    if (signupData.password.length < 8) return alert('Password must be at least 8 characters');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, signupData);
      alert(response.data.message);
      setIsLogin(true);
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to register.');
    }
  };

  return (
    <div className="LoginSignupPage">
      <div className="LoginSignupWrapper">
        <div className={`Waves ${isLogin ? 'signup' : 'login'}`} />
        <div className="LoginSignup">
          <div className="LoginSignup-container">
            <div className="tabs">
              <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
              <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign up</button>
              <div className={`sliderTab ${isLogin ? 'login' : 'signup'}`}></div>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="LoginSignup-form">
                <div className="internInputContainer">
                  <img src={Mail} alt="Email" className="internInputIcon" />
                  <input type="email" name="email" placeholder="Email" className="LoginEmail" value={loginData.email} onChange={handleLoginChange} />
                </div>

                <div className="internInputContainer">
                  <img src={Lock} alt="Password" className="internInputIcon" />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="LoginPassword" value={loginData.password} onChange={handleLoginChange} />
                  <img src={showPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className="internVisibilityIcon" onClick={() => setShowPassword(!showPassword)} />
                </div>

                <button type="submit">Log in</button>
                <span className="ForgotPassword" onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="LoginSignup-form">
                <div className="nameContainer">
                  <input className="signupFirstName" type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange} />
                  <input className="signupLastName" type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange} />
                </div>

                <div className="internInputContainer">
                  <img src={Mail} alt="Email" className="internInputIcon" />
                  <input type="email" name="email" placeholder="Email" className="signupEmail" value={signupData.email} onChange={handleSignupChange} />
                </div>

                {/* Password field with eye icon */}
                <div className="internInputContainer">
                  <img src={Lock} alt="Password" className="internInputIcon" />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="signupPasswordInput" value={signupData.password} onChange={handleSignupChange} />
                  <img src={showPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className="internVisibilityIcon" onClick={() => setShowPassword(!showPassword)} />
                </div>

                {/* Confirm Password field with eye icon */}
                <div className="internInputContainer">
                  <img src={Lock} alt="Confirm Password" className="internInputIcon" />
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className="signupConfirmPasswordInput" value={signupData.confirmPassword} onChange={handleSignupChange} />
                  <img src={showConfirmPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className="internVisibilityIcon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                </div>

                {/* Admin Key field with eye icon */}
                <div className="internInputContainer">
                  <img src={Lock} alt="Admin Key" className="internInputIcon" />
                  <input type={showAdminKey ? "text" : "password"} name="adminKey" placeholder="Admin Key?" className="adminKeyInput" value={signupData.adminKey} onChange={handleSignupChange} />
                  <img src={showAdminKey ? Visibility_Off : Visibility} alt="Toggle Visibility" className="internVisibilityIcon" onClick={() => setShowAdminKey(!showAdminKey)} />
                </div>

                <button type="submit">Sign up</button>
                <span className="internSignup" onClick={() => navigate('/internSignUp')}>Are you an Intern?</span>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;