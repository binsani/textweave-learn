import { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Menu, PanelRight, PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourseById, dbCourseToCardProps } from '@/hooks/useCourses';
import { useUIStore } from '@/stores/uiStore';
import { useProgressStore } from '@/stores/progressStore';
import {
  CourseSidebar,
  NotesPanel,
  MarkdownRenderer,
  LessonHeader,
  LessonNavigation,
} from '@/components/learning';
import { Course, Lesson, Section } from '@/types';

function LessonSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/6" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
}

export default function LearningInterface() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  const lessonSidebarOpen = useUIStore(state => state.lessonSidebarOpen);
  const notesPanelOpen = useUIStore(state => state.notesPanelOpen);
  const toggleLessonSidebar = useUIStore(state => state.toggleLessonSidebar);
  const toggleNotesPanel = useUIStore(state => state.toggleNotesPanel);
  
  const initCourseProgress = useProgressStore(state => state.initCourseProgress);
  const updateLastAccessed = useProgressStore(state => state.updateLastAccessed);

  const { data: dbCourse, isLoading: courseLoading } = useCourseById(courseId);
  const course: Course | undefined = useMemo(
    () => dbCourse ? dbCourseToCardProps(dbCourse) : undefined,
    [dbCourse]
  );
  
  const findLesson = (): { lesson: Lesson | null; section: Section | null } => {
    if (!course) return { lesson: null, section: null };
    
    for (const section of course.sections) {
      const lesson = section.lessons.find(l => l.id === lessonId);
      if (lesson) return { lesson, section };
    }
    return { lesson: null, section: null };
  };

  const { lesson, section } = findLesson();

  // Initialize progress and update last accessed
  useEffect(() => {
    if (course && lesson) {
      const totalLessons = course.sections.reduce(
        (acc, s) => acc + s.lessons.length, 
        0
      );
      initCourseProgress(course.id, totalLessons);
      updateLastAccessed(course.id, lesson.id);
    }
  }, [course?.id, lesson?.id, initCourseProgress, updateLastAccessed]);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [lessonId]);

  // Redirect if course not found
  if (!course) {
    return <Navigate to="/catalog" replace />;
  }

  // Redirect to first lesson if no lesson specified
  if (!lessonId && course.sections.length > 0 && course.sections[0].lessons.length > 0) {
    return <Navigate to={`/learn/${courseId}/${course.sections[0].lessons[0].id}`} replace />;
  }

  // Redirect if lesson not found
  if (!lesson || !section) {
    return <Navigate to={`/courses/${courseId}`} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Course Sidebar */}
      <CourseSidebar
        course={course}
        currentLessonId={lesson.id}
        isOpen={lessonSidebarOpen}
        onClose={toggleLessonSidebar}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLessonSidebar}
                className="shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-xs">
                {course.title}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNotesPanel}
              className="gap-2"
            >
              {notesPanelOpen ? (
                <>
                  <PanelRightClose className="h-4 w-4" />
                  <span className="hidden sm:inline">Hide Notes</span>
                </>
              ) : (
                <>
                  <PanelRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Show Notes</span>
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Lesson Content */}
        <ScrollArea className="flex-1">
          <div className="container max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12">
            {isLoading ? (
              <LessonSkeleton />
            ) : (
              <>
                <LessonHeader 
                  lesson={lesson} 
                  courseId={course.id} 
                  sectionTitle={section.title}
                />
                
                <article className="prose-academic">
                  <MarkdownRenderer content={lesson.content} />
                </article>

                <LessonNavigation 
                  course={course} 
                  currentLessonId={lesson.id} 
                  className="mt-12"
                />
              </>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Notes Panel */}
      <NotesPanel
        courseId={course.id}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        isOpen={notesPanelOpen}
        onClose={toggleNotesPanel}
      />

    </div>
  );
}
