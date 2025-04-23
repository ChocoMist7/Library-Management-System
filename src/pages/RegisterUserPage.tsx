
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

    try {
      // Generate a proper UUID for the user profile
      const userId = uuidv4();
      
      // Handle image upload if there's a file
      let avatarUrl = data.imageUrl || null;
      
      if (data.imageFile instanceof File) {
        try {
          const { url, error } = await uploadFile("avatars", data.imageFile);
          if (error) {
            console.error("Avatar upload error details:", error);
            toast({
              title: "Image Upload Failed",
              description: `Could not upload the profile image: ${error.message}`,
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
          avatarUrl = url;
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast({
            title: "Image Upload Failed",
            description: "Could not upload the profile image. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare the base user data
      const userData: any = {
        id: userId,
        name: data.name || "",
        role: data.role,
        email: data.email || "",
        avatar_url: avatarUrl,
        created_at: new Date().toISOString(),
      };

      // Role-specific fields
      if (data.role === "student") {
        userData.roll_number = (data as any).rollNumber || "";
        userData.degree = (data as any).degree || "";
        userData.stream = (data as any).stream || "";
      } else if (data.role === "teacher") {
        userData.teacher_id = (data as any).teacherId || "";
        userData.department = (data as any).department || "";
      } else if (data.role === "librarian") {
        userData.staff_id = (data as any).staffId || "";
      }

      // Insert the profile data
      const { error } = await supabase.from("profiles").insert([userData]);

      if (error) {
        console.error("Supabase insert error:", error);
        toast({ 
          title: "Error registering user", 
          description: error.message,
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "User registered",
        description: `${userData.name} has been successfully registered.`,
      });

      setIsSubmitting(false);
      navigate("/users");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({ 
        title: "Error registering user", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      });
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
