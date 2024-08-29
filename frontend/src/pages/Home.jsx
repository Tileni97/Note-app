import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaThumbtack } from "react-icons/fa";
import api from "../api";
import NoteList from "../components/NoteList";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardContent } from "../components/ui/card";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllNotes();
    fetchUserProfile();
  }, []);

  const fetchAllNotes = async () => {
    try {
      const response = await api.get("/api/notes");
      setNotes(response.data);
    } catch (error) {
      setError("Failed to load notes. Please try again later.");
      console.error("Failed to fetch notes:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/user/profile/");
      setUserProfile(response.data);
    } catch (error) {
      setError("Failed to load user profile. Please try again later.");
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering directly instead of page reload
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  const pinnedNotes = useMemo(() => {
    return notes.filter((note) => note.is_pinned);
  }, [notes]);

  const recentNotes = useMemo(() => {
    return notes.filter((note) => !note.is_pinned).slice(0, 5);
  }, [notes]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Your Notes Dashboard
        </h1>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          userProfile && (
            <div className="mt-4 flex items-center">
              <img
                src={
                  userProfile.profile_picture ||
                  "https://avatar.iran.liara.run/public"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {userProfile.username}
                </p>
                <Link
                  to="/profile"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          )
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">
              Quick Actions
            </h2>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Link to="/notes/new">
              <Button className="w-full">
                <FaPlus className="mr-2" /> Create New Note
              </Button>
            </Link>
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" variant="secondary" className="ml-2">
                <FaSearch />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">Note Stats</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Total Notes:</span>
                <span className="font-semibold">{notes.length}</span>
              </li>
              <li className="flex justify-between">
                <span>Pinned Notes:</span>
                <span className="font-semibold">{pinnedNotes.length}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {pinnedNotes.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pinnedNotes.map((note) => (
              <Link key={note.id} to={`/notes/${note.slug}`}>
                <Card
                  className="h-full hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: note.color || "#ffffff" }}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {note.content.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                      <FaThumbtack />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Recent Notes
        </h2>
        <NoteList notes={recentNotes} />
      </section>

      {error && <div className="error-message text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Home;
