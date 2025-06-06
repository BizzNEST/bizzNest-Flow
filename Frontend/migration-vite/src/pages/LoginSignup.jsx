import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mail from "../assets/mail.svg";
import Lock from "../assets/lock.svg";
import Visibility_Off from "../assets/visibility_off.svg";
import Visibility from "../assets/visibility.svg";
import styles from './LoginSignup.module.css';
import logo from './logo.svg';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
  });

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log('API URL is:', import.meta.env.VITE_API_URL);

    try {
      console.log("API URL is:", import.meta.env.VITE_API_URL);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, loginData);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch {
      setErrorMessage("Incorrect email or password.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (signupData.password !== signupData.confirmPassword) {
      return setSignupError("Passwords do not match.");
    }
    if (!signupData.email.includes("@digitalnest.org")) {
      return setSignupError("Use a @digitalnest.org email.");
    }
    if (signupData.password.length < 8) {
      return setSignupError("Password must be at least 8 characters.");
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/signup`, signupData);
      setIsLogin(true);
    } catch {
      setSignupError("Failed to register. Please try again.");
    }
  };

  return (
    <div className={styles.LoginSignupPage}>
      <div className={styles.LoginSignupWrapper}>
        <div className={styles.logo}>
          <img src={logo} alt="bizzNest Flow Logo" className={styles.navbarLogo} />
        </div>
        <div className={styles.LoginSignup}>
          <div className={styles.LoginSignupContainer}>
            <div className={styles.tabs}>
              
              <button
                  className={`${styles.tab} ${isLogin ? styles.active : ""}`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>

                <button
                  className={`${styles.tab} ${!isLogin ? styles.active : ""}`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </button>
              <div className={`${styles.sliderTab} ${isLogin ? styles.login : styles.signup}`}></div>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className={styles.LoginSignupForm}>
                <div className={styles.internInputContainer}>
                  <img src={Mail} alt="Email" className={styles.internInputIcon} />
                  <input className={styles.LoginEmail} type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} />
                </div>
                <div className={styles.internInputContainer}>
                  <img src={Lock} alt="Password" className={styles.internInputIcon} />
                  <input className={styles.signupPassword} type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
                  <img src={showPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className={styles.internVisibilityIcon} onClick={() => setShowPassword(!showPassword)} />
                </div>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <button type="submit">Log in</button>
                <span className={styles.ForgotPassword} onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
              </form>
            ) : (
              <form onSubmit={handleSignup} className={styles.LoginSignupForm}>
                <div className={styles.nameContainer}>
                  <input type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange} />
                  <input type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange} />
                </div>
                <div className={styles.internInputContainer}>
                  <img src={Mail} alt="Email" className={styles.internInputIcon} />
                  <input className={styles.LoginEmail} type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} />
                </div>
                <div className={styles.internInputContainer}>
                  <img src={Lock} alt="Password" className={styles.internInputIcon} />
                  <input className={styles.LoginPassword} type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
                  <img src={showPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className={styles.internVisibilityIcon} onClick={() => setShowPassword(!showPassword)} />
                </div>
                <div className={styles.internInputContainer}>
                  <img src={Lock} alt="Confirm Password" className={styles.internInputIcon} />
                  <input className={styles.LoginPassword} type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={handleSignupChange} />
                  <img src={showConfirmPassword ? Visibility_Off : Visibility} alt="Toggle Visibility" className={styles.internVisibilityIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                </div>
                <div className={styles.internInputContainer}>
                  <img src={Lock} alt="Admin Key" className={styles.internInputIcon} />
                  <input
                    type={showAdminKey ? "text" : "password"}
                    name="adminKey"
                    placeholder="Admin Key?"
                    className={styles.adminKeyInput}
                    value={signupData.adminKey}
                    onChange={handleSignupChange}
                  />
                  <img
                    src={showAdminKey ? Visibility_Off : Visibility}
                    alt="Toggle Visibility"
                    className={styles.internVisibilityIcon}
                    onClick={() => setShowAdminKey(!showAdminKey)}
                  />
                </div>
                {signupError && <p className={styles.errorMessage}>{signupError}</p>}
                <button type="submit">Sign up</button>
                <span
                  className={styles.internSignup}
                  onClick={() => navigate("/internSignUp")}
                >
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
