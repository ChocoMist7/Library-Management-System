import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Book } from "@/lib/types";
import { generateBookId } from "@/lib/data";

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (data: Partial<Book> & { coverImageFile?: File }) => void;
  isSubmitting?: boolean;
}

export function BookForm({ 
  initialData = {}, 
  onSubmit,
  isSubmitting = false
}: BookFormProps) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    author: initialData.author || "",
    isbn: initialData.isbn || "",
    category: initialData.category || "",
    publicationYear: initialData.publicationYear || new Date().getFullYear(),
    publisher: initialData.publisher || "",
    totalCopies: initialData.totalCopies || 1,
    description: initialData.description || "",
    coverImageUrl: initialData.coverImageUrl || "",
    coverImageFile: undefined as File | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.publisher.trim()) newErrors.publisher = "Publisher is required";
    if (formData.totalCopies < 1) newErrors.totalCopies = "At least 1 copy is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "coverImageFile" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        coverImageFile: files[0],
        coverImageUrl: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "totalCopies" || name === "publicationYear"
          ? parseInt(value, 10) || 0
          : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData: Partial<Book> & { coverImageFile?: File } = {
      ...formData,
      uniqueBookId: initialData.uniqueBookId || generateBookId(),
      availableCopies: initialData.availableCopies !== undefined
        ? initialData.availableCopies
        : formData.totalCopies,
      coverImageFile: formData.coverImageFile,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
            Book Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author" className={errors.author ? "text-destructive" : ""}>
            Author
          </Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={errors.author ? "border-destructive" : ""}
          />
          {errors.author && (
            <p className="text-xs text-destructive">{errors.author}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isbn" className={errors.isbn ? "text-destructive" : ""}>
            ISBN
          </Label>
          <Input
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className={errors.isbn ? "border-destructive" : ""}
          />
          {errors.isbn && (
            <p className="text-xs text-destructive">{errors.isbn}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className={errors.category ? "text-destructive" : ""}>
            Category
          </Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "border-destructive" : ""}
          />
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publicationYear">
            Publication Year
          </Label>
          <Input
            id="publicationYear"
            name="publicationYear"
            type="number"
            min="1000"
            max={new Date().getFullYear()}
            value={formData.publicationYear}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher" className={errors.publisher ? "text-destructive" : ""}>
            Publisher
          </Label>
          <Input
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            className={errors.publisher ? "border-destructive" : ""}
          />
          {errors.publisher && (
            <p className="text-xs text-destructive">{errors.publisher}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalCopies" className={errors.totalCopies ? "text-destructive" : ""}>
            Total Copies
          </Label>
          <Input
            id="totalCopies"
            name="totalCopies"
            type="number"
            min="1"
            value={formData.totalCopies}
            onChange={handleChange}
            className={errors.totalCopies ? "border-destructive" : ""}
          />
          {errors.totalCopies && (
            <p className="text-xs text-destructive">{errors.totalCopies}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImageFile" className={errors.coverImageUrl ? "text-destructive" : ""}>
            Cover Image (upload)
          </Label>
          <Input
            id="coverImageFile"
            name="coverImageFile"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className={errors.coverImageUrl ? "border-destructive" : ""}
          />
          {formData.coverImageUrl && (
            <img
              src={formData.coverImageUrl as string}
              alt="Preview"
              className="h-24 mt-2"
            />
          )}
          {errors.coverImageUrl && (
            <p className="text-xs text-destructive">{errors.coverImageUrl}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {initialData.id ? "Update Book" : "Add Book"}
        </Button>
      </div>
    </form>
  );
}
