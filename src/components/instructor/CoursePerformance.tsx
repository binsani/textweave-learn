import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Course } from '@/types';

interface CoursePerformanceProps {
  courses: Course[];
}

export function CoursePerformance({ courses }: CoursePerformanceProps) {
  // Calculate performance metrics for each course
  const courseMetrics = courses.slice(0, 5).map((course) => {
    const completionRate = Math.round(Math.random() * 40 + 50); // Mock: 50-90%
    const avgRating = course.rating;
    const trend = Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
    const trendValue = Math.round(Math.random() * 15 + 1);

    return {
      id: course.id,
      title: course.title,
      students: course.enrollmentCount || course.enrolledCount,
      completionRate,
      avgRating,
      trend,
      trendValue,
      revenue: course.price * (course.enrollmentCount || course.enrolledCount) * 0.7,
    };
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Course Performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Completion rates and student engagement
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {courseMetrics.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No courses to display
          </p>
        ) : (
          courseMetrics.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm line-clamp-1">{course.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {course.students.toLocaleString()} students
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ⭐ {course.avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {getTrendIcon(course.trend)}
                  <span className={`text-xs font-medium ${getTrendColor(course.trend)}`}>
                    {course.trend === 'stable' ? '0%' : `${course.trend === 'up' ? '+' : '-'}${course.trendValue}%`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={course.completionRate} className="h-2 flex-1" />
                <Badge variant="secondary" className="text-xs shrink-0">
                  {course.completionRate}% completion
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
