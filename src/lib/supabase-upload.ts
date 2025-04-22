
import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a file to a specific bucket, returns url or error.
 */
export async function uploadFile(bucket: string, file: File): Promise<{ url: string; error: null } | { url: null; error: Error }> {
  try {
    // Generate a unique file path
    const fileExt = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    // Check if file is too large (10MB limit for example)
    if (file.size > 10 * 1024 * 1024) {
      return { 
        url: null, 
        error: new Error("File size exceeds 10MB limit")
      };
    }
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error || !data) {
      console.error("Supabase upload error:", error);
      return { 
        url: null, 
        error: error || new Error("Failed to upload file") 
      };
    }
    
    // Get public URL after successful upload
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    
    if (!publicUrlData?.publicUrl) {
      return { 
        url: null, 
        error: new Error("Could not retrieve public URL") 
      };
    }
    
    return { url: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return { 
      url: null, 
      error: error instanceof Error ? error : new Error("Unknown upload error") 
    };
  }
}
