
import { Book, User, BookIssue, SearchResult } from "@/lib/types";
import { books, allUsers, bookIssues } from "@/lib/data";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Book as BookIcon, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  initialQuery?: string;
}

export function SearchResults({ initialQuery = "" }: SearchResultsProps) {
  const [query, setQuery] = useState(initialQuery || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    const searchLower = searchTerm.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Search in books
    books.forEach(book => {
      const matchesTitle = book.title.toLowerCase().includes(searchLower);
      const matchesAuthor = book.author.toLowerCase().includes(searchLower);
      const matchesId = book.uniqueBookId.toLowerCase().includes(searchLower);
      const matchesIsbn = book.isbn.toLowerCase().includes(searchLower);
      
      if (matchesTitle || matchesAuthor || matchesId || matchesIsbn) {
        foundResults.push({
          type: "book",
          id: book.id,
          title: book.title,
          subtitle: `by ${book.author}`,
          imageUrl: book.coverImageUrl
        });
      }
    });

    // Search in users
    allUsers.forEach(user => {
      const matchesName = user.name.toLowerCase().includes(searchLower);
      const matchesEmail = user.email.toLowerCase().includes(searchLower);
      
      let matchesSpecificField = false;
      if (user.role === "student") {
        const student = user as any;
        matchesSpecificField = 
          student.rollNumber?.toLowerCase().includes(searchLower) ||
          student.degree?.toLowerCase().includes(searchLower) ||
          student.stream?.toLowerCase().includes(searchLower);
      } else if (user.role === "teacher") {
        const teacher = user as any;
        matchesSpecificField = 
          teacher.teacherId?.toLowerCase().includes(searchLower) ||
          teacher.department?.toLowerCase().includes(searchLower);
      } else if (user.role === "librarian") {
        const librarian = user as any;
        matchesSpecificField = 
          librarian.staffId?.toLowerCase().includes(searchLower);
      }
      
      if (matchesName || matchesEmail || matchesSpecificField) {
        foundResults.push({
          type: "user",
          id: user.id,
          title: user.name,
          subtitle: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`,
          imageUrl: user.imageUrl
        });
      }
    });

    // Search in book issues
    bookIssues.forEach(issue => {
      const book = books.find(b => b.id === issue.bookId);
      const user = allUsers.find(u => u.id === issue.userId);
      
      const matchesBookId = issue.uniqueBookId.toLowerCase().includes(searchLower);
      const matchesUserId = user?.name.toLowerCase().includes(searchLower) || false;
      const matchesStatus = issue.status.toLowerCase().includes(searchLower);
      
      if (matchesBookId || matchesUserId || matchesStatus) {
        foundResults.push({
          type: "issue",
          id: issue.id,
          title: book?.title || "Unknown Book",
          subtitle: `Issued to ${user?.name || "Unknown User"} - ${issue.status}`,
          imageUrl: book?.coverImageUrl
        });
      }
    });

    setResults(foundResults);
    setIsSearching(false);
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search books, users, issues..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        {results.length === 0 && query && !isSearching ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              No results found for "{query}"
            </p>
          </div>
        ) : (
          <>
            {results.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Found {results.length} results for "{query}"
              </p>
            )}
            <ul className="space-y-2">
              {results.map((result) => (
                <SearchResultItem key={`${result.type}-${result.id}`} result={result} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function SearchResultItem({ result }: { result: SearchResult }) {
  let linkPath = "/";
  let icon = <BookIcon className="h-4 w-4" />;
  
  switch (result.type) {
    case "book":
      linkPath = `/books/${result.id}`;
      icon = <BookIcon className="h-4 w-4" />;
      break;
    case "user":
      linkPath = `/users/${result.id}`;
      icon = <UserIcon className="h-4 w-4" />;
      break;
    case "issue":
      linkPath = `/issues/${result.id}`;
      icon = <BookIcon className="h-4 w-4" />;
      break;
  }
  
  return (
    <li>
      <Link
        to={linkPath}
        className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors"
      >
        <div 
          className={cn(
            "h-12 w-12 rounded flex items-center justify-center",
            result.type === "book" ? "bg-blue-100 text-blue-600" : 
            result.type === "user" ? "bg-green-100 text-green-600" :
            "bg-amber-100 text-amber-600"
          )}
        >
          {result.imageUrl ? (
            <img 
              src={result.imageUrl} 
              alt={result.title}
              className="h-full w-full object-cover rounded"
            />
          ) : (
            <div className="h-6 w-6">{icon}</div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{result.title}</h3>
          <p className="text-sm text-muted-foreground">{result.subtitle}</p>
        </div>
        
        <div className="flex items-center">
          <span className={cn(
            "inline-block px-2 py-1 text-xs rounded-full",
            result.type === "book" ? "bg-blue-100 text-blue-600" : 
            result.type === "user" ? "bg-green-100 text-green-600" :
            "bg-amber-100 text-amber-600"
          )}>
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </span>
        </div>
      </Link>
    </li>
  );
}
