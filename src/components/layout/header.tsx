
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={cn("w-full bg-background shadow-sm z-30", className)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 md:gap-x-4">
            <Link to="/" className="hidden md:flex items-center gap-2">
              <span className="font-bold text-xl">BookWise</span>
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl mx-4 relative"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search books, users, issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/help">Help</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
