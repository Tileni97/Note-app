import React, { useState } from "react";
import "../styles/Note.css";

function Note({ note, onDelete, onEdit, onArchive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedTags, setEditedTags] = useState(note.tags);

  const handleSave = () => {
    onEdit(note.id, {
      title: editedTitle,
      content: editedContent,
      tags: editedTags,
    });
    setIsEditing(false);
  };

  return (
    <div className={`note-container ${note.is_archived ? "archived" : ""}`}>
      {isEditing ? (
        <>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <input
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            placeholder="Tags (comma-separated)"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <p>Tags: {note.tags}</p>
          <p>Created: {new Date(note.created_at).toLocaleString()}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(note.id)}>Delete</button>
          <button onClick={() => onArchive(note.id)}>
            {note.is_archived ? "Unarchive" : "Archive"}
          </button>
        </>
      )}
    </div>
  );
}

export default Note;
