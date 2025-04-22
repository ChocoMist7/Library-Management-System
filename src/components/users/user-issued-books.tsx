
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Book, BookIssue } from "@/lib/types";

interface UserIssuedBooksProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export function UserIssuedBooks({ userId, userName, onClose }: UserIssuedBooksProps) {
  const [issues, setIssues] = useState<(BookIssue & { title?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIssued() {
      setLoading(true);
      // Join book_issues and books
      const { data, error } = await supabase
        .from("book_issues")
        .select("*, books (title, unique_book_id)")
        .eq("user_id", userId)
        .order("issue_date", { ascending: false });
      if (!error && data) {
        setIssues(
          data.map((row: any) => ({
            ...row,
            title: row.books?.title,
            uniqueBookId: row.books?.unique_book_id,
            returnDate: row.return_date,
            status: row.status,
          }))
        );
      }
      setLoading(false);
    }
    fetchIssued();
  }, [userId]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userName}'s Issued Books</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Loading...</div>
        ) : issues.length === 0 ? (
          <div>No books are currently issued to this user.</div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between p-2 border-b"
              >
                <div>
                  <div className="font-semibold">{issue.title}</div>
                  <div className="text-xs text-muted-foreground">ID: {issue.uniqueBookId}</div>
                  <div className="text-xs">
                    Status: {issue.status}{' '}
                    {issue.status === "issued" && (
                      <>
                        <br />
                        To return by <span className="font-medium">{new Date(issue.returnDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
