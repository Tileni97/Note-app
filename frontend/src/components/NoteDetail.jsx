import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import moment from "moment";

function NoteDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    api.get(`/api/notes/${slug}/`).then((response) => {
      setNote(response.data);
    });
  }, [slug]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/notes/${slug}/`);
      alert("Note deleted successfully!");
      navigate("/notes");
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the note");
    }
  };

  const handleToggleArchive = async () => {
    try {
      const response = await api.put(`/api/notes/${slug}/archive/`, {
        is_archived: !note.is_archived,
      });
      setNote(response.data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while archiving/unarchiving the note");
    }
  };

  const handleTogglePin = async () => {
    try {
      const response = await api.put(`/api/notes/${slug}/pin/`, {
        is_pinned: !note.is_pinned,
      });
      setNote(response.data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while pinning/unpinning the note");
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        style={{ backgroundColor: note.color }}
      >
        <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
        <p className="mb-4">{note.content}</p>
        <div className="mb-4">
          {note.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Last updated:{" "}
          {moment(note.updated_at).format("MMMM Do YYYY, h:mm:ss a")}
        </p>
        <div className="mt-4">
          <button
            onClick={() => navigate(`/notes/${slug}/edit`)}
            className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white font-medium py-2 px-4 rounded hover:bg-red-600 mr-2"
          >
            Delete
          </button>
          <button
            onClick={handleToggleArchive}
            className="bg-gray-500 text-white font-medium py-2 px-4 rounded hover:bg-gray-600 mr-2"
          >
            {note.is_archived ? "Unarchive" : "Archive"}
          </button>
          <button
            onClick={handleTogglePin}
            className="bg-yellow-500 text-white font-medium py-2 px-4 rounded hover:bg-yellow-600"
          >
            {note.is_pinned ? "Unpin" : "Pin"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteDetail;
