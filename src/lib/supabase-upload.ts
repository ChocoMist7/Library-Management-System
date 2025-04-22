
import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a file to a specific bucket, returns url or error.
 */
export async function uploadFile(bucket: string, file: File): Promise<{ url: string; error: null } | { url: null; error: Error }> {
  const fileExt = file.name.split(".").pop();
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error || !data) {
    return { url: null, error: error || new Error("Failed to upload file") };
  }
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { url: publicUrlData?.publicUrl || "", error: null };
}
