
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalIssued: 0,
    totalOverdue: 0,
  });

  const [chartData, setChartData] = useState({
    categories: [],
    issuedCount: [],
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch books statistics
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('id, available_copies, total_copies, category');
        
        if (booksError) throw booksError;
        
        // Fetch users statistics
        const { data: studentsData, error: studentsError } = await supabase
          .from('profiles')
          .select('count')
          .eq('role', 'student');
          
        const { data: teachersData, error: teachersError } = await supabase
          .from('profiles')
          .select('count')
          .eq('role', 'teacher');
          
        if (studentsError || teachersError) throw studentsError || teachersError;
        
        // Fetch book issues
        const { data: issuesData, error: issuesError } = await supabase
          .from('book_issues')
          .select('status');
          
        if (issuesError) throw issuesError;
        
        // Calculate statistics
        const totalBooks = booksData?.length || 0;
        const availableBooks = booksData?.reduce((sum, book) => sum + (book.available_copies || 0), 0) || 0;
        
        const totalStudents = studentsData?.[0]?.count || 0;
        const totalTeachers = teachersData?.[0]?.count || 0;
        
        const totalIssued = issuesData?.filter(issue => issue.status === 'issued').length || 0;
        const totalOverdue = issuesData?.filter(issue => issue.status === 'overdue').length || 0;
        
        // Update stats
        setStats({
          totalBooks,
          availableBooks,
          totalStudents,
          totalTeachers,
          totalIssued,
          totalOverdue,
        });
        
        // Calculate category distribution for chart
        const categories = {};
        booksData?.forEach(book => {
          if (book.category) {
            categories[book.category] = (categories[book.category] || 0) + 1;
          }
        });
        
        // Convert to chart format
        const categoryNames = Object.keys(categories).slice(0, 5); // Top 5 categories
        const categoryCounts = categoryNames.map(name => categories[name]);
        
        setChartData({
          categories: categoryNames,
          issuedCount: categoryCounts,
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the library management system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Book Categories Distribution</CardTitle>
            <CardDescription>
              Distribution of books by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={{
                labels: chartData.categories,
                datasets: [
                  {
                    label: "Books",
                    data: chartData.issuedCount,
                    backgroundColor: "rgba(24, 144, 255, 0.5)",
                    borderColor: "rgb(24, 144, 255)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
              height={300}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Book Status</CardTitle>
            <CardDescription>Currently issued and overdue books</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-blue-500" />
                  <div className="text-sm font-medium">Currently Issued</div>
                  <div className="ml-auto">{stats.totalIssued}</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${
                        stats.totalIssued > 0
                          ? (stats.totalIssued /
                              (stats.totalIssued + stats.totalOverdue)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-red-500" />
                  <div className="text-sm font-medium">Overdue</div>
                  <div className="ml-auto">{stats.totalOverdue}</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${
                        stats.totalOverdue > 0
                          ? (stats.totalOverdue /
                              (stats.totalIssued + stats.totalOverdue)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
