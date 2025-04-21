
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
  onIssue?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export function BookCard({ book, className, onIssue, onEdit, onDelete }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <img
            src={book.coverImageUrl || "https://via.placeholder.com/200x300?text=No+Cover"}
            alt={`${book.title} cover`}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={isAvailable ? "default" : "destructive"}>
              {isAvailable ? `${book.availableCopies} Available` : "Unavailable"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold line-clamp-1 mb-1">
          {book.title}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p>By {book.author}</p>
          <p className="mt-1 text-xs">ID: {book.uniqueBookId}</p>
          <p className="text-xs">ISBN: {book.isbn}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2 justify-between">
        {onIssue && (
          <Button 
            size="sm" 
            disabled={!isAvailable}
            onClick={() => onIssue(book)}
          >
            Issue
          </Button>
        )}
        <div className="flex gap-2">
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(book)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(book)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
