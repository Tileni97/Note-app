import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getNotes();
  }, [showArchived, searchTerm]);

  const getNotes = () => {
    api
      .get(`/api/notes/?is_archived=${showArchived}&search=${searchTerm}`)
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (slug) => {
    api
      .delete(`/api/notes/${slug}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => ({ name: tag.trim() }));
    api
      .post("/api/notes/", { content, title, tags: tagsArray, color })
      .then((res) => {
        if (res.status === 201) alert("Note created!");
        else alert("Failed to make note.");
        getNotes();
        setContent("");
        setTitle("");
        setTags("");
        setColor("#FFFFFF");
      })
      .catch((err) => alert(err));
  };

  const editNote = (slug, updatedNote) => {
    api
      .put(`/api/notes/${slug}/`, updatedNote)
      .then(() => {
        alert("Note updated!");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const archiveNote = (slug) => {
    api
      .put(`/api/notes/${slug}/archive/`)
      .then(() => {
        alert("Note archive status changed!");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const pinNote = (slug) => {
    api
      .put(`/api/notes/${slug}/pin/`)
      .then(() => {
        alert("Note pin status changed!");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button onClick={() => setShowArchived(!showArchived)}>
        {showArchived ? "Show Active" : "Show Archived"}
      </button>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note
            note={note}
            onDelete={deleteNote}
            onEdit={editNote}
            onArchive={archiveNote}
            onPin={pinNote}
            key={note.id}
          />
        ))}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <label htmlFor="tags">Tags (comma-separated):</label>
        <br />
        <input
          type="text"
          id="tags"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <br />
        <label htmlFor="color">Color:</label>
        <br />
        <input
          type="color"
          id="color"
          name="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default Home;
