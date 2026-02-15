import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  ShieldAlert, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockCourses, mockUsers } from '@/data/mockData';

export default function AdminDashboard() {
  const pendingCourses = mockCourses.filter(c => c.status === 'under_review');
  const totalUsers = mockUsers.length;
  const totalCourses = mockCourses.length;
  const publishedCourses = mockCourses.filter(c => c.status === 'published').length;

  const stats = [
    { 
      label: 'Total Users', 
      value: totalUsers, 
      icon: Users,
      trend: '+12 this week',
      color: 'text-blue-500'
    },
    { 
      label: 'Total Courses', 
      value: totalCourses, 
      icon: BookOpen,
      trend: `${publishedCourses} published`,
      color: 'text-primary'
    },
    { 
      label: 'Pending Review', 
      value: pendingCourses.length, 
      icon: Clock,
      trend: 'Needs attention',
      color: 'text-yellow-500'
    },
    { 
      label: 'Reports', 
      value: 3, 
      icon: ShieldAlert,
      trend: '2 new this week',
      color: 'text-destructive'
    },
  ];

  const recentUsers = mockUsers.slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Pending Course Reviews</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/courses">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingCourses.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">No courses pending review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCourses.slice(0, 3).map((course) => {
                  const instructor = mockUsers.find(u => u.id === course.instructorId);
                  return (
                    <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 rounded bg-gradient-to-br from-primary/20 to-accent/20" />
                        <div>
                          <p className="font-medium text-sm">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            by {instructor?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="h-8">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Recent Users</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/users">
                Manage Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-500/10 text-green-600">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
