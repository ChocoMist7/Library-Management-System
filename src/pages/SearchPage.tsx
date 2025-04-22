
import { useSearchParams } from "react-router-dom";
import { SearchResults } from "@/components/search/search-results";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Search for books, users, and circulation records
        </p>
      </div>
      
      <SearchResults query={query} />
    </div>
  );
}
