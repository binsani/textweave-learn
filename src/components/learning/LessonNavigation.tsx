import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course, Lesson } from '@/types';
import { cn } from '@/lib/utils';

interface LessonNavigationProps {
  course: Course;
  currentLessonId: string;
  className?: string;
}

export function LessonNavigation({ course, currentLessonId, className }: LessonNavigationProps) {
  // Flatten all lessons in order
  const allLessons: Lesson[] = course.sections
    .sort((a, b) => a.order - b.order)
    .flatMap(section => 
      section.lessons.sort((a, b) => a.order - b.order)
    );

  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (!prevLesson && !nextLesson) return null;

  return (
    <div className={cn('flex items-center justify-between gap-4 pt-8 border-t border-border', className)}>
      {prevLesson ? (
        <Button
          variant="outline"
          asChild
          className="flex-1 max-w-xs justify-start h-auto py-3"
        >
          <Link to={`/learn/${course.id}/${prevLesson.id}`}>
            <ChevronLeft className="h-4 w-4 mr-2 shrink-0" />
            <div className="text-left truncate">
              <p className="text-xs text-muted-foreground mb-0.5">Previous</p>
              <p className="font-medium truncate">{prevLesson.title}</p>
            </div>
          </Link>
        </Button>
      ) : (
        <div />
      )}

      {nextLesson ? (
        <Button
          variant="default"
          asChild
          className="flex-1 max-w-xs justify-end h-auto py-3"
        >
          <Link to={`/learn/${course.id}/${nextLesson.id}`}>
            <div className="text-right truncate">
              <p className="text-xs opacity-80 mb-0.5">Next</p>
              <p className="font-medium truncate">{nextLesson.title}</p>
            </div>
            <ChevronRight className="h-4 w-4 ml-2 shrink-0" />
          </Link>
        </Button>
      ) : (
        <Button variant="default" asChild className="flex-1 max-w-xs">
          <Link to={`/courses/${course.id}`}>
            Complete Course
          </Link>
        </Button>
      )}
    </div>
  );
}
