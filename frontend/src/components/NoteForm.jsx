import React, { useState } from "react";

function NoteForm({ onSubmit, initialValues = {} }) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [content, setContent] = useState(initialValues.content || "");
  const [tags, setTags] = useState(
    initialValues.tags?.map((tag) => tag.name).join(", ") || ""
  );
  const [color, setColor] = useState(initialValues.color || "#FFFFFF");
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => ({ name: tag.trim() }));
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tagsArray));
    formData.append("color", color);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="content">Content:</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>

      <label htmlFor="tags">Tags (comma-separated):</label>
      <input
        type="text"
        id="tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <label htmlFor="color">Color:</label>
      <input
        type="color"
        id="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <label htmlFor="attachments">Attachments:</label>
      <input
        type="file"
        id="attachments"
        multiple
        onChange={handleFileChange}
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default NoteForm;
