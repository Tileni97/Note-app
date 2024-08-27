import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile/");
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/user/profile/update/", editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bio" className="block mb-1">
              Bio:
            </label>
            <textarea
              id="bio"
              name="bio"
              value={editedProfile.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="profile_picture" className="block mb-1">
              Profile Picture URL:
            </label>
            <input
              type="text"
              id="profile_picture"
              name="profile_picture"
              value={editedProfile.profile_picture}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p>
            <strong>Bio:</strong> {profile.bio}
          </p>
          <p>
            <strong>Profile Picture:</strong>
          </p>
          <img
            src={profile.profile_picture}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full"
          />
          <p>
            <strong>Date Joined:</strong>{" "}
            {new Date(profile.date_joined).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Login:</strong>{" "}
            {new Date(profile.last_login).toLocaleDateString()}
          </p>
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
