import React from "react";
import "../styles/Note.css";

function Note({ note, onDelete }) {
  const formattedDate = new Date(note.date).toLocaleDateString("en-NAM");

  return (
    <div className="note-container">
      <p className="note-title">{note.title}</p>
      <p className="note-content"> {note.content}</p>
      <p className="note-date">{formattedDate}</p>
      <button className="delet-button" onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </div>
  );
}

export default Note;
