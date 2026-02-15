import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  Lock,
  BookOpen,
  Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Course, Section, Lesson } from '@/types';
import { useProgressStore } from '@/stores/progressStore';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';

interface CourseSidebarProps {
  course: Course;
  currentLessonId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseSidebar({ course, currentLessonId, isOpen, onClose }: CourseSidebarProps) {
  const { lessonId } = useParams();
  const activeLessonId = currentLessonId || lessonId;
  const isMobile = useIsMobile();
  
  const courseProgress = useProgressStore(state => state.getCourseProgress(course.id));
  const completedLessons = courseProgress?.completedLessons || [];
  
  // Find which section contains the current lesson
  const currentSection = course.sections.find(s => 
    s.lessons.some(l => l.id === activeLessonId)
  );
  
  // Track open sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Default: open the section containing current lesson
    const initial: Record<string, boolean> = {};
    course.sections.forEach(s => {
      initial[s.id] = s.id === currentSection?.id || s.order === 1;
    });
    return initial;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getTotalLessons = () => {
    return course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  };

  const progressPercentage = courseProgress?.progressPercentage || 0;

  const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId);

  const getLessonIcon = (lesson: Lesson) => {
    if (isLessonCompleted(lesson.id)) {
      return <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />;
    }
    if (!lesson.isFree && !courseProgress) {
      return <Lock className="h-4 w-4 text-muted-foreground shrink-0" />;
    }
    return <Circle className="h-4 w-4 text-muted-foreground shrink-0" />;
  };

  const handleLessonClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  // Sidebar content - shared between mobile and desktop
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
            onClick={handleLessonClick}
          >
            <Link to={`/courses/${course.id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Link>
          </Button>
          
          {/* Mobile close button */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          )}
        </div>

        <h2 className="font-serif font-semibold text-foreground line-clamp-2 mb-3">
          {course.title}
        </h2>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedLessons.length} of {getTotalLessons()} lessons completed
          </p>
        </div>
      </div>

      {/* Sections & Lessons */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {course.sections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                      {section.order}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm line-clamp-1">
                        {section.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {section.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform duration-200',
                      openSections[section.id] && 'rotate-180'
                    )}
                  />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-4 pl-4 border-l border-border space-y-1 py-1">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = isLessonCompleted(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        to={`/learn/${course.id}/${lesson.id}`}
                        onClick={handleLessonClick}
                        className={cn(
                          'flex items-start gap-3 p-2.5 rounded-lg text-sm transition-all duration-200',
                          isActive
                            ? 'bg-primary/10 text-primary border-l-2 border-primary -ml-px pl-[calc(0.625rem+1px)]'
                            : 'text-foreground hover:bg-muted/50',
                          isCompleted && !isActive && 'text-muted-foreground'
                        )}
                      >
                        {getLessonIcon(lesson)}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'line-clamp-2 leading-tight',
                            isActive && 'font-medium'
                          )}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.readingTime} min
                            </span>
                            {lesson.hasQuiz && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                Quiz
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile: drawer with backdrop
  if (isMobile) {
    return (
      <>
        {/* Backdrop overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/* Sidebar drawer */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border shadow-xl',
            'transform transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: standard sidebar
  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-card border-r border-border shrink-0">
      {sidebarContent}
    </aside>
  );
}
