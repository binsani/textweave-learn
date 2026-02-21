import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { BookOpen, Clock, Trophy, TrendingUp, ArrowRight, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { useEnrolledCourses, useCourseProgress } from '@/hooks/useEnrollments';
import { usePublishedCourses, dbCourseToCardProps } from '@/hooks/useCourses';
import { useMemo } from 'react';

export default function StudentDashboard() {
  useDocumentTitle('Dashboard - Masashi LMS');
  const { user } = useAuthStore();
  const { data: enrolledCourses = [], isLoading: enrollLoading } = useEnrolledCourses();
  const { data: progressMap = {} } = useCourseProgress();
  const { data: dbCourses } = usePublishedCourses();

  const recommendedCourses = useMemo(() => {
    const enrolledIds = new Set(enrolledCourses.map(c => c.id));
    return (dbCourses ?? [])
      .map(dbCourseToCardProps)
      .filter(c => !enrolledIds.has(c.id))
      .slice(0, 3);
  }, [dbCourses, enrolledCourses]);

  const getProgressForCourse = (courseId: string, totalLessons: number) => {
    const p = progressMap[courseId];
    if (!p || totalLessons === 0) return 0;
    return Math.round((p.completedLessons.length / totalLessons) * 100);
  };

  const completedLessonsTotal = Object.values(progressMap).reduce(
    (acc, p) => acc + p.completedLessons.length, 0
  );

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: BookOpen, color: 'text-primary' },
    { label: 'Hours Learning', value: '—', icon: Clock, color: 'text-blue-500' },
    { label: 'Lessons Completed', value: completedLessonsTotal, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Current Streak', value: '—', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!
        </h1>
        <p className="text-muted-foreground">Continue your learning journey. You're doing great!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold">Continue Learning</h2>
          <Button variant="ghost" asChild>
            <Link to="/student/courses">View All<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {enrollLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full rounded-lg" />)}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
              <Button asChild><Link to="/courses">Browse Courses</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {enrolledCourses.slice(0, 2).map((course) => {
              const totalLessons = course.totalLessons;
              const progress = getProgressForCourse(course.id, totalLessons);
              return (
                <Card key={course.id} className="group hover-lift">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-32 md:w-40 shrink-0 bg-gradient-to-br from-primary/20 to-accent/20 relative">
                        {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />}
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-10 w-10 text-background" />
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <Badge variant="secondary" className="mb-2 text-xs">{course.category}</Badge>
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{totalLessons} lessons • {course.estimatedHours}h total</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{progress}% complete</span>
                            <span className="text-muted-foreground">{Math.round(progress / 100 * totalLessons)}/{totalLessons} lessons</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        <Button size="sm" className="mt-3" asChild>
                          <Link to={`/learn/${course.id}`}>{progress > 0 ? 'Continue' : 'Start'} Learning</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold">Recommended for You</h2>
          <Button variant="ghost" asChild>
            <Link to="/courses">Browse All<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {recommendedCourses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <Card className="group hover-lift overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                  {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />}
                  <Badge className="absolute top-3 left-3">{course.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{course.totalLessons} lessons</span>
                    <span className="font-semibold text-primary">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
