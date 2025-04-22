
import { useState } from "react";
import { BookForm } from "@/components/books/book-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Book } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateBookId } from "@/lib/data";
import { uploadFile } from "@/lib/supabase-upload";

export default function AddBookPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBook = async (data: Partial<Book>) => {
    setIsSubmitting(true);

    let coverImageUrl = "";
    // Handle image upload if there's a file
    if (data.coverImageFile) {
      const { url, error: uploadError } = await uploadFile("book-covers", data.coverImageFile);
      if (uploadError) {
        toast({
          title: "Image upload failed",
          description: uploadError.message,
        });
        setIsSubmitting(false);
        return;
      }
      coverImageUrl = url;
    }

    // Insert new book into Supabase
    const { error } = await supabase.from("books").insert([
      {
        unique_book_id: data.uniqueBookId || generateBookId(),
        title: data.title || "",
        author: data.author || "",
        isbn: data.isbn || "",
        category: data.category || "",
        publication_year: data.publicationYear || new Date().getFullYear(),
        publisher: data.publisher || "",
        total_copies: data.totalCopies || 1,
        available_copies: data.totalCopies || 1,
        cover_image_url: coverImageUrl,
        description: data.description,
      },
    ]);

    if (error) {
      toast({
        title: "Error adding book",
        description: error.message,
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Book added",
      description: `"${data.title}" has been added to the library.`,
    });

    setIsSubmitting(false);
    navigate("/books");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
        <p className="text-muted-foreground">
          Add a new book to your library collection
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
          <CardDescription>
            Enter the details of the book you want to add to the library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookForm onSubmit={handleAddBook} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
