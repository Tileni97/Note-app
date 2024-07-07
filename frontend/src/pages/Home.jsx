import React, { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => {
        setNotes(res.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

  const deleteNote = (id) => {
    setLoading(true);
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          console.log("Note deleted successfully");
          getNotes(); // Refresh notes after deletion
        } else {
          console.error("Failed to delete note:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createNote = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/api/notes/", { title, content })
      .then((res) => {
        if (res.status === 201) {
          console.log("Note created successfully");
          setTitle("");
          setContent("");
          getNotes(); // Refresh notes after creation
        } else {
          console.error("Failed to create note:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error creating note:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="notes-section">
        <h2>Notes</h2>
        {loading ? (
          <LoadingIndicator />
        ) : (
          notes.map((note) => (
            <Note key={note.id} note={note} onDelete={deleteNote} />
          ))
        )}
      </div>
      <div className="form-section">
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
          <label htmlFor="title">Title</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <label htmlFor="content">Content</label>
          <br />
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <br />
          <button type="submit">Create Note</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
