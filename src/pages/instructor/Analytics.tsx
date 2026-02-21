import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Star, 
  Eye,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function InstructorAnalytics() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-analytics', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Fetch courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, enrolled_count, rating, review_count, price, status')
        .eq('instructor_id', user.id);

      const courseList = courses ?? [];
      const courseIds = courseList.map(c => c.id);

      // Fetch enrollments with dates
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at')
        .in('course_id', courseIds.length > 0 ? courseIds : ['none']);

      // Fetch reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('course_id, rating, created_at')
        .in('course_id', courseIds.length > 0 ? courseIds : ['none']);

      const totalStudents = courseList.reduce((s, c) => s + c.enrolled_count, 0);
      const totalRevenue = courseList.reduce((s, c) => s + c.price * c.enrolled_count * 0.7, 0);
      const publishedWithRating = courseList.filter(c => c.status === 'published' && c.rating > 0);
      const avgRating = publishedWithRating.length > 0
        ? (publishedWithRating.reduce((s, c) => s + Number(c.rating), 0) / publishedWithRating.length).toFixed(2)
        : '0';

      // Build monthly enrollment data
      const monthlyMap: Record<string, { enrollments: number; revenue: number }> = {};
      for (const e of enrollments ?? []) {
        const d = new Date(e.enrolled_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyMap[key]) monthlyMap[key] = { enrollments: 0, revenue: 0 };
        monthlyMap[key].enrollments++;
        const course = courseList.find(c => c.id === e.course_id);
        monthlyMap[key].revenue += (course?.price || 0) * 0.7;
      }

      const sortedMonths = Object.keys(monthlyMap).sort();
      const last6 = sortedMonths.slice(-6);
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const enrollmentChartData = last6.map(k => ({
        month: monthNames[parseInt(k.split('-')[1]) - 1],
        enrollments: monthlyMap[k].enrollments,
        revenue: Math.round(monthlyMap[k].revenue),
      }));

      // Course performance
      const coursePerformance = courseList
        .filter(c => c.status === 'published')
        .map(c => ({
          name: c.title,
          enrollments: c.enrolled_count,
          rating: Number(c.rating),
        }));

      return {
        totalStudents,
        totalRevenue: Math.round(totalRevenue),
        avgRating,
        totalCourses: courseList.length,
        enrollmentChartData,
        coursePerformance,
      };
    },
    enabled: !!user,
  });

  if (isLoading || !data) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const stats = [
    { title: 'Total Students', value: data.totalStudents.toLocaleString(), icon: Users },
    { title: 'Total Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: 'Avg Rating', value: data.avgRating, icon: Star },
    { title: 'Total Courses', value: data.totalCourses.toString(), icon: BookOpen },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your course performance and student engagement</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollments & Revenue</CardTitle>
            <CardDescription>Monthly trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {data.enrollmentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.enrollmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="enrollments" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      name="Enrollments"
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--chart-2))" 
                      fill="hsl(var(--chart-2))" 
                      fillOpacity={0.2}
                      name="Revenue ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No enrollment data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Your published courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.coursePerformance.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No published courses yet</div>
              ) : (
                data.coursePerformance.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{course.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.enrollments > 0 ? `${course.enrollments.toLocaleString()} students` : 'No students yet'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Rating</p>
                      <p className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {course.rating > 0 ? course.rating.toFixed(1) : '-'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
