import { Clock, BookOpen, Bookmark, BookmarkCheck, CheckCircle2, Circle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lesson } from '@/types';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';

interface LessonHeaderProps {
  lesson: Lesson;
  courseId: string;
  sectionTitle: string;
}

export function LessonHeader({ lesson, courseId, sectionTitle }: LessonHeaderProps) {
  const courseProgress = useProgressStore(state => state.getCourseProgress(courseId));
  const markLessonComplete = useProgressStore(state => state.markLessonComplete);
  const markLessonIncomplete = useProgressStore(state => state.markLessonIncomplete);
  const isLessonBookmarked = useProgressStore(state => state.isLessonBookmarked);
  const addBookmark = useProgressStore(state => state.addBookmark);
  const removeBookmark = useProgressStore(state => state.removeBookmark);

  const isCompleted = courseProgress?.completedLessons.includes(lesson.id) || false;
  const isBookmarked = isLessonBookmarked(courseId, lesson.id);

  const toggleComplete = () => {
    if (isCompleted) {
      markLessonIncomplete(courseId, lesson.id);
    } else {
      markLessonComplete(courseId, lesson.id);
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(courseId, lesson.id);
    } else {
      addBookmark(courseId, lesson.id, lesson.title);
    }
  };

  return (
    <header className="mb-8">
      {/* Breadcrumb / Section */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <span>{sectionTitle}</span>
        <span>•</span>
        <span>Lesson {lesson.order}</span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
        {lesson.title}
      </h1>

      {/* Meta & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {lesson.readingTime} min read
          </Badge>
          {lesson.hasQuiz && lesson.quizId && (
            <Link to={`/learn/${courseId}/${lesson.id}/quiz/${lesson.quizId}`}>
              <Badge variant="outline" className="flex items-center gap-1.5 cursor-pointer hover:bg-primary/5 transition-colors">
                <BookOpen className="h-3.5 w-3.5" />
                Take Quiz
              </Badge>
            </Link>
          )}
          {lesson.hasQuiz && !lesson.quizId && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Includes Quiz
            </Badge>
          )}
          {lesson.isFree && (
            <Badge variant="secondary">
              Free Preview
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleBookmark}
            className={cn(
              isBookmarked && 'border-primary text-primary'
            )}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-2" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>

          <Button
            variant={isCompleted ? 'default' : 'outline'}
            size="sm"
            onClick={toggleComplete}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <Circle className="h-4 w-4 mr-2" />
            )}
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>
      </div>
    </header>
  );
}
