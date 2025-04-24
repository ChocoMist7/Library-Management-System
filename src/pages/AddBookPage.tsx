import { useState } from "react";
import { BookForm } from "@/components/books/book-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Book } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/supabase-upload";
import { generateBookId } from "@/lib/data";

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

      const bookData = {
        unique_book_id: generateBookId(),
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        publication_year: data.publicationYear,
        publisher: data.publisher,
        total_copies: data.totalCopies || 1,
        available_copies: data.totalCopies || 1,
        cover_image_url: coverImageUrl,
        description: data.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Inserting book data:", bookData);
      
      const { data: insertedBook, error: insertError } = await supabase
        .from("books")
        .insert([bookData])
        .select();

      if (insertError) {
        console.error("Database error:", insertError);
        throw insertError;
      }

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
