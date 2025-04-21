
import { useState } from "react";
import { BookForm } from "@/components/books/book-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Book } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { generateId } from "@/lib/data";

export default function AddBookPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBook = (data: Partial<Book>) => {
    setIsSubmitting(true);
    
    // In a real application, you would send this data to a server
    // For now, we'll simulate a server delay and success
    setTimeout(() => {
      // Create a new book with the form data
      const newBook: Book = {
        id: generateId(),
        uniqueBookId: data.uniqueBookId || "",
        title: data.title || "",
        author: data.author || "",
        isbn: data.isbn || "",
        category: data.category || "",
        publicationYear: data.publicationYear || new Date().getFullYear(),
        publisher: data.publisher || "",
        totalCopies: data.totalCopies || 1,
        availableCopies: data.totalCopies || 1,
        coverImageUrl: data.coverImageUrl || "",
        description: data.description,
        addedAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log("Book added:", newBook);
      
      // Show success message
      toast({
        title: "Book added",
        description: `"${newBook.title}" has been added to the library.`,
      });
      
      setIsSubmitting(false);
      
      // Redirect to books page
      navigate("/books");
    }, 1000);
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
