
import { useState } from "react";
import { BookForm } from "@/components/books/book-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Book } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/supabase-upload";
import { addBook } from "@/lib/data";

export default function AddBookPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBook = async (data: Partial<Book>) => {
    setIsSubmitting(true);
    console.log("Submitting book data:", data);

    try {
      let coverImageUrl = data.coverImageUrl || null;
      
      if (data.coverImageFile instanceof File) {
        const { url, error } = await uploadFile("books", data.coverImageFile);
        if (error) {
          console.error("Upload error:", error);
          toast({
            title: "Image Upload Failed",
            description: error.message,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        coverImageUrl = url;
      }

      // Prepare book data with the uploaded image URL
      const bookData = {
        ...data,
        coverImageUrl,
      };
      
      // Use the addBook function from data.ts to insert the book
      const insertedBook = await addBook(bookData);
      
      console.log("Book added successfully:", insertedBook);
      toast({
        title: "Success",
        description: "Book has been added successfully",
      });

      navigate("/books");
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
        <p className="text-muted-foreground">
          Add a new book to the library collection
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
          <CardDescription>
            Enter the details of the book to add it to the library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookForm onSubmit={handleAddBook} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
