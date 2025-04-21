
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Book,
  BookPlus,
  Users,
  UserPlus,
  Search,
  Menu,
  ArrowLeft,
  BookOpen
} from "lucide-react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">BookWise</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ArrowLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            <NavItem
              to="/books"
              icon={<Book />}
              label="Book Records"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/books/add"
              icon={<BookPlus />}
              label="Add Book"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/users"
              icon={<Users />}
              label="Users"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/users/register"
              icon={<UserPlus />}
              label="Register User"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/search"
              icon={<Search />}
              label="Search"
              isCollapsed={isCollapsed}
            />
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          {!isCollapsed && (
            <div className="flex flex-col">
              <span>BookWise LMS</span>
              <span>© 2025 Library System</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

function NavItem({ to, icon, label, isCollapsed }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-sidebar-accent text-foreground hover:text-sidebar-accent-foreground"
          )
        }
      >
        <div className="flex-shrink-0">{icon}</div>
        {!isCollapsed && <span>{label}</span>}
      </NavLink>
    </li>
  );
}
