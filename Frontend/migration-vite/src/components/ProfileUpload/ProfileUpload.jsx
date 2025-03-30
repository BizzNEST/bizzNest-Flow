import React, { useState } from "react";

const ProfilePictureUpload = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Show preview
      onFileSelect(file); // Pass the file to parent component
    }
  };

  return (
    <div className="profile-upload-container">
      <h3>Upload Profile Picture</h3>
      {preview ? (
        <img src={preview} alt="Profile Preview" className="profile-preview" />
      ) : (
        <div className="profile-placeholder">No image selected</div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export default ProfilePictureUpload;
