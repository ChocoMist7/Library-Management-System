
// Type definitions for the Library Management System

// User types
export type UserRole = "student" | "teacher" | "librarian";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  imageUrl: string;
  email: string;
  createdAt: Date;
}

export interface Student extends User {
  role: "student";
  rollNumber: string;
  degree: string;
  stream: string;
}

export interface Teacher extends User {
  role: "teacher";
  teacherId: string;
  department: string;
}

export interface Librarian extends User {
  role: "librarian";
  staffId: string;
}

// Book related types
export interface Book {
  id: string;
  uniqueBookId: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publicationYear: number;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  coverImageUrl: string;
  addedAt: Date;
  updatedAt: Date;
  description?: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  uniqueBookId: string;
  userId: string;
  issueDate: Date;
  returnDate: Date;
  actualReturnDate?: Date;
  status: "issued" | "returned" | "overdue";
  remarks?: string;
}

// Search types
export interface SearchResult {
  type: "book" | "user" | "issue";
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}
