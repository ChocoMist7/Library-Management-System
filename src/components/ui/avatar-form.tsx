
import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { uploadFile } from "@/lib/supabase-upload";
import { toast } from "@/components/ui/use-toast";

interface AvatarFormProps {
  initialImageUrl?: string;
  onImageChange: (url: string, file?: File) => void;
}

export function AvatarForm({ initialImageUrl, onImageChange }: AvatarFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Pass both the file and a temporary local URL
    const tempUrl = URL.createObjectURL(file);
    setImageUrl(tempUrl);
    onImageChange(tempUrl, file);
    
    // For immediate upload option (currently not used to avoid double uploads)
    // We just pass the file to the parent component to handle during form submission
    /*
    setIsUploading(true);
    
    try {
      const { url, error } = await uploadFile("avatars", file);
      if (error) {
        throw error;
      }
      
      setImageUrl(url);
      onImageChange(url);
      toast({
        title: "Image uploaded",
        description: "Profile image has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
    */
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={imageUrl} />
        <AvatarFallback className="text-lg bg-primary text-primary-foreground">
          <User size={32} />
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative overflow-hidden"
          disabled={isUploading}
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/*"
          />
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>
    </div>
  );
}
