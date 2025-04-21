
import { useState } from "react";
import { UserCard } from "@/components/users/user-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { allUsers } from "@/lib/data";
import { User, UserRole } from "@/lib/types";

export default function UsersPage() {
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(allUsers);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const roles = ["all", "student", "teacher", "librarian"];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      handleFilterChange(filterRole);
    } else {
      const filtered = allUsers.filter(user => {
        const matchesSearch = 
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase());
          
        const matchesRole = filterRole === "all" || user.role === filterRole;
        
        return matchesSearch && matchesRole;
      });
      
      setDisplayedUsers(filtered);
    }
  };

  const handleFilterChange = (role: string) => {
    setFilterRole(role);
    
    if (role === "all") {
      if (searchTerm) {
        const filtered = allUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedUsers(filtered);
      } else {
        setDisplayedUsers(allUsers);
      }
    } else {
      const filtered = allUsers.filter(user => {
        const matchesRole = user.role === role as UserRole;
        
        const matchesSearch = !searchTerm || 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
          
        return matchesRole && matchesSearch;
      });
      
      setDisplayedUsers(filtered);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage students, teachers and librarians
          </p>
        </div>
        <Button asChild>
          <Link to="/users/register">
            <UserPlus className="mr-2 h-4 w-4" />
            Register User
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterRole} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role === "all" ? "All Roles" : 
                   role.charAt(0).toUpperCase() + role.slice(1) + "s"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {displayedUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-2 text-muted-foreground">No users found</p>
          <p className="text-sm text-muted-foreground">
            Try changing your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
