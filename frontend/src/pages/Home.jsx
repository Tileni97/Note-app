import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useToast, toast } from "../components/hooks/use-toast"; // Import useToast here
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import api from "../api";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast(); // Now useToast is defined

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const res = await api.get("/api/notes/");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      toast({
        title: "Error",
        description: "Failed to fetch notes. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/notes/", { title, content });
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
      setTitle("");
      setContent("");
      getNotes();
    } catch (err) {
      console.error("Error creating note:", err);
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/api/notes/delete/${id}/`);
      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
      getNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Notes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
              <CardDescription>
                {new Date(note.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => deleteNote(note.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createNote} className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Note
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
