import { useState } from "react";
import { UserForm } from "@/components/users/user-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/supabase-upload";
import { v4 as uuidv4 } from "uuid";

export default function RegisterUserPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterUser = async (data: Partial<User>) => {
    setIsSubmitting(true);
    console.log("Submitting user data:", data);

    try {
      let avatarUrl = data.imageUrl || null;
      
      if (data.imageFile instanceof File) {
        const { url, error } = await uploadFile("avatars", data.imageFile);
        if (error) {
          console.error("Upload error:", error);
          toast({
            title: "Image Upload Failed",
            description: error.message,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        avatarUrl = url;
      }

      const userId = uuidv4();
      const userData = {
        id: userId,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar_url: avatarUrl,
        created_at: new Date().toISOString(),
        // Role-specific fields
        ...(data.role === 'student' && {
          roll_number: (data as any).rollNumber,
          degree: (data as any).degree,
          stream: (data as any).stream,
        }),
        ...(data.role === 'teacher' && {
          teacher_id: (data as any).teacherId,
          department: (data as any).department,
        }),
        ...(data.role === 'librarian' && {
          staff_id: (data as any).staffId,
        }),
      };

      console.log("Inserting user data:", userData);
      
      const { data: insertedUser, error: insertError } = await supabase
        .from("profiles")
        .insert([userData])
        .select();

      if (insertError) {
        console.error("Database error:", insertError);
        throw insertError;
      }

      console.log("User registered successfully:", insertedUser);
      toast({
        title: "Success",
        description: "User has been registered successfully",
      });

      navigate("/users");
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: "Error",
        description: "Failed to register user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
