import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfilePictureUpload from "../components/ProfileUpload/ProfileUpload";
import Logo from "../assets/Logo.png";
import Mail from "../assets/mail.svg";
import Visibility_Off from "../assets/visibility_off.svg";
import Visibility from "../assets/visibility.svg";
import Lock from "../assets/lock.svg";
import "./InternSignup.css";
import logo from './logo.svg';

const InternSignup = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    DepartmentID: "",
    location: "",
    profilePic: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicSelect = (file) => {
    setFormData({ ...formData, profilePic: file });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, DepartmentID, location } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !DepartmentID || !location) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profilePic) {
      alert("Please upload a profile picture.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("DepartmentID", formData.DepartmentID);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("profilePic", formData.profilePic);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/internSignUp`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      navigate("/thankyou");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to register");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="internSignupWrapper">
      <div className="internWaves" />
      <form className="Intern-signup-form">
        <div class="logo">
                      <img src={logo} alt="bizzNest Flow Logo" className="navbar-logo" />
                    </div>
        <h2 className="internSignupTitle">Intern Signup</h2>

        {step === 1 ? (
          <>
            <div className="internNameContainer">
              <input type="text" placeholder="First name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <input type="text" placeholder="Last name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <div className="internInputContainer">
              <img src={Mail} alt="Email" className="internInputIcon" />
              <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="internPasswordContainer">
              <div className="internInputContainer">
                <img src={Lock} alt="Password" className="internInputIcon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="internInputContainer">
                <img src={Lock} alt="Confirm Password" className="internInputIcon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <img
                  src={showPassword ? Visibility_Off : Visibility}
                  alt="Toggle Visibility"
                  className="internVisibilityIcon"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>

            <select name="DepartmentID" value={formData.DepartmentID} onChange={handleChange}>
              <option value="">Select a department</option>
              <option value="0">Web Development</option>
              <option value="1">Design</option>
              <option value="2">Video</option>
            </select>
            <select name="location" value={formData.location} onChange={handleChange}>
              <option value="">Select a location</option>
              <option value="Salinas">Salinas</option>
              <option value="Gilroy">Gilroy</option>
              <option value="Watsonville">Watsonville</option>
              <option value="Stockton">Stockton</option>
              <option value="Modesto">Modesto</option>
            </select>
            <button className="internSignupBttn" onClick={handleNext}>Next</button>
          </>
        ) : (
          <>
            <ProfilePictureUpload onFileSelect={handleProfilePicSelect} />
            <button className="internSignupBttn" onClick={handleSubmit}>Submit</button>
          </>
        )}
      </form>
    </div>
  );
};

export default InternSignup;