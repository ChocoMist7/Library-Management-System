
import { useState } from "react";
import { books } from "@/lib/data";
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

export default function BooksPage() {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>(books);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = ["all", ...Array.from(new Set(books.map(book => book.category)))];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      handleFilterChange(filterCategory);
    } else {
      const filtered = books.filter(book => {
        const matchesSearch = 
          book.title.toLowerCase().includes(term.toLowerCase()) ||
          book.author.toLowerCase().includes(term.toLowerCase()) ||
          book.uniqueBookId.toLowerCase().includes(term.toLowerCase());
          
        const matchesCategory = filterCategory === "all" || book.category === filterCategory;
        
        return matchesSearch && matchesCategory;
      });
      
      setDisplayedBooks(filtered);
    }
  };

  const handleFilterChange = (category: string) => {
    setFilterCategory(category);
    
    if (category === "all") {
      if (searchTerm) {
        const filtered = books.filter(book => 
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.uniqueBookId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedBooks(filtered);
      } else {
        setDisplayedBooks(books);
      }
    } else {
      const filtered = books.filter(book => {
        const matchesCategory = book.category === category;
        
        const matchesSearch = !searchTerm || 
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.uniqueBookId.toLowerCase().includes(searchTerm.toLowerCase());
          
        return matchesCategory && matchesSearch;
      });
      
      setDisplayedBooks(filtered);
    }
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

      {displayedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-2 text-muted-foreground">No books found</p>
          <p className="text-sm text-muted-foreground">
            Try changing your search or filter criteria
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
