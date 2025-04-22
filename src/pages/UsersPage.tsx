
import { useState, useEffect } from "react";
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
import { User, UserRole } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const roles = ["all", "student", "teacher", "librarian"];

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (data && !error) {
        const usersFromDb = data.map((u: any) => ({
          ...u,
          imageUrl: u.avatar_url,
          createdAt: new Date(u.created_at),
        }));
        setUsers(usersFromDb);
        setDisplayedUsers(usersFromDb);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setDisplayedUsers(filtered);
  }, [users, filterRole, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (role: string) => {
    setFilterRole(role);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      toast({ title: "Error deleting user", description: error.message });
      return;
    }
    setUsers(users.filter((u) => u.id !== userId));
    setDisplayedUsers(displayedUsers.filter((u) => u.id !== userId));
    toast({ title: "User removed", description: "User has been deleted." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage students, teachers and librarians</p>
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
                  {role === "all"
                    ? "All Roles"
                    : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
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
            <UserCard key={user.id} user={user} onDelete={() => handleDeleteUser(user.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
