
import { Book, BookIssue, Student, Teacher, Librarian, User } from "./types";

// Generate a unique ID
export const generateId = () => Math.random().toString(36).substring(2, 11);

// Generate a unique book ID
export const generateBookId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomChars = chars[Math.floor(Math.random() * chars.length)] + 
                      chars[Math.floor(Math.random() * chars.length)];
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK-${randomChars}-${randomNum}`;
};

// Initial dummy data for books
export const books: Book[] = [
  {
    id: "book1",
    uniqueBookId: "BK-AB-0001",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction",
    publicationYear: 1960,
    publisher: "J. B. Lippincott & Co.",
    totalCopies: 5,
    availableCopies: 3,
    coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop",
    addedAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    description: "To Kill a Mockingbird is a novel by the American author Harper Lee. It was published in 1960 and has become a classic of modern American literature."
  },
  {
    id: "book2",
    uniqueBookId: "BK-CD-0002",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    category: "Science Fiction",
    publicationYear: 1949,
    publisher: "Secker & Warburg",
    totalCopies: 3,
    availableCopies: 2,
    coverImageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200&auto=format&fit=crop",
    addedAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
    description: "1984 is a dystopian novel by George Orwell published in 1949. The novel is set in Airstrip One, a province of the superstate Oceania in a world of perpetual war."
  },
  {
    id: "book3",
    uniqueBookId: "BK-EF-0003",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    category: "Fiction",
    publicationYear: 1925,
    publisher: "Charles Scribner's Sons",
    totalCopies: 4,
    availableCopies: 4,
    coverImageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop",
    addedAt: new Date("2023-02-05"),
    updatedAt: new Date("2023-02-05"),
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby."
  },
  {
    id: "book4",
    uniqueBookId: "BK-GH-0004",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    category: "Classic",
    publicationYear: 1813,
    publisher: "T. Egerton, Whitehall",
    totalCopies: 3,
    availableCopies: 1,
    coverImageUrl: "https://images.unsplash.com/photo-1549122728-f519709caa9c?q=80&w=200&auto=format&fit=crop",
    addedAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
    description: "Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book."
  },
  {
    id: "book5",
    uniqueBookId: "BK-IJ-0005",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0-261-10295-3",
    category: "Fantasy",
    publicationYear: 1937,
    publisher: "George Allen & Unwin",
    totalCopies: 6,
    availableCopies: 5,
    coverImageUrl: "https://images.unsplash.com/photo-1515674447568-09bbb254152a?q=80&w=200&auto=format&fit=crop",
    addedAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-03-01"),
    description: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim."
  }
];

// Initial dummy data for students
export const students: Student[] = [
  {
    id: "student1",
    name: "John Doe",
    role: "student",
    email: "john.doe@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    createdAt: new Date("2023-01-10"),
    rollNumber: "S2023001",
    degree: "Bachelor of Science",
    stream: "Computer Science"
  },
  {
    id: "student2",
    name: "Jane Smith",
    role: "student",
    email: "jane.smith@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    createdAt: new Date("2023-01-12"),
    rollNumber: "S2023002",
    degree: "Bachelor of Arts",
    stream: "English Literature"
  }
];

// Initial dummy data for teachers
export const teachers: Teacher[] = [
  {
    id: "teacher1",
    name: "Dr. Robert Brown",
    role: "teacher",
    email: "robert.brown@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
    createdAt: new Date("2022-12-15"),
    teacherId: "T2022001",
    department: "Computer Science"
  },
  {
    id: "teacher2",
    name: "Prof. Sarah Wilson",
    role: "teacher",
    email: "sarah.wilson@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    createdAt: new Date("2022-12-18"),
    teacherId: "T2022002",
    department: "English Literature"
  }
];

// Initial dummy data for librarians
export const librarians: Librarian[] = [
  {
    id: "librarian1",
    name: "Michael Johnson",
    role: "librarian",
    email: "michael.johnson@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    createdAt: new Date("2022-11-01"),
    staffId: "L2022001"
  }
];

// Combine all users for easier searching
export const allUsers: User[] = [...students, ...teachers, ...librarians];

// Initial dummy data for book issues
export const bookIssues: BookIssue[] = [
  {
    id: "issue1",
    bookId: "book1",
    uniqueBookId: "BK-AB-0001",
    userId: "student1",
    issueDate: new Date("2023-03-10"),
    returnDate: new Date("2023-03-24"),
    status: "issued"
  },
  {
    id: "issue2",
    bookId: "book4",
    uniqueBookId: "BK-GH-0004",
    userId: "student2",
    issueDate: new Date("2023-03-12"),
    returnDate: new Date("2023-03-26"),
    status: "issued"
  },
  {
    id: "issue3",
    bookId: "book2",
    uniqueBookId: "BK-CD-0002",
    userId: "teacher1",
    issueDate: new Date("2023-03-05"),
    returnDate: new Date("2023-03-19"),
    actualReturnDate: new Date("2023-03-17"),
    status: "returned"
  }
];
