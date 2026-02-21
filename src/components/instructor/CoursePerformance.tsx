import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CoursePerformanceProps {
  courses: Course[];
}

export function CoursePerformance({ courses }: CoursePerformanceProps) {
  const courseIds = courses.map(c => c.id);

  // Fetch real completion data
  const { data: progressData } = useQuery({
    queryKey: ['course-performance-progress', courseIds],
    queryFn: async () => {
      if (courseIds.length === 0) return {};
      const { data } = await supabase
        .from('course_progress')
        .select('course_id, is_completed')
        .in('course_id', courseIds);

      // Count completed vs total per course
      const stats: Record<string, { completed: number; total: number }> = {};
      for (const p of data ?? []) {
        if (!stats[p.course_id]) stats[p.course_id] = { completed: 0, total: 0 };
        stats[p.course_id].total++;
        if (p.is_completed) stats[p.course_id].completed++;
      }
      return stats;
    },
    enabled: courseIds.length > 0,
  });

  const courseMetrics = courses.slice(0, 5).map((course) => {
    const stats = progressData?.[course.id];
    const completionRate = stats && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

    return {
      id: course.id,
      title: course.title,
      students: course.enrollmentCount || course.enrolledCount,
      completionRate,
      avgRating: course.rating,
      revenue: course.price * (course.enrollmentCount || course.enrolledCount) * 0.7,
    };
  });

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
