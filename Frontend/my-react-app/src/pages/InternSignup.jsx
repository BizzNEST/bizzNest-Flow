import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfilePictureUpload from "../components/ProfileUpload/ProfileUpload";
import Logo from "../assets/Logo.png";
import "./InternSignup.css";

const InternSignup = () => {
  const [step, setStep] = useState(1); // Track form step
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    DepartmentID: "",
    location: "",
    profilePic: null, // Holds the uploaded file
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to receive file from child component
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

    setStep(2); // Move to next step
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

  return (
    <div className="internSignupWrapper">
      <div className="internWaves" />
      <form className="Intern-signup-form">
        <div className="internLogoSignUp">
          <h1>Bizznest Flow</h1>
          <img src={Logo} alt="Logo" className="internSignupLogo" />
        </div>
        <h2 className="internSignupTitle">Intern Signup</h2>

        {step === 1 ? (
          <>
            <div className="internNameContainer">
              <input type="text" placeholder="First name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <input type="text" placeholder="Last name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
            <div className="internPasswordContainer">
              <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
              <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
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
      {/*<div className="internCircle" />*/}
    </div>
  );
};

export default InternSignup;
