
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvatarFormProps {
  className?: string;
  initialImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
}

export function AvatarForm({
  className,
  initialImageUrl = "",
  onImageChange
}: AvatarFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [error, setError] = useState<string>("");

  // For demo purposes we're using URLs, 
  // in a real app you'd handle file uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    
    if (!url) {
      setError("Please enter an image URL");
      onImageChange("");
      return;
    }
    
    // Basic URL validation
    try {
      new URL(url);
      setError("");
      onImageChange(url);
    } catch (err) {
      setError("Please enter a valid URL");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <Label htmlFor="image-url">Profile Image URL</Label>
          <Input
            id="image-url"
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={handleImageChange}
            className={error ? "border-destructive" : ""}
          />
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
