
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IssueBookForm } from "@/components/books/issue-book-form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function IssueBookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        setBook({
          ...data,
          id: data.id,
          uniqueBookId: data.unique_book_id,
          publicationYear: data.publication_year,
          totalCopies: data.total_copies,
          availableCopies: data.available_copies,
          coverImageUrl: data.cover_image_url,
          addedAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        });
      } else {
        setBook(null);
      }
      setIsLoading(false);
    }
    fetchBook();
  }, [id]);

  const handleIssueBook = async (formData: any) => {
    if (!book) return;

    setIsSubmitting(true);

    const { error } = await supabase.from("book_issues").insert([
      {
        book_id: book.id,
        user_id: formData.userId,
        issue_date: formData.issueDate,
        return_date: formData.returnDate,
        status: "issued",
      },
    ]);
    if (error) {
      toast({
        title: "Error issuing book",
        description: error.message,
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Book issued",
      description: `"${book.title}" has been issued successfully.`,
    });

    setIsSubmitting(false);
    navigate("/books");
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
