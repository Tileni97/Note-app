import React, { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    getNotes();
  }, [showArchived]);

  const getNotes = () => {
    setLoading(true);
    api
      .get(`/api/notes/?is_archived=${showArchived}&search=${searchTerm}`)
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes:", err))
      .finally(() => setLoading(false));
  };

  const createNote = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/api/notes/", { title, content, tags })
      .then(() => {
        getNotes();
        setTitle("");
        setContent("");
        setTags("");
      })
      .catch((err) => console.error("Error creating note:", err))
      .finally(() => setLoading(false));
  };

  const deleteNote = (id) => {
    setLoading(true);
    api
      .delete(`/api/notes/${id}/`)
      .then(() => getNotes())
      .catch((err) => console.error("Error deleting note:", err))
      .finally(() => setLoading(false));
  };

  const editNote = (id, updatedNote) => {
    setLoading(true);
    api
      .put(`/api/notes/${id}/`, updatedNote)
      .then(() => getNotes())
      .catch((err) => console.error("Error updating note:", err))
      .finally(() => setLoading(false));
  };

  const archiveNote = (id) => {
    setLoading(true);
    api
      .put(`/api/notes/${id}/archive/`)
      .then(() => getNotes())
      .catch((err) => console.error("Error archiving note:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="home-container">
      <h1>My Notes</h1>
      <Link to="/profile">View Profile</Link>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={getNotes}>Search</button>
      </div>
      <button onClick={() => setShowArchived(!showArchived)}>
        {showArchived ? "Show Active" : "Show Archived"}
      </button>
      <form onSubmit={createNote} className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Create Note</button>
      </form>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onEdit={editNote}
              onArchive={archiveNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
