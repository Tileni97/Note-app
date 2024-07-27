import React, { useState, useEffect } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/user/profile/");
      setProfile(response.data);
      setBio(response.data.profile?.bio || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("profile.bio", bio);
    if (profilePicture) {
      formData.append("profile.profile_picture", profilePicture);
    }

    try {
      await api.patch("/api/user/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={profile.username} disabled />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={profile.email} disabled />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="profile-picture">Profile Picture:</label>
          <input
            type="file"
            id="profile-picture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
        {profile.profile?.profile_picture && (
          <img src={profile.profile.profile_picture} alt="Profile" />
        )}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default UserProfile;
