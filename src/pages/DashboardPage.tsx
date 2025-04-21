
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { books, students, teachers, bookIssues } from "@/lib/data";
import { Link } from "react-router-dom";
import { Book, Users, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [statistics, setStatistics] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalUsers: 0,
    overdueBooks: 0
  });

  useEffect(() => {
    // Calculate statistics
    const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
    const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
    const issuedBooks = totalBooks - availableBooks;
    const totalUsers = students.length + teachers.length;
    
    // Count overdue books
    const today = new Date();
    const overdueBooks = bookIssues.filter(issue => 
      issue.status === "issued" && 
      new Date(issue.returnDate) < today
    ).length;
    
    setStatistics({
      totalBooks,
      availableBooks,
      issuedBooks,
      totalUsers,
      overdueBooks
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to BookWise Library Management System
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Books" 
          value={statistics.totalBooks.toString()}
          description="Total books in library"
          icon={<Book className="h-5 w-5" />}
          iconClass="bg-blue-100 text-blue-600"
          linkTo="/books"
        />
        
        <StatCard 
          title="Available Books" 
          value={statistics.availableBooks.toString()}
          description="Books available for issue"
          icon={<BookOpen className="h-5 w-5" />}
          iconClass="bg-green-100 text-green-600"
          linkTo="/books"
        />
        
        <StatCard 
          title="Issued Books" 
          value={statistics.issuedBooks.toString()}
          description="Currently issued books"
          icon={<BookOpen className="h-5 w-5" />}
          iconClass="bg-amber-100 text-amber-600"
          linkTo="/books"
        />
        
        <StatCard 
          title="Registered Users" 
          value={statistics.totalUsers.toString()}
          description="Students and teachers"
          icon={<Users className="h-5 w-5" />}
          iconClass="bg-purple-100 text-purple-600"
          linkTo="/users"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link to="/books/add">Add New Book</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/users/register">Register User</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/search">Search Records</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Recently Added Books</CardTitle>
            <CardDescription>
              The latest books added to your library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.slice(0, 3).map(book => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <img 
                      src={book.coverImageUrl || "https://via.placeholder.com/100x150?text=No+Cover"} 
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconClass?: string;
  linkTo?: string;
}

function StatCard({ title, value, description, icon, iconClass, linkTo }: StatCardProps) {
  const content = (
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`rounded-full p-2 ${iconClass}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">{title}</h3>
      </div>
    </CardContent>
  );
  
  if (linkTo) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <Link to={linkTo}>
          {content}
        </Link>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      {content}
    </Card>
  );
}
