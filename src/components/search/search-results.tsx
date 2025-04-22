
import { useState, useEffect } from "react";
import { SearchResult } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type SearchResultsProps = {
  query: string;
};

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        // Search books
        const { data: bookData } = await supabase
          .from("books")
          .select("id, title, author, cover_image_url")
          .or(`title.ilike.%${query}%, author.ilike.%${query}%, isbn.ilike.%${query}%`)
          .limit(5);

        // Search users
        const { data: userData } = await supabase
          .from("profiles")
          .select("id, name, role, avatar_url")
          .or(`name.ilike.%${query}%, email.ilike.%${query}%`)
          .limit(5);

        const bookResults: SearchResult[] = (bookData || []).map((book: any) => ({
          type: "book",
          id: book.id,
          title: book.title,
          subtitle: `by ${book.author}`,
          imageUrl: book.cover_image_url,
        }));

        const userResults: SearchResult[] = (userData || []).map((user: any) => ({
          type: "user",
          id: user.id,
          title: user.name,
          subtitle: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`,
          imageUrl: user.avatar_url,
        }));

        setResults([...bookResults, ...userResults]);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleResultSelect = (result: SearchResult) => {
    if (result.type === "book") {
      navigate(`/books/${result.id}`);
    } else if (result.type === "user") {
      navigate(`/users/${result.id}`);
    }
  };

  return (
    <div className="p-1">
      {isSearching ? (
        <div className="flex items-center justify-center p-4">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : results.length === 0 ? (
        query.length >= 2 && (
          <div className="p-2 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )
      ) : (
        <div className="space-y-1">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              className="w-full rounded-md p-2 text-left hover:bg-accent"
              onClick={() => handleResultSelect(result)}
            >
              <div className="flex items-center gap-2">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                    {result.type === "book" ? "📚" : "👤"}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium">{result.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {result.subtitle}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
