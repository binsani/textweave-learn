import { Link } from 'react-router-dom';
import { BookOpen, Clock, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { mockCourses } from '@/data/mockData';

export default function StudentCourses() {
  const { user } = useAuthStore();
  const { courseProgress } = useProgressStore();

  const enrolledCourseIds = user?.enrolledCourses || ['course-1'];
  const enrolledCourses = mockCourses.filter(c => enrolledCourseIds.includes(c.id));

  const getProgressForCourse = (courseId: string) => {
    const progress = courseProgress[courseId];
    if (!progress) return 0;
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return 0;
    const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
    return totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  };

  const inProgressCourses = enrolledCourses.filter(c => {
    const progress = getProgressForCourse(c.id);
    return progress > 0 && progress < 100;
  });

  const completedCourses = enrolledCourses.filter(c => {
    const progress = getProgressForCourse(c.id);
    return progress === 100;
  });

  const notStartedCourses = enrolledCourses.filter(c => {
    const progress = getProgressForCourse(c.id);
    return progress === 0;
  });

  const CourseCard = ({ course }: { course: typeof mockCourses[0] }) => {
    const progress = getProgressForCourse(course.id);
    const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
    const isCompleted = progress === 100;

    return (
      <Card className="group hover-lift overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="md:w-48 h-32 md:h-auto shrink-0 bg-gradient-to-br from-primary/20 to-accent/20 relative">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            )}
            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                <CheckCircle className="h-10 w-10 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline" className="capitalize">{course.level}</Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.estimatedHours}h
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isCompleted ? 'text-primary font-medium' : 'text-muted-foreground'}>
                      {isCompleted ? 'Completed!' : `${progress}% complete`}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(progress / 100 * totalLessons)}/{totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              {/* Action */}
              <Button asChild className="shrink-0">
                <Link to={`/student/learn/${course.id}`}>
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
      {showBrowse && (
        <Button asChild>
          <Link to="/courses">Browse Courses</Link>
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          Track your progress and continue learning
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
          <TabsTrigger value="not-started">Not Started ({notStartedCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {enrolledCourses.length === 0 ? (
            <EmptyState message="You haven't enrolled in any courses yet." />
          ) : (
            enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressCourses.length === 0 ? (
            <EmptyState message="No courses in progress." showBrowse={false} />
          ) : (
            inProgressCourses.map(course => <CourseCard key={course.id} course={course} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedCourses.length === 0 ? (
            <EmptyState message="You haven't completed any courses yet." showBrowse={false} />
          ) : (
            completedCourses.map(course => <CourseCard key={course.id} course={course} />)
          )}
        </TabsContent>

        <TabsContent value="not-started" className="space-y-4">
          {notStartedCourses.length === 0 ? (
            <EmptyState message="All your courses are in progress or completed!" showBrowse={false} />
          ) : (
            notStartedCourses.map(course => <CourseCard key={course.id} course={course} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
