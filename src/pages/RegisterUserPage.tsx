
import { useState } from "react";
import { UserForm } from "@/components/users/user-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

export default function RegisterUserPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterUser = (data: Partial<User>) => {
    setIsSubmitting(true);
    
    // In a real application, you would send this data to a server
    // For now, we'll simulate a server delay and success
    setTimeout(() => {
      // Log the new user
      console.log("User registered:", data);
      
      // Show success message
      toast({
        title: "User registered",
        description: `${data.name} has been successfully registered.`,
      });
      
      setIsSubmitting(false);
      
      // Redirect to users page
      navigate("/users");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Register User</h1>
        <p className="text-muted-foreground">
          Register a new student, teacher, or librarian
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            Select a role and enter the user details to register them in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm onSubmit={handleRegisterUser} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
