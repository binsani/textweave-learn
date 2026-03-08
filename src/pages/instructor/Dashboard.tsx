import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  MoreVertical,
  Eye,
  Edit,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { dbCourseToCardProps, type DbCourse } from '@/hooks/useCourses';
import {
  EnrollmentChart,
  RevenueChart,
  CoursePerformance,
  RecentActivity,
  TopStudents,
} from '@/components/instructor';

export default function InstructorDashboard() {
  useDocumentTitle('Instructor Dashboard - MasashiLearn');
  const { user } = useAuthStore();

  // Fetch instructor's courses from database
  const { data: dbInstructorCourses = [] } = useQuery({
    queryKey: ['instructor-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('courses')
        .select('*, instructor:profiles!courses_instructor_id_fkey(*), sections(*, lessons(*))')
        .eq('instructor_id', user.id);
      if (error) throw error;
      return (data ?? []).map((c) => dbCourseToCardProps(c as DbCourse));
    },
    enabled: !!user,
  });
  const instructorCourses = dbInstructorCourses;

  // Calculate real stats from courses
  const totalStudents = instructorCourses.reduce((acc, c) => acc + (c.enrollmentCount || c.enrolledCount || 0), 0);
  const totalRevenue = instructorCourses.reduce((acc, c) => acc + (c.price * (c.enrollmentCount || c.enrolledCount || 0) * 0.7), 0);

  const stats = [
    { 
      label: 'Total Courses', 
      value: instructorCourses.length.toString(), 
      icon: BookOpen,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    { 
      label: 'Total Students', 
      value: totalStudents.toLocaleString(), 
      icon: Users,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Published', 
      value: instructorCourses.filter(c => c.status === 'published').length.toString(), 
      icon: TrendingUp,
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Revenue', 
      value: `$${Math.round(totalRevenue).toLocaleString()}`, 
      icon: DollarSign,
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-600'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'under_review':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-0">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your courses, track student progress, and monitor revenue
          </p>
        </div>
        <Button asChild>
          <Link to="/instructor/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <EnrollmentChart />
        <RevenueChart />
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <CoursePerformance courses={instructorCourses} />
        <TopStudents />
        <RecentActivity />
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-serif">Your Courses</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and monitor all your courses
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/instructor/courses">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {instructorCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first course to start teaching
              </p>
              <Button asChild>
                <Link to="/instructor/courses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructorCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 shrink-0 overflow-hidden">
                            {course.thumbnail && (
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium line-clamp-1">{course.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons • {course.level}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">
                          {(course.enrollmentCount || course.enrolledCount || 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="flex items-center justify-center gap-1">
                          <span className="text-amber-500">★</span>
                          {course.rating.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        ${Math.round(course.price * (course.enrollmentCount || course.enrolledCount || 0) * 0.7).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/courses/${course.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/instructor/courses/${course.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/instructor/courses/${course.id}/analytics`}>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analytics
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
