import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    bio: "",
    profile_picture: null,
    gender: "",
    date_joined: "",
    last_login: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile/");
      setProfile(response.data);
    } catch (error) {
      setError("Error fetching profile.");
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original profile data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in profile) {
        if (key === "profile_picture" && profile[key] instanceof File) {
          formData.append(key, profile[key]);
        } else if (profile[key] !== null) {
          formData.append(key, profile[key]);
        }
      }
      await axios.patch("/api/user/profile/update/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleBack = () => navigate("/");

  const getAvatarUrl = (gender) => {
    const avatars = {
      M: "https://avatar.iran.liara.run/male",
      F: "https://avatar.iran.liara.run/female",
      O: "https://avatar.iran.liara.run/other",
    };
    return avatars[gender] || avatars.O;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <Select
              id="gender"
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </Select>
          </div>
          <div>
            <label
              htmlFor="profile_picture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <Input
              type="file"
              id="profile_picture"
              name="profile_picture"
              onChange={(e) =>
                setProfile({ ...profile, profile_picture: e.target.files[0] })
              }
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <img
            src={profile.profile_picture || getAvatarUrl(profile.gender)}
            alt="Avatar"
            className="w-32 h-32 object-cover rounded-full"
          />
          <p>
            <strong>Bio:</strong> {profile.bio || "No bio available"}
          </p>
          <p>
            <strong>Gender:</strong>{" "}
            {profile.gender === "M"
              ? "Male"
              : profile.gender === "F"
              ? "Female"
              : profile.gender === "O"
              ? "Other"
              : "Not specified"}
          </p>
          <p>
            <strong>Date Joined:</strong>{" "}
            {new Date(profile.date_joined).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Login:</strong>{" "}
            {new Date(profile.last_login).toLocaleDateString()}
          </p>
          <Button
            onClick={handleEdit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </Button>
        </div>
      )}
      <Button
        onClick={handleBack}
        className="bg-gray-300 px-4 py-2 rounded mt-4"
      >
        Back to Home
      </Button>
    </div>
  );
};

export default UserProfile;
