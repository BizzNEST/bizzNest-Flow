import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mail from "../assets/mail.svg";
import Lock from "../assets/lock.svg";
import Visibility_Off from "../assets/visibility_off.svg";
import Visibility from "../assets/visibility.svg";
import './LoginSignup.css';
import logo from './logo.svg';

/**
 * LoginSignup component
 * Allows both Admins to sign up and log in.
 * Supports password visibility toggles and form validation.
 */
const LoginSignup = () => {
  // UI state for toggling between Login and Signup
  const [isLogin, setIsLogin] = useState(true);

  // Toggles for showing/hiding passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  // Error states
  const [errorMessage, setErrorMessage] = useState("");
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();

  // State for login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State for signup form
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
  });

  // Handle login form input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle signup form input changes
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Submit login form
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, loginData);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      setErrorMessage("Incorrect email or password.");
    }
  };

  // Submit signup form
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    // Validate passwords
    if (signupData.password !== signupData.confirmPassword) {
      return setSignupError("Passwords do not match.");
    }

    // Validate email domain
    if (!signupData.email.includes("@digitalnest.org")) {
      return setSignupError("Use a @digitalnest.org email.");
    }

    // Password length check
    if (signupData.password.length < 8) {
      return setSignupError("Password must be at least 8 characters.");
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/signup`, signupData);
      setIsLogin(true); // Switch back to login tab on success
    } catch (error) {
      setSignupError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="LoginSignupPage">
      <div className="LoginSignupWrapper">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="bizzNest Flow Logo" className="navbar-logo" />
        </div>

        {/* Auth Box */}
        <div className="LoginSignup">
          <div className="LoginSignup-container">
            {/* Tab Selector */}
            <div className="tabs">
              <button className={`tab ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>Login</button>
              <button className={`tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>Sign up</button>
              <div className={`sliderTab ${isLogin ? "login" : "signup"}`}></div>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="LoginSignup-form">
                <div className="internInputContainer">
                  <img src={Mail} alt="Email" className="internInputIcon" />
                  <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} />
                </div>
                <div className="internInputContainer">
                  <img src={Lock} alt="Password" className="internInputIcon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                  <img
                    src={showPassword ? Visibility_Off : Visibility}
                    alt="Toggle Visibility"
                    className="internVisibilityIcon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                <button type="submit">Log in</button>
                <span className="ForgotPassword" onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSignup} className="LoginSignup-form">
                <div className="nameContainer">
                  <input type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange} />
                  <input type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange} />
                </div>
                <div className="internInputContainer">
                  <img src={Mail} alt="Email" className="internInputIcon" />
                  <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} />
                </div>
                <div className="internInputContainer">
                  <img src={Lock} alt="Password" className="internInputIcon" />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
                  <img src={showPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className="internVisibilityIcon" onClick={() => setShowPassword(!showPassword)} />
                </div>
                <div className="internInputContainer">
                  <img src={Lock} alt="Confirm Password" className="internInputIcon" />
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={handleSignupChange} />
                  <img src={showConfirmPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className="internVisibilityIcon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                </div>
                <div className="internInputContainer">
                  <img src={Lock} alt="Admin Key" className="internInputIcon" />
                  <input
                    type={showAdminKey ? "text" : "password"}
                    name="adminKey"
                    placeholder="Admin Key?"
                    className="adminKeyInput"
                    value={signupData.adminKey}
                    onChange={handleSignupChange}
                  />
                  <img
                    src={showAdminKey ? Visibility_Off : Visibility}
                    alt="Toggle Visibility"
                    className="internVisibilityIcon"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                  />
                </div>
                {signupError && <p className="errorMessage">{signupError}</p>}
                <button type="submit">Sign up</button>
                <span className="internSignup" onClick={() => navigate("/internSignUp")}>
                  Are you an Intern?
                </span>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
