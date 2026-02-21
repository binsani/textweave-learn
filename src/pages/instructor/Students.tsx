import { useState } from 'react';
import { 
  Search, 
  Download, 
  Mail,
  MoreVertical,
  User,
  BookOpen,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StudentRow {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  enrolledCourses: string[];
  progress: number;
  lastActive: string;
  completedCourses: number;
}

export default function InstructorStudents() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch instructor's courses first
  const { data: instructorCourses = [] } = useQuery({
    queryKey: ['instructor-course-list', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const courseIds = instructorCourses.map(c => c.id);

  // Fetch enrolled students for those courses
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['instructor-students', courseIds],
    queryFn: async () => {
      if (courseIds.length === 0) return [];

      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select('user_id, course_id, enrolled_at, status')
        .in('course_id', courseIds);
      if (error) throw error;
      if (!enrollments?.length) return [];

      const uniqueUserIds = [...new Set(enrollments.map(e => e.user_id))];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .in('id', uniqueUserIds);

      // Fetch progress for these students
      const { data: progress } = await supabase
        .from('course_progress')
        .select('user_id, course_id, is_completed, last_accessed_at')
        .in('course_id', courseIds)
        .in('user_id', uniqueUserIds);

      // Get total lessons per course
      const { data: sections } = await supabase
        .from('sections')
        .select('course_id, lessons(id)')
        .in('course_id', courseIds);

      const totalLessonsPerCourse: Record<string, number> = {};
      for (const s of sections ?? []) {
        totalLessonsPerCourse[s.course_id] = (totalLessonsPerCourse[s.course_id] || 0) + (s.lessons?.length || 0);
      }

      const courseNameMap: Record<string, string> = {};
      for (const c of instructorCourses) courseNameMap[c.id] = c.title;

      const profileMap: Record<string, typeof profiles extends (infer T)[] ? T : never> = {};
      for (const p of profiles ?? []) profileMap[p.id] = p;

      // Build student rows
      const studentMap: Record<string, StudentRow> = {};
      for (const e of enrollments) {
        const p = profileMap[e.user_id];
        if (!p) continue;
        if (!studentMap[e.user_id]) {
          const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.email;
          studentMap[e.user_id] = {
            id: e.user_id,
            name,
            email: p.email,
            avatar_url: p.avatar_url,
            enrolledCourses: [],
            progress: 0,
            lastActive: e.enrolled_at,
            completedCourses: 0,
          };
        }
        studentMap[e.user_id].enrolledCourses.push(courseNameMap[e.course_id] || 'Unknown');
      }

      // Calculate progress per student
      for (const uid of Object.keys(studentMap)) {
        const userProgress = (progress ?? []).filter(p => p.user_id === uid);
        const userEnrollments = enrollments.filter(e => e.user_id === uid);
        
        let totalLessons = 0;
        let completedLessons = 0;
        let completedCourseCount = 0;
        let latestAccess = studentMap[uid].lastActive;

        for (const e of userEnrollments) {
          const tl = totalLessonsPerCourse[e.course_id] || 0;
          totalLessons += tl;
          const cp = userProgress.filter(p => p.course_id === e.course_id && p.is_completed);
          completedLessons += cp.length;
          if (tl > 0 && cp.length >= tl) completedCourseCount++;
        }

        for (const p of userProgress) {
          if (p.last_accessed_at > latestAccess) latestAccess = p.last_accessed_at;
        }

        studentMap[uid].progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        studentMap[uid].completedCourses = completedCourseCount;
        studentMap[uid].lastActive = latestAccess;
      }

      return Object.values(studentMap);
    },
    enabled: courseIds.length > 0,
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = 
      courseFilter === 'All Courses' || 
      student.enrolledCourses.includes(courseFilter);
    return matchesSearch && matchesCourse;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const avgProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    : 0;
  const completionRate = students.length > 0
    ? Math.round((students.filter(s => s.completedCourses > 0).length / students.length) * 100)
    : 0;

  const courseFilterOptions = ['All Courses', ...instructorCourses.map(c => c.title)];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Students</h1>
          <p className="text-muted-foreground">Manage and engage with your students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Email All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{students.length}</div>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {students.filter(s => {
                    const lastActive = new Date(s.lastActive);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return lastActive >= weekAgo;
                  }).length}
                </div>
                <p className="text-sm text-muted-foreground">Active This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{avgProgress}%</div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{completionRate}%</div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                {courseFilterOptions.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Last Active</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Enrolled Courses</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.enrolledCourses.map((course) => (
                        <Badge key={course} variant="secondary" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Progress value={student.progress} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-10">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(student.lastActive).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.completedCourses > 0 ? 'default' : 'outline'}>
                      {student.completedCourses} course{student.completedCourses !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Progress
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {sortedStudents.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {students.length === 0 ? 'No students have enrolled in your courses yet.' : 'No students found matching your criteria.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
