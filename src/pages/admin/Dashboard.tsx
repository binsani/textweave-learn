import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  Users,
  BookOpen,
  ShieldAlert,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  UserPlus,
  GraduationCap,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockCourses, mockUsers } from '@/data/mockData';

export default function AdminDashboard() {
  useDocumentTitle('Admin Dashboard - Masashi LMS');
  const pendingCourses = mockCourses.filter(c => c.status === 'under_review');
  const totalUsers = mockUsers.length;
  const totalCourses = mockCourses.length;
  const publishedCourses = mockCourses.filter(c => c.status === 'published').length;
  const students = mockUsers.filter(u => u.role === 'student').length;
  const instructors = mockUsers.filter(u => u.role === 'instructor').length;

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      change: '+12%',
      changeType: 'up' as const,
      subtitle: `${students} students · ${instructors} instructors`,
    },
    {
      label: 'Active Courses',
      value: publishedCourses,
      icon: BookOpen,
      change: '+3',
      changeType: 'up' as const,
      subtitle: `${totalCourses} total courses`,
    },
    {
      label: 'Pending Review',
      value: pendingCourses.length,
      icon: Clock,
      change: pendingCourses.length > 0 ? 'Action needed' : 'All clear',
      changeType: pendingCourses.length > 0 ? 'warning' as const : 'up' as const,
      subtitle: 'Course submissions',
    },
    {
      label: 'Open Reports',
      value: 3,
      icon: ShieldAlert,
      change: '+2',
      changeType: 'down' as const,
      subtitle: 'Needs investigation',
    },
  ];

  const recentActivity = [
    { type: 'enrollment', user: 'Alex Thompson', action: 'enrolled in', target: 'Python Fundamentals', time: '2 min ago', icon: GraduationCap },
    { type: 'signup', user: 'Emma Wilson', action: 'created an account', target: '', time: '15 min ago', icon: UserPlus },
    { type: 'course', user: 'Dr. Sarah Mitchell', action: 'submitted', target: 'Advanced Algorithms', time: '1 hr ago', icon: BookOpen },
    { type: 'report', user: 'System', action: 'flagged content in', target: 'Web Dev Bootcamp', time: '3 hrs ago', icon: ShieldAlert },
    { type: 'enrollment', user: 'Jordan Lee', action: 'completed', target: 'Data Science 101', time: '5 hrs ago', icon: CheckCircle },
  ];

  const topCourses = mockCourses
    .filter(c => c.status === 'published')
    .sort((a, b) => b.enrolledCount - a.enrolledCount)
    .slice(0, 4);

  const recentUsers = mockUsers.slice(0, 5);

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Welcome back, Admin</p>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Platform Overview
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              Full Analytics
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/courses">
              <Eye className="mr-2 h-4 w-4" />
              Review Queue
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden group hover-lift">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 ${
                  stat.changeType === 'up' ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]' :
                  stat.changeType === 'warning' ? 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {stat.changeType === 'up' && <ArrowUpRight className="h-3 w-3" />}
                  {stat.changeType === 'down' && <ArrowDownRight className="h-3 w-3" />}
                  {stat.changeType === 'warning' && <Activity className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.subtitle}</p>
            </CardContent>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/40 to-accent/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed - Takes 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest platform events</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {recentActivity.map((item, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 py-3">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      item.type === 'report' ? 'bg-destructive/10 text-destructive' :
                      item.type === 'signup' ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]' :
                      item.type === 'course' ? 'bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]' :
                      'bg-primary/10 text-primary'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.user}</span>{' '}
                        <span className="text-muted-foreground">{item.action}</span>{' '}
                        {item.target && <span className="font-medium">{item.target}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                  {i < recentActivity.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions + Pending */}
        <div className="space-y-6">
          {/* Pending Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-lg">Review Queue</CardTitle>
                <Badge variant="outline" className="tabular-nums">
                  {pendingCourses.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {pendingCourses.length === 0 ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--success))]/10">
                    <CheckCircle className="h-6 w-6 text-[hsl(var(--success))]" />
                  </div>
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No courses pending review</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingCourses.slice(0, 3).map((course) => {
                    const instructor = mockUsers.find(u => u.id === course.instructorId);
                    return (
                      <div key={course.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {instructor?.name || 'Unknown'}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-[hsl(var(--success))] hover:text-[hsl(var(--success))]">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/admin/courses">
                      View All Reviews
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Course completion rate</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Student satisfaction</span>
                  <span className="font-medium">4.5/5.0</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Active this week</span>
                  <span className="font-medium">73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg">Top Courses</CardTitle>
                <CardDescription>By enrollment</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/courses" className="text-muted-foreground">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {topCourses.map((course, i) => {
                const instructor = mockUsers.find(u => u.id === course.instructorId);
                const maxEnroll = topCourses[0]?.enrolledCount || 1;
                return (
                  <div key={course.id} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground/50 w-6 text-center tabular-nums">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={(course.enrolledCount / maxEnroll) * 100} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          {course.enrolledCount} students
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg">Recent Users</CardTitle>
                <CardDescription>Latest sign-ups</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/users" className="text-muted-foreground">
                  Manage
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {recentUsers.map((user, i) => (
                <div key={user.id}>
                  <div className="flex items-center gap-3 py-2.5">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs ${
                        user.role === 'admin' ? 'border-destructive/30 text-destructive' :
                        user.role === 'instructor' ? 'border-[hsl(var(--info))]/30 text-[hsl(var(--info))]' :
                        'border-primary/30 text-primary'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </div>
                  {i < recentUsers.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
