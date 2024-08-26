import { useState, useEffect, useCallback } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import NoteForm from "../components/NoteForm";

function Home() {
  const [notes, setNotes] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const getNotes = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/notes/?is_archived=${showArchived}&search=${searchTerm}`)
      .then((res) => {
        console.log("Response data:", res.data);
        const data = res.data;
        if (Array.isArray(data.results)) {
          setNotes(data.results);
        } else {
          console.error("API response is not an array:", data);
          setNotes([]);
        }
      })
      .catch((err) => {
        alert("Failed to fetch notes.");
        console.error(err);
        setNotes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showArchived, searchTerm]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const deleteNote = useCallback(
    (slug) => {
      api
        .delete(`/api/notes/${slug}/`)
        .then((res) => {
          if (res.status === 204) alert("Note deleted!");
          else alert("Failed to delete note.");
          getNotes();
        })
        .catch((error) => alert(error));
    },
    [getNotes]
  );

  const editNote = useCallback(
    (slug, updatedNote) => {
      api
        .put(`/api/notes/${slug}/`, updatedNote)
        .then(() => {
          alert("Note updated!");
          getNotes();
        })
        .catch((err) => {
          console.error(
            "Update error:",
            err.response ? err.response.data : err.message
          );
          alert("Failed to update note. Check console for details.");
        });
    },
    [getNotes]
  );

  const archiveNote = useCallback(
    (slug) => {
      api
        .put(`/api/notes/${slug}/archive/`)
        .then(() => {
          alert("Note archive status changed!");
          getNotes();
        })
        .catch((err) => alert("Archive request failed: " + err.response.data));
    },
    [getNotes]
  );

  const pinNote = useCallback(
    (slug) => {
      api
        .put(`/api/notes/${slug}/pin/`)
        .then(() => {
          alert("Note pin status changed!");
          getNotes();
        })
        .catch((err) => {
          console.error("Pin request failed:", err.response);
          alert("Failed to pin note.");
        });
    },
    [getNotes]
  );

  const handleCreateNote = (noteData) => {
    api
      .post("/api/notes/", noteData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Note created!");
          getNotes();
        } else {
          alert("Failed to create note.");
        }
      })
      .catch((err) => {
        console.error("Error creating note:", err);
        alert("Failed to create note. Check console for details.");
      });
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
        {loading ? (
          <p>Loading...</p>
        ) : (
          notes.map((note) => (
            <Note
              note={note}
              onDelete={deleteNote}
              onEdit={editNote}
              onArchive={archiveNote}
              onPin={pinNote}
              key={note.id}
            />
          ))
        )}
      </div>
      <h2>Create a Note</h2>
      <NoteForm onSubmit={handleCreateNote} />
    </div>
  );
}

export default Home;
