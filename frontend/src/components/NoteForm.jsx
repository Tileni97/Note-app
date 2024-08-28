import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import api from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardContent } from "../components/ui/card";

const NoteForm = ({ note, onSubmit }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");
  const [summary, setSummary] = useState(note?.summary || "");
  const [tags, setTags] = useState(note?.tags || []);
  const [color, setColor] = useState(note?.color || "#ffffff");
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Moved here
  const navigate = useNavigate();

  const handleColorChange = (color) => {
    setColor(color);
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("summary", summary);
    formData.append("tags", tags.join(","));
    formData.append("color", color);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await api.post("/api/notes/", formData);
      console.log("Form submitted successfully:", response.data);
      onSubmit(response.data);
      navigate(`/notes/${response.data.slug}`);
    } catch (err) {
      console.error("Form submission error:", err);
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/"); // Redirects to home page
  };

  const colorPalette = [
    "#f87171",
    "#fb923c",
    "#facc15",
    "#34d399",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
    "#fef3c7",
  ];

  useEffect(() => {
    // Dummy effect to simulate loading, remove or update as needed
    setIsLoading(false);
  }, []);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-700">
          {note ? "Edit Note" : "Create Note"}
        </h2>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Summary</label>
              <Input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                className="w-full h-32 border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Tags</label>
              <Input
                type="text"
                value={tags.join(", ")}
                onChange={(e) => setTags(e.target.value.split(", "))}
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Color</label>
              <div className="flex items-center space-x-2">
                {colorPalette.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleColorChange(col)}
                    className={`w-8 h-8 rounded-full`}
                    style={{
                      backgroundColor: col,
                      border: color === col ? "2px solid black" : "none",
                    }}
                  />
                ))}
              </div>
              <div
                className="mt-4 p-2 border rounded"
                style={{ backgroundColor: color }}
              >
                <p className="text-sm text-gray-800">Color Preview</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Attachment</label>
              <Input type="file" onChange={handleFileChange} />
            </div>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <div className="flex justify-between">
              <Button type="submit" className="w-1/2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Save Note"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="w-1/2 bg-gray-500 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteForm;
