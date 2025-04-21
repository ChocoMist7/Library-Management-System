
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Student, Teacher, Librarian, User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: User;
  className?: string;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserCard({ user, className, onEdit, onDelete }: UserCardProps) {
  // Determine user-specific details based on role
  let roleSpecificDetails = null;
  
  if (user.role === "student") {
    const student = user as Student;
    roleSpecificDetails = (
      <>
        <p><span className="font-medium">Roll Number:</span> {student.rollNumber}</p>
        <p><span className="font-medium">Degree:</span> {student.degree}</p>
        <p><span className="font-medium">Stream:</span> {student.stream}</p>
      </>
    );
  } else if (user.role === "teacher") {
    const teacher = user as Teacher;
    roleSpecificDetails = (
      <>
        <p><span className="font-medium">Teacher ID:</span> {teacher.teacherId}</p>
        <p><span className="font-medium">Department:</span> {teacher.department}</p>
      </>
    );
  } else if (user.role === "librarian") {
    const librarian = user as Librarian;
    roleSpecificDetails = (
      <>
        <p><span className="font-medium">Staff ID:</span> {librarian.staffId}</p>
      </>
    );
  }

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="p-0">
        <div className="relative h-40 w-full bg-muted">
          <img
            src={user.imageUrl || "https://via.placeholder.com/200x200?text=No+Image"}
            alt={`${user.name} avatar`}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="font-semibold text-lg text-white">{user.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline"
                className={cn(
                  "text-white border-white",
                  user.role === "student" && "bg-blue-600/50",
                  user.role === "teacher" && "bg-green-600/50",
                  user.role === "librarian" && "bg-purple-600/50"
                )}
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <p><span className="font-medium">Email:</span> {user.email}</p>
        {roleSpecificDetails}
      </CardContent>
      {(onEdit || onDelete) && (
        <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(user)}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
