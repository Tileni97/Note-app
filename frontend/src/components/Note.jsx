import React, { useState } from "react";
import "../styles/Note.css";
import NoteForm from "./NoteForm";

function Note({ note, onDelete, onEdit, onArchive, onPin }) {
  const [isEditing, setIsEditing] = useState(false);

  const formattedCreatedDate = new Date(note.created_at).toLocaleDateString(
    "en-US"
  );
  const formattedUpdatedDate = new Date(note.updated_at).toLocaleDateString(
    "en-US"
  );

  const handleEdit = (updatedNote) => {
    onEdit(note.slug, updatedNote);
    setIsEditing(false);
  };

  if (isEditing) {
    return <NoteForm onSubmit={handleEdit} initialValues={note} />;
  }

  return (
    <div
      className={`note-container ${note.is_archived ? "archived" : ""} ${
        note.is_pinned ? "pinned" : ""
      }`}
      style={{ backgroundColor: note.color }}
    >
      <p className="note-title">{note.title}</p>
      <p className="note-content">{note.content}</p>
      <p className="note-date">Created: {formattedCreatedDate}</p>
      <p className="note-date">Updated: {formattedUpdatedDate}</p>
      <p className="note-tags">
        Tags: {note.tags.map((tag) => tag.name).join(", ")}
      </p>
      <button className="delete-button" onClick={() => onDelete(note.slug)}>
        Delete
      </button>
      <button className="edit-button" onClick={() => setIsEditing(true)}>
        Edit
      </button>
      <button className="archive-button" onClick={() => onArchive(note.slug)}>
        {note.is_archived ? "Unarchive" : "Archive"}
      </button>
      <button className="pin-button" onClick={() => onPin(note.slug)}>
        {note.is_pinned ? "Unpin" : "Pin"}
      </button>
    </div>
  );
}

export default Note;
