import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  FaArchive,
  FaThumbtack,
  FaTrash,
  FaEdit,
  FaEye,
  FaSpinner,
} from "react-icons/fa";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [filterTags, setFilterTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getNotes();
  }, [filterTags, searchQuery, sortBy, sortOrder]);

  const getNotes = async () => {
    setLoading(true);
    let url = `/api/notes/?ordering=${
      sortOrder === "desc" ? "-" : ""
    }${sortBy}`;
    if (filterTags.length) url += `&tags__name=${filterTags.join(",")}`;
    if (searchQuery) url += `&search=${searchQuery}`;

    try {
      const response = await api.get(url);
      if (Array.isArray(response.data.results)) {
        setNotes(response.data.results);
      } else {
        console.error("Unexpected data structure:", response.data);
        setNotes([]);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      alert("Error fetching notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilterTags([]);
    setSearchQuery("");
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleTagChange = (e) => {
    setFilterTags(
      e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    );
  };

  const handleSortChange = (value) => {
    const [by, order] = value.split(":");
    setSortBy(by);
    setSortOrder(order);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtering and sorting inputs */}
      <div className="mb-8">
        <Button onClick={handleToggleFilters} className="mb-4">
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        {showFilters && (
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700">Search</label>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
              />
            </div>
            <div>
              <label className="block text-gray-700">Tags</label>
              <Input
                type="text"
                value={filterTags.join(", ")}
                onChange={handleTagChange}
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div>
              <label className="block text-gray-700">Sort By</label>
              <Select
                onValueChange={handleSortChange}
                defaultValue="created_at:desc"
              >
                <SelectTrigger>
                  <SelectValue>Sort by</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at:desc">
                    Date Created (Newest First)
                  </SelectItem>
                  <SelectItem value="created_at:asc">
                    Date Created (Oldest First)
                  </SelectItem>
                  <SelectItem value="title:asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title:desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => (
            <Card
              key={note.slug}
              className="relative flex flex-col hover:shadow-lg transition-shadow"
              style={{ borderColor: note.color }}
            >
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                <p className="mb-2">
                  {note.content && note.content.length > 100 ? (
                    <>
                      {note.content.substring(0, 100)}...
                      <Link
                        to={`/notes/${note.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        Read more
                      </Link>
                    </>
                  ) : (
                    note.content
                  )}
                </p>
                <div className="mt-2">
                  {note.tags &&
                    Array.isArray(note.tags) &&
                    note.tags.map((tag) => (
                      <Badge key={tag.id} className="mr-1">
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm" title="View Note">
                  <Link to={`/notes/${note.slug}`}>
                    <FaEye className="mr-2" /> View
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" title="Edit Note">
                  <Link to={`/notes/${note.slug}/edit`}>
                    <FaEdit className="mr-2" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Archive Note"
                  onClick={() =>
                    confirm("Are you sure you want to archive this note?") &&
                    console.log("Archive Note")
                  }
                >
                  <FaArchive className="mr-2" /> Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Delete Note"
                  onClick={() =>
                    confirm("Are you sure you want to delete this note?") &&
                    console.log("Delete Note")
                  }
                >
                  <FaTrash className="mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Button asChild className="mt-8">
        <Link to="/notes/new">Create Note</Link>
      </Button>
    </div>
  );
}

export default NoteList;
