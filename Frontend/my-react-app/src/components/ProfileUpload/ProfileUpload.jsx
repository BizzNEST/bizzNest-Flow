import React, { useState } from "react";

/**
 * ProfilePictureUpload Component
 * Allows users to upload a profile picture, shows a live preview,
 * and passes the selected file to the parent component via a callback.
 *
 * @param {Function} onFileSelect - Callback to send selected file to parent
 */
const ProfilePictureUpload = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);       // Preview image URL
  const [selectedFile, setSelectedFile] = useState(null); // Selected file object

  /**
   * Handles file input change event
   * Updates preview and notifies parent component with the file
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Generates preview URL
      onFileSelect(file); // Send file to parent component
    }
  };

  return (
    <div className="profile-upload-container">
      <h3>Upload Profile Picture</h3>

      {/* Image preview or fallback placeholder */}
      {preview ? (
        <img src={preview} alt="Profile Preview" className="profile-preview" />
      ) : (
        <div className="profile-placeholder">No image selected</div>
      )}

      {/* File input for image selection */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default ProfilePictureUpload;
