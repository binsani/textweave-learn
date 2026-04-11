import { useMemo } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CATEGORY_COLORS: Record<string, string> = {
  programming: 'hsl(var(--primary))',
  'data-science': 'hsl(var(--accent))',
  business: 'hsl(200, 70%, 50%)',
  design: 'hsl(280, 70%, 50%)',
  marketing: 'hsl(30, 70%, 50%)',
  'personal-development': 'hsl(160, 70%, 50%)',
  mathematics: 'hsl(340, 70%, 50%)',
  science: 'hsl(60, 70%, 45%)',
  humanities: 'hsl(120, 50%, 45%)',
  language: 'hsl(220, 70%, 55%)',
};

const CATEGORY_LABELS: Record<string, string> = {
  programming: 'Programming',
  'data-science': 'Data Science',
  business: 'Business',
  design: 'Design',
  marketing: 'Marketing',
  'personal-development': 'Personal Dev',
  mathematics: 'Mathematics',
  science: 'Science',
  humanities: 'Humanities',
  language: 'Language',
};

const chartConfig: ChartConfig = {
  users: { label: 'Total Users', color: 'hsl(var(--primary))' },
  students: { label: 'Students', color: 'hsl(var(--accent))' },
  instructors: { label: 'Instructors', color: 'hsl(200, 70%, 50%)' },
  enrollments: { label: 'Enrollments', color: 'hsl(var(--primary))' },
  completions: { label: 'Completions', color: 'hsl(var(--accent))' },
};

export function PlatformAnalytics() {
  const { data: rolesData = [] } = useQuery({
    queryKey: ['admin-roles-analytics'],
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('role');
      return data ?? [];
    },
  });
  const { data: coursesData = [] } = useQuery({
    queryKey: ['admin-courses-analytics'],
    queryFn: async () => {
      const { data } = await supabase.from('courses').select('status, enrolled_count, category');
      return data ?? [];
    },
  });
  const { data: profilesData = [] } = useQuery({
    queryKey: ['admin-profiles-analytics'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id, created_at');
      return data ?? [];
    },
  });
  const { data: enrollmentsData = [] } = useQuery({
    queryKey: ['admin-enrollments-analytics'],
    queryFn: async () => {
      const { data } = await supabase.from('enrollments').select('id, enrolled_at, status');
      return data ?? [];
    },
  });
  const { data: progressData = [] } = useQuery({
    queryKey: ['admin-progress-analytics'],
    queryFn: async () => {
      const { data } = await supabase.from('course_progress').select('id, is_completed, completed_at, last_accessed_at');
      return data ?? [];
    },
  });

  const totalStudents = rolesData.filter(r => r.role === 'student').length;
  const totalInstructors = rolesData.filter(r => r.role === 'instructor').length;
  const publishedCourses = coursesData.filter(c => c.status === 'published').length;
  const totalEnrollments = enrollmentsData.length;

  // User growth data by month (last 6 months)
  const userGrowthData = useMemo(() => {
    const months: { month: string; students: number; instructors: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthLabel = d.toLocaleString('en', { month: 'short' });

      // Count cumulative users up to this month
      const usersUpToMonth = profilesData.filter(p => new Date(p.created_at) <= monthEnd).length;
      // Approximate student/instructor split based on current ratio
      const ratio = totalStudents + totalInstructors > 0 ? totalStudents / (totalStudents + totalInstructors) : 0.8;
      months.push({
        month: monthLabel,
        students: Math.round(usersUpToMonth * ratio),
        instructors: Math.round(usersUpToMonth * (1 - ratio)),
      });
    }
    return months;
  }, [profilesData, totalStudents, totalInstructors]);

  // Enrollment vs completion data by month (last 6 months)
  const enrollmentChartData = useMemo(() => {
    const months: { month: string; enrollments: number; completions: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthLabel = d.toLocaleString('en', { month: 'short' });

      const monthEnrollments = enrollmentsData.filter(e => {
        const ed = new Date(e.enrolled_at);
        return ed >= d && ed <= monthEnd;
      }).length;

      const monthCompletions = progressData.filter(p => {
        if (!p.is_completed || !p.completed_at) return false;
        const cd = new Date(p.completed_at);
        return cd >= d && cd <= monthEnd;
      }).length;

      months.push({ month: monthLabel, enrollments: monthEnrollments, completions: monthCompletions });
    }
    return months;
  }, [enrollmentsData, progressData]);

  // Category distribution from real courses
  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of coursesData) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    const total = coursesData.length || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name: CATEGORY_LABELS[name] || name,
        value: Math.round((count / total) * 100),
        color: CATEGORY_COLORS[name] || 'hsl(var(--muted-foreground))',
      }))
      .sort((a, b) => b.value - a.value);
  }, [coursesData]);

  const stats = [
    { 
      label: 'Total Students', 
      value: totalStudents,
      change: `${totalStudents}`,
      icon: GraduationCap,
      color: 'text-blue-500'
    },
    { 
      label: 'Total Instructors', 
      value: totalInstructors,
      change: `${totalInstructors}`,
      icon: Users,
      color: 'text-primary'
    },
    { 
      label: 'Published Courses', 
      value: publishedCourses,
      change: `${coursesData.length} total`,
      icon: BookOpen,
      color: 'text-accent'
    },
    { 
      label: 'Total Enrollments', 
      value: totalEnrollments,
      change: `${enrollmentsData.filter(e => e.status === 'active').length} active`,
      icon: Award,
      color: 'text-green-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="students"
                  stackId="1"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent) / 0.3)"
                />
                <Area
                  type="monotone"
                  dataKey="instructors"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.3)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Enrollment & Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Enrollments vs Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={enrollmentChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="enrollments" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="completions" 
                  fill="hsl(var(--accent))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Course Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No courses yet</p>
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="h-[250px] w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {categoryDistribution.map((category) => (
                  <div key={category.name} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
