
import { useState, useEffect } from "react";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookPlus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);

  // Fetch books from Supabase
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        console.log("Fetching books from database...");
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching books:", error);
          toast({
            title: "Failed to load books",
            description: "Could not load books from the database. Please try again later.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        console.log("Books fetched:", data);
        
        if (!data || data.length === 0) {
          console.log("No books found in the database");
          setBooks([]);
          setDisplayedBooks([]);
          setCategories(["all"]);
          setLoading(false);
          return;
        }
        
        const booksFromDb = data.map((b: any) => ({
          id: b.id,
          uniqueBookId: b.unique_book_id,
          title: b.title,
          author: b.author,
          isbn: b.isbn,
          category: b.category,
          publicationYear: b.publication_year,
          publisher: b.publisher,
          totalCopies: b.total_copies,
          availableCopies: b.available_copies,
          coverImageUrl: b.cover_image_url,
          description: b.description,
          addedAt: new Date(b.created_at),
          updatedAt: new Date(b.updated_at || b.created_at),
        }));
        
        setBooks(booksFromDb);
        setDisplayedBooks(booksFromDb);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(booksFromDb.map((book) => book.category))
        );
        setCategories(["all", ...uniqueCategories]);
      } catch (err) {
        console.error("Unexpected error fetching books:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading books.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchBooks();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...books];
    
    if (filterCategory !== "all") {
      filtered = filtered.filter((book) => book.category === filterCategory);
    }
    
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.uniqueBookId.toLowerCase().includes(searchLower)
      );
    }
    
    setDisplayedBooks(filtered);
  }, [books, filterCategory, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (category: string) => {
    setFilterCategory(category);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">
            Manage your library book collection
          </p>
        </div>
        <Button asChild>
          <Link to="/books/add">
            <BookPlus className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by title, author, or ID"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-2 text-muted-foreground">Loading books…</p>
        </div>
      ) : displayedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-2 text-muted-foreground">No books found</p>
          <p className="text-sm text-muted-foreground">
            {books.length === 0 
              ? "Your library is empty. Start by adding some books."
              : "Try changing your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onIssue={(book) => window.location.href = `/books/${book.id}/issue`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
