import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import moment from "moment";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

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
      <Card className="mt-8" style={{ backgroundColor: note.color }}>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
          <p className="mb-4">{note.content}</p>
          <div className="mb-4">
            {note.tags.map((tag) => (
              <Badge key={tag.id} className="mr-2">
                {tag.name}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Last updated:{" "}
            {moment(note.updated_at).format("MMMM Do YYYY, h:mm:ss a")}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => navigate(`/notes/${slug}/edit`)}
            variant="outline"
          >
            Edit
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
          <Button onClick={handleToggleArchive} variant="secondary">
            {note.is_archived ? "Unarchive" : "Archive"}
          </Button>
          <Button onClick={handleTogglePin} variant="secondary">
            {note.is_pinned ? "Unpin" : "Pin"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default NoteDetail;
