import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  FaPlus,
  FaArchive,
  FaThumbtack,
  FaSearch,
  FaEdit,
} from "react-icons/fa";

function Home() {
  const [recentNotes, setRecentNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [stats, setStats] = useState({ total: 0, archived: 0, pinned: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchRecentNotes();
    fetchPinnedNotes();
    fetchStats();
    fetchUserProfile();
  }, []);

  const fetchRecentNotes = async () => {
    try {
      const response = await api.get(
        "/api/notes/?ordering=-updated_at&limit=5"
      );
      setRecentNotes(response.data);
    } catch (error) {
      console.error("Error fetching recent notes:", error);
    }
  };

  const fetchPinnedNotes = async () => {
    try {
      const response = await api.get(
        "/api/notes/?is_pinned=true&ordering=-updated_at&limit=3"
      );
      setPinnedNotes(response.data);
    } catch (error) {
      console.error("Error fetching pinned notes:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/notes/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/user/profile/");
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/notes?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Your Notes</h1>

      {/* User Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
        {userProfile && (
          <div className="flex items-center">
            <img
              src={
                userProfile.profile_picture || "https://via.placeholder.com/100"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full mr-4"
            />
            <div>
              <p>
                <strong>Username:</strong> {userProfile.username}
              </p>
              <p>
                <strong>Bio:</strong> {userProfile.bio}
              </p>
              <Link
                to="/profile"
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center inline-block"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link
          to="/notes/new"
          className="bg-blue-500 text-white p-4 rounded-lg flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> New Note
        </Link>
        <Link
          to="/notes?is_archived=true"
          className="bg-gray-500 text-white p-4 rounded-lg flex items-center justify-center"
        >
          <FaArchive className="mr-2" /> Archived Notes
        </Link>
        <Link
          to="/notes?is_pinned=true"
          className="bg-yellow-500 text-white p-4 rounded-lg flex items-center justify-center"
        >
          <FaThumbtack className="mr-2" /> Pinned Notes
        </Link>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow border rounded-l-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-r-lg"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Notes at a Glance</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-gray-600">Total Notes</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.archived}</p>
            <p className="text-gray-600">Archived Notes</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.pinned}</p>
            <p className="text-gray-600">Pinned Notes</p>
          </div>
        </div>
      </div>

      {/* Pinned Notes */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pinned Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pinnedNotes.map((note) => (
            <Link key={note.id} to={`/notes/${note.slug}`} className="block">
              <div
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                style={{ backgroundColor: note.color }}
              >
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-sm text-gray-600">
                  {note.content.substring(0, 100)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Notes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Notes</h2>
        <div className="space-y-4">
          {recentNotes.map((note) => (
            <Link key={note.id} to={`/notes/${note.slug}`} className="block">
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-sm text-gray-600">
                  {note.content.substring(0, 150)}...
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </span>
                  <FaEdit />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
