
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

    try {
      let coverImageUrl = data.coverImageUrl || null;
      
      // If there's a file to upload
      if (data.coverImageFile instanceof File) {
        try {
          const { url, error } = await uploadFile("books", data.coverImageFile);
          if (error) {
            console.error("Upload error details:", error);
            toast({
              title: "Image Upload Failed",
              description: `Could not upload the book cover image: ${error.message}`,
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
          coverImageUrl = url;
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast({
            title: "Image Upload Failed",
            description: "Could not upload the book cover image. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      const uniqueBookId = data.uniqueBookId || generateBookId();

      const bookData = {
        unique_book_id: uniqueBookId,
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
      };

      const { error } = await supabase.from("books").insert([bookData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Book Added",
        description: `${data.title} has been successfully added to the library.`,
      });

      navigate("/books");
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Failed to Add Book",
        description: "An error occurred while adding the book. Please check your internet connection and try again.",
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
