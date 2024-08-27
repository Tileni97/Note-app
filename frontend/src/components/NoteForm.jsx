import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function NoteForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [color, setColor] = useState("#FFFFFF");

  useEffect(() => {
    if (slug && slug !== "new") {
      api.get(`/api/notes/${slug}/`).then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setTags(response.data.tags.map((tag) => tag.name));
        setColor(response.data.color);
      });
    }
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { title, content, tags, color };
    try {
      if (slug && slug !== "new") {
        await api.put(`/api/notes/${slug}/`, formData);
        alert("Note updated successfully!");
      } else {
        await api.post("/api/notes/", formData);
        alert("Note created successfully!");
      }
      navigate("/notes");
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded w-full px-3 py-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="border rounded w-full px-3 py-2 mt-1"
            rows="5"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((tag) => tag.trim()))
            }
            className="border rounded w-full px-3 py-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="color" className="block font-medium text-gray-700">
            Color
          </label>
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border rounded w-full px-3 py-2 mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600"
        >
          {id && id !== "new" ? "Update Note" : "Create Note"}
        </button>
      </form>
    </div>
  );
}

export default NoteForm;
