
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IssueBookForm } from "@/components/books/issue-book-form";
import { books } from "@/lib/data";
import { BookIssue, Book } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { generateId } from "@/lib/data";

export default function IssueBookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch book details
    const foundBook = books.find(b => b.id === id);
    setBook(foundBook || null);
    setIsLoading(false);
  }, [id]);

  const handleIssueBook = (data: Partial<BookIssue>) => {
    if (!book) return;
    
    setIsSubmitting(true);
    
    // In a real application, you would send this data to a server
    // For now, we'll simulate a server delay and success
    setTimeout(() => {
      // Create a new book issue with the form data
      const newIssue: BookIssue = {
        id: generateId(),
        bookId: book.id,
        uniqueBookId: book.uniqueBookId,
        userId: data.userId || "",
        issueDate: data.issueDate || new Date(),
        returnDate: data.returnDate || new Date(),
        status: "issued",
      };
      
      console.log("Book issued:", newIssue);
      
      // Show success message
      toast({
        title: "Book issued",
        description: `"${book.title}" has been issued successfully.`,
      });
      
      setIsSubmitting(false);
      
      // Redirect to books page
      navigate("/books");
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Book Not Found</h1>
        <p className="text-muted-foreground">
          The book you are looking for does not exist.
        </p>
      </div>
    );
  }

  if (book.availableCopies === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Book Not Available</h1>
        <p className="text-muted-foreground">
          This book is currently not available for issue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Issue Book</h1>
        <p className="text-muted-foreground">
          Fill in the details to issue "{book.title}" to a user
        </p>
      </div>

      <IssueBookForm
        book={book}
        onSubmit={handleIssueBook}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
