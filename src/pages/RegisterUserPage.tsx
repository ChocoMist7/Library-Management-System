
import { useState } from "react";
import { UserForm } from "@/components/users/user-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function RegisterUserPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterUser = async (data: Partial<User>) => {
    setIsSubmitting(true);

    // The correct method is to invite/add an auth user, but for demo, we'll just insert profile.
    const fakeEmail = data.email || "";
    const userData: any = {
      name: data.name || "",
      role: data.role,
      email: fakeEmail,
      avatar_url: data.imageUrl ?? null,
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

    const { error } = await supabase.from("profiles").insert([userData]);

    if (error) {
      toast({ title: "Error registering user", description: error.message });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "User registered",
      description: `${userData.name} has been successfully registered.`,
    });

    setIsSubmitting(false);
    navigate("/users");
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
