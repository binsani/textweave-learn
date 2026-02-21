import { Link } from 'react-router-dom';
import { BookOpen, Clock, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useEnrolledCourses, useCourseProgress } from '@/hooks/useEnrollments';
import type { Course } from '@/types';

export default function StudentCourses() {
  const { data: enrolledCourses = [], isLoading } = useEnrolledCourses();
  const { data: progressMap = {} } = useCourseProgress();

  const getProgressForCourse = (courseId: string, totalLessons: number) => {
    const p = progressMap[courseId];
    if (!p || totalLessons === 0) return 0;
    return Math.round((p.completedLessons.length / totalLessons) * 100);
  };

  const inProgressCourses = enrolledCourses.filter(c => {
    const p = getProgressForCourse(c.id, c.totalLessons);
    return p > 0 && p < 100;
  });
  const completedCourses = enrolledCourses.filter(c => getProgressForCourse(c.id, c.totalLessons) === 100);
  const notStartedCourses = enrolledCourses.filter(c => getProgressForCourse(c.id, c.totalLessons) === 0);

  const CourseCard = ({ course }: { course: Course }) => {
    const totalLessons = course.totalLessons;
    const progress = getProgressForCourse(course.id, totalLessons);
    const isCompleted = progress === 100;

    return (
      <Card className="group hover-lift overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 h-32 md:h-auto shrink-0 bg-gradient-to-br from-primary/20 to-accent/20 relative">
            {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />}
            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                <CheckCircle className="h-10 w-10 text-primary-foreground" />
              </div>
            )}
          </div>
          <CardContent className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline" className="capitalize">{course.level}</Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{totalLessons} lessons</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{course.estimatedHours}h</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isCompleted ? 'text-primary font-medium' : 'text-muted-foreground'}>
                      {isCompleted ? 'Completed!' : `${progress}% complete`}
                    </span>
                    <span className="text-muted-foreground">{Math.round(progress / 100 * totalLessons)}/{totalLessons} lessons</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              <Button asChild className="shrink-0">
                <Link to={`/learn/${course.id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  {progress === 0 ? 'Start' : isCompleted ? 'Review' : 'Continue'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  const EmptyState = ({ message, showBrowse = true }: { message: string; showBrowse?: boolean }) => (
    <div className="text-center py-12">
      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      {showBrowse && <Button asChild><Link to="/courses">Browse Courses</Link></Button>}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">My Courses</h1>
        <p className="text-muted-foreground">Track your progress and continue learning</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
          <TabsTrigger value="not-started">Not Started ({notStartedCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {enrolledCourses.length === 0 ? <EmptyState message="You haven't enrolled in any courses yet." /> : enrolledCourses.map(c => <CourseCard key={c.id} course={c} />)}
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          {inProgressCourses.length === 0 ? <EmptyState message="No courses in progress." showBrowse={false} /> : inProgressCourses.map(c => <CourseCard key={c.id} course={c} />)}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedCourses.length === 0 ? <EmptyState message="You haven't completed any courses yet." showBrowse={false} /> : completedCourses.map(c => <CourseCard key={c.id} course={c} />)}
        </TabsContent>
        <TabsContent value="not-started" className="space-y-4">
          {notStartedCourses.length === 0 ? <EmptyState message="All your courses are in progress or completed!" showBrowse={false} /> : notStartedCourses.map(c => <CourseCard key={c.id} course={c} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
