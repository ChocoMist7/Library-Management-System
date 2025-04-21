
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AvatarForm } from "@/components/ui/avatar-form";
import { User, UserRole, Student, Teacher, Librarian } from "@/lib/types";
import { generateId } from "@/lib/data";

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => void;
  isSubmitting?: boolean;
}

export function UserForm({ 
  initialData = {}, 
  onSubmit,
  isSubmitting = false,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    role: initialData.role || "student" as UserRole,
    imageUrl: initialData.imageUrl || "",
    
    // Student-specific fields
    rollNumber: (initialData as Partial<Student>)?.rollNumber || "",
    degree: (initialData as Partial<Student>)?.degree || "",
    stream: (initialData as Partial<Student>)?.stream || "",
    
    // Teacher-specific fields
    teacherId: (initialData as Partial<Teacher>)?.teacherId || "",
    department: (initialData as Partial<Teacher>)?.department || "",
    
    // Librarian-specific fields
    staffId: (initialData as Partial<Librarian>)?.staffId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Common validations
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    // Role-specific validations
    if (formData.role === "student") {
      if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll number is required";
      if (!formData.degree.trim()) newErrors.degree = "Degree is required";
      if (!formData.stream.trim()) newErrors.stream = "Stream is required";
    } else if (formData.role === "teacher") {
      if (!formData.teacherId.trim()) newErrors.teacherId = "Teacher ID is required";
      if (!formData.department.trim()) newErrors.department = "Department is required";
    } else if (formData.role === "librarian") {
      if (!formData.staffId.trim()) newErrors.staffId = "Staff ID is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Prepare submission data based on role
    // Create the base user data
    const baseUserData = {
      id: initialData.id || generateId(),
      name: formData.name,
      email: formData.email,
      imageUrl: formData.imageUrl,
      createdAt: new Date()
    };
    
    // Prepare submission data based on role with proper typing
    let submissionData: Partial<User>;
    
    if (formData.role === "student") {
      submissionData = {
        ...baseUserData,
        role: "student" as const,
      } as Partial<Student>;
      
      // Add student-specific fields
      (submissionData as Partial<Student>).rollNumber = formData.rollNumber;
      (submissionData as Partial<Student>).degree = formData.degree;
      (submissionData as Partial<Student>).stream = formData.stream;
    } 
    else if (formData.role === "teacher") {
      submissionData = {
        ...baseUserData,
        role: "teacher" as const,
      } as Partial<Teacher>;
      
      // Add teacher-specific fields
      (submissionData as Partial<Teacher>).teacherId = formData.teacherId;
      (submissionData as Partial<Teacher>).department = formData.department;
    } 
    else if (formData.role === "librarian") {
      submissionData = {
        ...baseUserData,
        role: "librarian" as const,
      } as Partial<Librarian>;
      
      // Add librarian-specific fields
      (submissionData as Partial<Librarian>).staffId = formData.staffId;
    }
    else {
      submissionData = {
        ...baseUserData,
        role: formData.role
      };
    }
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 md:col-span-2">
          <AvatarForm
            initialImageUrl={formData.imageUrl}
            onImageChange={handleImageChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
        
        {/* Role selection */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={formData.role} 
            onValueChange={(value: UserRole) => handleRoleChange(value)}
            disabled={!!initialData.id} // Disable role change for existing users
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="librarian">Librarian</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Role-specific fields */}
        {formData.role === "student" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="rollNumber" className={errors.rollNumber ? "text-destructive" : ""}>
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className={errors.rollNumber ? "border-destructive" : ""}
              />
              {errors.rollNumber && (
                <p className="text-xs text-destructive">{errors.rollNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree" className={errors.degree ? "text-destructive" : ""}>
                Degree
              </Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className={errors.degree ? "border-destructive" : ""}
              />
              {errors.degree && (
                <p className="text-xs text-destructive">{errors.degree}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="stream" className={errors.stream ? "text-destructive" : ""}>
                Stream
              </Label>
              <Input
                id="stream"
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className={errors.stream ? "border-destructive" : ""}
              />
              {errors.stream && (
                <p className="text-xs text-destructive">{errors.stream}</p>
              )}
            </div>
          </>
        )}
        
        {formData.role === "teacher" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="teacherId" className={errors.teacherId ? "text-destructive" : ""}>
                Teacher ID
              </Label>
              <Input
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className={errors.teacherId ? "border-destructive" : ""}
              />
              {errors.teacherId && (
                <p className="text-xs text-destructive">{errors.teacherId}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department" className={errors.department ? "text-destructive" : ""}>
                Department
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? "border-destructive" : ""}
              />
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department}</p>
              )}
            </div>
          </>
        )}
        
        {formData.role === "librarian" && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="staffId" className={errors.staffId ? "text-destructive" : ""}>
              Staff ID
            </Label>
            <Input
              id="staffId"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className={errors.staffId ? "border-destructive" : ""}
            />
            {errors.staffId && (
              <p className="text-xs text-destructive">{errors.staffId}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {initialData.id ? "Update User" : "Register User"}
        </Button>
      </div>
    </form>
  );
}
