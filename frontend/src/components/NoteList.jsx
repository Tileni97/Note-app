import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    getNotes();
  }, [filterTag, searchQuery, sortBy, sortOrder]);

  const getNotes = () => {
    let url = `/api/notes/?ordering=${
      sortOrder === "desc" ? "-" : ""
    }${sortBy}`;
    if (filterTag) url += `&tags__name=${filterTag}`;
    if (searchQuery) url += `&search=${searchQuery}`;

    api
      .get(url)
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

  const toggleArchive = (slug, currentState) => {
    api
      .put(`/api/notes/${slug}/archive/`, { is_archived: !currentState })
      .then(() => getNotes())
      .catch((err) => alert(err));
  };

  const togglePin = (slug, currentState) => {
    api
      .put(`/api/notes/${slug}/pin/`, { is_pinned: !currentState })
      .then(() => getNotes())
      .catch((err) => alert(err));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="my-8">
        <input
          type="text"
          placeholder="Search notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <input
          type="text"
          placeholder="Filter by tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        >
          <option value="created_at">Created At</option>
          <option value="updated_at">Updated At</option>
          <option value="title">Title</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {notes.map((note) => (
          <div
            key={note.slug}
            className="note-container border p-4 rounded shadow"
          >
            <p className="note-title font-bold">{note.title}</p>
            <p className="note-content">{note.content}</p>
            <p className="note-date text-gray-500">
              {new Date(note.created_at).toLocaleDateString("en-US")}
            </p>
            <button
              className="delete-button bg-red-500 text-white py-1 px-2 rounded mt-2"
              onClick={() => deleteNote(note.slug)}
            >
              Delete
            </button>
            <button
              className="archive-button bg-blue-500 text-white py-1 px-2 rounded mt-2 ml-2"
              onClick={() => toggleArchive(note.slug, note.is_archived)}
            >
              {note.is_archived ? "Unarchive" : "Archive"}
            </button>
            <button
              className="pin-button bg-yellow-500 text-white py-1 px-2 rounded mt-2 ml-2"
              onClick={() => togglePin(note.slug, note.is_pinned)}
            >
              {note.is_pinned ? "Unpin" : "Pin"}
            </button>
          </div>
        ))}
      </div>
      <Link
        to="/notes/new"
        className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 mt-8 inline-block"
      >
        Create Note
      </Link>
    </div>
  );
}

export default NoteList;
