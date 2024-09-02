import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";

function Note({ note, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{note.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{note.content}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(note.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Note;
