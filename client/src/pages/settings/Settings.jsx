import React, { useState, useEffect } from "react";
import "./Settings.css";
import Navbar from "components/Navbar";
import { Link } from "react-router-dom";

const Settings = () => {
  // Form state for each field (controlled inputs)
  const [profilePic, setProfilePic] = useState(null); // File object or URL for preview
  const [previewPic, setPreviewPic] = useState(null); // Preview image URL
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("");

  // Load existing user data from backend on mount (simulate with dummy data here)
  useEffect(() => {
    async function fetchUserData() {
      // Replace with real backend request
      const userData = await fakeApiGetUser();
      setName(userData.name);
      setUsername(userData.username);
      setLanguage(userData.language);
      // Password left blank for security (user must enter new if desired)
      // Assume userData.profilePicUrl contains link to stored avatar
      setPreviewPic(userData.profilePicUrl);
    }
    fetchUserData();
  }, []);

  // Fake API get user function (replace)
  async function fakeApiGetUser() {
    return new Promise((res) =>
      setTimeout(
        () =>
          res({
            name: "Ayden",
            username: "ayden.user",
            language: "English",
            profilePicUrl: "/img/sampleprofile.jpg",
          }),
        500
      )
    );
  }

  // Handle profile picture selection and generate preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewPic(URL.createObjectURL(file)); // show preview immediately
  };

  // Handle form submission: send updated data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compose form data to send to backend, including file if new uploaded
    // Could use FormData if backend expects multipart/form-data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password); // could check if empty, skip if no change
    formData.append("language", language);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      // Replace with actual API call using fetch or axios
      await fakeApiUpdateUser(formData);
      alert("Profile updated successfully!");
      setPassword(""); // clear password field after success
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  // Simulated API update function (replace with real)
  async function fakeApiUpdateUser(data) {
    return new Promise((res) => setTimeout(() => res(true), 1000));
  }

  return (
    <div className="settings-page-wrap">
      <Link to="/">
        <img
          src="img/return.svg"
          alt="Back"
          className="settings-icon"
        />
      </Link>
      <div className="settings-main-container">
        <form className="settings-form" onSubmit={handleSubmit}>
          {/* Profile picture */}
          <div className="profile-pic-container">
            {previewPic ? (
              <img
                src={previewPic}
                alt="Profile Preview"
                className="profile-pic-preview"
              />
            ) : (
              <div className="profile-pic-placeholder">No Image</div>
            )}

            <input
              type="file"
              accept="image/*"
              id="profilePicInput"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
            <label htmlFor="profilePicInput" className="profile-pic-button">
              Change Picture
            </label>
          </div>

          {/* Text inputs */}
          <label>
            Name
            <input
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Username
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            Language
            <input
              type="text"
              value={language}
              placeholder="Language"
              onChange={(e) => setLanguage(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="save-button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
