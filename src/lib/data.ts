
import { supabase } from "@/integrations/supabase/client";
import { Book, BookIssue, User } from "./types";

// Helper functions for generating IDs
export const generateId = () => Math.random().toString(36).substring(2, 11);
export const generateBookId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomChars = chars[Math.floor(Math.random() * chars.length)] + 
                     chars[Math.floor(Math.random() * chars.length)];
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK-${randomChars}-${randomNum}`;
};

// Book Management Functions
export const addBook = async (bookData: Partial<Book>) => {
  console.log("Adding book:", bookData);
  const { data, error } = await supabase
    .from("books")
    .insert([{
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      publication_year: bookData.publicationYear,
      publisher: bookData.publisher,
      total_copies: bookData.totalCopies || 1,
      available_copies: bookData.totalCopies || 1,
      cover_image_url: bookData.coverImageUrl,
      description: bookData.description,
      unique_book_id: generateBookId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    console.error("Error adding book:", error);
    throw error;
  }

  return data[0];
};

export const deleteBook = async (bookId: string) => {
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId);

  if (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

// User Management Functions
export const registerUser = async (userData: Partial<User>) => {
  console.log("Registering user:", userData);
  const { data, error } = await supabase
    .from("profiles")
    .insert([{
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar_url: userData.imageUrl,
      created_at: new Date().toISOString(),
      // Role-specific fields
      ...(userData.role === 'student' && {
        roll_number: (userData as any).rollNumber,
        degree: (userData as any).degree,
        stream: (userData as any).stream,
      }),
      ...(userData.role === 'teacher' && {
        teacher_id: (userData as any).teacherId,
        department: (userData as any).department,
      }),
      ...(userData.role === 'librarian' && {
        staff_id: (userData as any).staffId,
      }),
    }])
    .select();

  if (error) {
    console.error("Error registering user:", error);
    throw error;
  }

  return data[0];
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Book Issue Management Functions
export const issueBook = async (issueData: Partial<BookIssue>) => {
  console.log("Issuing book:", issueData);
  const { data, error } = await supabase
    .from("book_issues")
    .insert([{
      book_id: issueData.bookId,
      user_id: issueData.userId,
      issue_date: issueData.issueDate?.toISOString(),
      return_date: issueData.returnDate?.toISOString(),
      status: "issued",
      created_at: new Date().toISOString(),
    }])
    .select();

  if (error) {
    console.error("Error issuing book:", error);
    throw error;
  }

  return data[0];
};

export const returnBook = async (issueId: string, remarks?: string) => {
  const { data, error } = await supabase
    .from("book_issues")
    .update({
      status: "returned",
      actual_return_date: new Date().toISOString(),
      remarks: remarks,
    })
    .eq("id", issueId)
    .select();

  if (error) {
    console.error("Error returning book:", error);
    throw error;
  }

  return data[0];
};

// Fetch Functions
export const fetchBooks = async () => {
  const { data, error } = await supabase
    .from("books")
    .select("*");

  if (error) {
    console.error("Error fetching books:", error);
    throw error;
  }

  return data;
};

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data;
};

export const fetchBookIssues = async () => {
  const { data, error } = await supabase
    .from("book_issues")
    .select(`
      *,
      books (*),
      profiles (*)
    `);

  if (error) {
    console.error("Error fetching book issues:", error);
    throw error;
  }

  return data;
};

