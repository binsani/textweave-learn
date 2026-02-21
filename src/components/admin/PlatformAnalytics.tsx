import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
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

const userGrowthData = [
  { month: 'Jan', users: 120, students: 100, instructors: 20 },
  { month: 'Feb', users: 180, students: 150, instructors: 30 },
  { month: 'Mar', users: 250, students: 210, instructors: 40 },
  { month: 'Apr', users: 320, students: 270, instructors: 50 },
  { month: 'May', users: 410, students: 350, instructors: 60 },
  { month: 'Jun', users: 520, students: 440, instructors: 80 },
];

const enrollmentData = [
  { month: 'Jan', enrollments: 45, completions: 12 },
  { month: 'Feb', enrollments: 78, completions: 23 },
  { month: 'Mar', enrollments: 112, completions: 45 },
  { month: 'Apr', enrollments: 156, completions: 67 },
  { month: 'May', enrollments: 189, completions: 89 },
  { month: 'Jun', enrollments: 234, completions: 112 },
];

const categoryDistribution = [
  { name: 'Programming', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Data Science', value: 25, color: 'hsl(var(--accent))' },
  { name: 'Business', value: 20, color: 'hsl(200, 70%, 50%)' },
  { name: 'Design', value: 12, color: 'hsl(280, 70%, 50%)' },
  { name: 'Other', value: 8, color: 'hsl(var(--muted-foreground))' },
];

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
      const { data } = await supabase.from('courses').select('status, enrolled_count');
      return data ?? [];
    },
  });

  const totalStudents = rolesData.filter(r => r.role === 'student').length;
  const totalInstructors = rolesData.filter(r => r.role === 'instructor').length;
  const publishedCourses = coursesData.filter(c => c.status === 'published').length;
  const totalEnrollments = coursesData.reduce((acc, c) => acc + c.enrolled_count, 0);

  const stats = [
    { 
      label: 'Total Students', 
      value: totalStudents,
      change: '+18%',
      icon: GraduationCap,
      color: 'text-blue-500'
    },
    { 
      label: 'Total Instructors', 
      value: totalInstructors,
      change: '+12%',
      icon: Users,
      color: 'text-primary'
    },
    { 
      label: 'Published Courses', 
      value: publishedCourses,
      change: '+24%',
      icon: BookOpen,
      color: 'text-accent'
    },
    { 
      label: 'Total Enrollments', 
      value: totalEnrollments,
      change: '+32%',
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
              <BarChart data={enrollmentData}>
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
        </CardContent>
      </Card>
    </div>
  );
}
