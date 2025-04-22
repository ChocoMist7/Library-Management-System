
// This file no longer exports static demo data. All book/user/issue data is now managed in Supabase.

// Generate a unique ID (for temporary use if needed)
export const generateId = () => Math.random().toString(36).substring(2, 11);
export const generateBookId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomChars = chars[Math.floor(Math.random() * chars.length)] + 
                      chars[Math.floor(Math.random() * chars.length)];
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK-${randomChars}-${randomNum}`;
};
