
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, User, BookIssue } from "@/lib/types";
import { allUsers } from "@/lib/data";

interface IssueBookFormProps {
  book: Book;
  onSubmit: (data: Partial<BookIssue>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function IssueBookForm({
  book,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: IssueBookFormProps) {
  const [userId, setUserId] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [returnDate, setReturnDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 14))
      .toISOString()
      .split("T")[0]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userId) newErrors.userId = "User is required";
    if (!issueDate) newErrors.issueDate = "Issue date is required";
    if (!returnDate) newErrors.returnDate = "Return date is required";

    // Validate dates
    if (issueDate && returnDate) {
      const issue = new Date(issueDate);
      const returnD = new Date(returnDate);
      if (returnD <= issue) {
        newErrors.returnDate = "Return date must be after issue date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      bookId: book.id,
      uniqueBookId: book.uniqueBookId,
      userId,
      issueDate: new Date(issueDate),
      returnDate: new Date(returnDate),
      status: "issued",
    });
  };

  // Find user by ID
  const selectedUser = allUsers.find((user) => user.id === userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {book.author}
              </p>
              <p className="text-xs">ID: {book.uniqueBookId}</p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="userId"
                className={errors.userId ? "text-destructive" : ""}
              >
                Select User
              </Label>
              <Select
                value={userId}
                onValueChange={setUserId}
              >
                <SelectTrigger
                  id="userId"
                  className={errors.userId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {allUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.userId && (
                <p className="text-xs text-destructive">{errors.userId}</p>
              )}
            </div>

            {selectedUser && (
              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser.imageUrl}
                    alt={selectedUser.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{selectedUser.name}</h4>
                    <p className="text-sm capitalize">{selectedUser.role}</p>
                    {selectedUser.role === "student" && (
                      <p className="text-xs">
                        Roll: {(selectedUser as any).rollNumber}
                      </p>
                    )}
                    {selectedUser.role === "teacher" && (
                      <p className="text-xs">
                        ID: {(selectedUser as any).teacherId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="issueDate"
                  className={errors.issueDate ? "text-destructive" : ""}
                >
                  Issue Date
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className={errors.issueDate ? "border-destructive" : ""}
                />
                {errors.issueDate && (
                  <p className="text-xs text-destructive">{errors.issueDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="returnDate"
                  className={errors.returnDate ? "text-destructive" : ""}
                >
                  Return Date
                </Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={errors.returnDate ? "border-destructive" : ""}
                />
                {errors.returnDate && (
                  <p className="text-xs text-destructive">{errors.returnDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Issue Book
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
