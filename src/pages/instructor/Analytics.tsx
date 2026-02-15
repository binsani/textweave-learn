import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Star, 
  Eye,
  BookOpen,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
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

const enrollmentData = [
  { month: 'Aug', enrollments: 45, revenue: 2250 },
  { month: 'Sep', enrollments: 52, revenue: 2600 },
  { month: 'Oct', enrollments: 78, revenue: 3900 },
  { month: 'Nov', enrollments: 95, revenue: 4750 },
  { month: 'Dec', enrollments: 110, revenue: 5500 },
  { month: 'Jan', enrollments: 142, revenue: 7100 },
];

const coursePerformance = [
  { name: 'Web Dev Bootcamp', enrollments: 1234, completion: 68, rating: 4.8 },
  { name: 'React Masterclass', enrollments: 856, completion: 72, rating: 4.9 },
  { name: 'Node.js Backend', enrollments: 0, completion: 0, rating: 0 },
];

const trafficSources = [
  { name: 'Organic Search', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Direct', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Social Media', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Referrals', value: 15, color: 'hsl(var(--chart-4))' },
  { name: 'Email', value: 5, color: 'hsl(var(--chart-5))' },
];

const studentEngagement = [
  { day: 'Mon', views: 245, completions: 32 },
  { day: 'Tue', views: 312, completions: 45 },
  { day: 'Wed', views: 287, completions: 38 },
  { day: 'Thu', views: 356, completions: 52 },
  { day: 'Fri', views: 298, completions: 41 },
  { day: 'Sat', views: 189, completions: 28 },
  { day: 'Sun', views: 156, completions: 22 },
];

const stats = [
  {
    title: 'Total Students',
    value: '2,090',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Total Revenue',
    value: '$21,010',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Avg Rating',
    value: '4.85',
    change: '+0.3',
    trend: 'up',
    icon: Star,
  },
  {
    title: 'Course Views',
    value: '45.2K',
    change: '-2.1%',
    trend: 'down',
    icon: Eye,
  },
];

export default function InstructorAnalytics() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your course performance and student engagement</p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className={`text-sm flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Enrollment & Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollments & Revenue</CardTitle>
            <CardDescription>Monthly trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData}>
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
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
            <CardDescription>Course views and lesson completions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentEngagement}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completions" fill="hsl(var(--chart-3))" name="Completions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your students come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Performance Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Comparison of your published courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coursePerformance.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.enrollments > 0 ? `${course.enrollments.toLocaleString()} students` : 'Not published'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground">Completion</p>
                      <p className="font-medium">{course.completion > 0 ? `${course.completion}%` : '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {course.rating > 0 ? course.rating : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
