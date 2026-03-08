import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Eye,
  MoreVertical,
  Send,
  Archive,
  Trash2,
  Settings,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCourseById, dbCourseToCardProps } from '@/hooks/useCourses';
import {
  CourseMetadataForm,
  SectionManager,
  LessonEditor,
  QuizEditor,
} from '@/components/course-editor';
import { PageLoader } from '@/components/PageLoader';
import type { Course, Section, Lesson, Quiz } from '@/types';

type EditorView = 'details' | 'curriculum' | 'lesson' | 'quiz';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    || `course-${Date.now()}`;
}

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isNewCourse = courseId === 'new';

  const { data: dbCourse, isLoading } = useCourseById(isNewCourse ? undefined : courseId);

  // Initialize course data
  const [course, setCourse] = useState<Partial<Course>>(() => {
    if (isNewCourse) {
      return {
        title: '',
        slug: '',
        description: '',
        shortDescription: '',
        instructorId: user?.id || '',
        category: 'programming',
        tags: [],
        level: 'beginner',
        status: 'draft',
        sections: [],
        totalLessons: 0,
        totalDuration: 0,
        enrolledCount: 0,
        estimatedHours: 0,
        learningObjectives: [],
        requirements: [],
        rating: 0,
        reviewCount: 0,
        price: 0,
        isFree: true,
      };
    }
    return {};
  });

  const [sections, setSections] = useState<Section[]>(course.sections || []);
  const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('details');
  const [editorView, setEditorView] = useState<EditorView>('details');
  const [editingLesson, setEditingLesson] = useState<{ sectionId: string; lesson: Lesson } | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{ lessonId: string; lessonTitle: string; quiz: Quiz | null } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [courseDbId, setCourseDbId] = useState<string | null>(isNewCourse ? null : courseId || null);

  // Populate from DB when loaded
  useEffect(() => {
    if (dbCourse && !isNewCourse) {
      const mapped = dbCourseToCardProps(dbCourse);
      setCourse(mapped);
      setSections(mapped.sections || []);
      setCourseDbId(dbCourse.id);
    }
  }, [dbCourse, isNewCourse]);

  useEffect(() => {
    setHasChanges(true);
  }, [course, sections]);

  // Save course mutation
  const saveMutation = useMutation({
    mutationFn: async ({ courseData, sectionsData, newStatus }: { 
      courseData: Partial<Course>; 
      sectionsData: Section[];
      newStatus?: 'draft' | 'pending_review';
    }) => {
      const slug = courseData.slug || generateSlug(courseData.title || 'untitled');
      const status = newStatus || (courseData.status as 'draft' | 'pending_review' | 'published' | 'archived') || 'draft';
      
      let savedCourseId = courseDbId;

      if (!savedCourseId) {
        // Create new course
        const { data: newCourse, error: courseError } = await supabase
          .from('courses')
          .insert({
            title: courseData.title || 'Untitled Course',
            slug,
            description: courseData.description || '',
            short_description: courseData.shortDescription || '',
            instructor_id: user?.id!,
            category: courseData.category || 'programming',
            level: courseData.level || 'beginner',
            status: status as 'draft' | 'pending_review' | 'published' | 'archived',
            tags: courseData.tags || [],
            learning_objectives: courseData.learningObjectives || [],
            requirements: courseData.requirements || [],
            price: courseData.price || 0,
            is_free: courseData.isFree ?? true,
            estimated_hours: courseData.estimatedHours || 0,
          })
          .select()
          .single();

        if (courseError) throw courseError;
        savedCourseId = newCourse.id;
      } else {
        // Update existing course
        const { error: courseError } = await supabase
          .from('courses')
          .update({
            title: courseData.title || 'Untitled Course',
            slug,
            description: courseData.description || '',
            short_description: courseData.shortDescription || '',
            category: courseData.category || 'programming',
            level: courseData.level || 'beginner',
            status: status as 'draft' | 'pending_review' | 'published' | 'archived',
            tags: courseData.tags || [],
            learning_objectives: courseData.learningObjectives || [],
            requirements: courseData.requirements || [],
            price: courseData.price || 0,
            is_free: courseData.isFree ?? true,
            estimated_hours: courseData.estimatedHours || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', savedCourseId);

        if (courseError) throw courseError;
      }

      // Save sections and lessons
      for (let sIdx = 0; sIdx < sectionsData.length; sIdx++) {
        const section = sectionsData[sIdx];
        const isNewSection = section.id.startsWith('section-') && section.id.includes('-');
        
        let sectionId = section.id;

        if (isNewSection) {
          // Create new section
          const { data: newSection, error: sectionError } = await supabase
            .from('sections')
            .insert({
              course_id: savedCourseId,
              title: section.title,
              description: section.description || null,
              order: sIdx,
            })
            .select()
            .single();

          if (sectionError) throw sectionError;
          sectionId = newSection.id;
        } else {
          // Update existing section
          const { error: sectionError } = await supabase
            .from('sections')
            .update({
              title: section.title,
              description: section.description || null,
              order: sIdx,
            })
            .eq('id', sectionId);

          if (sectionError) throw sectionError;
        }

        // Save lessons
        for (let lIdx = 0; lIdx < section.lessons.length; lIdx++) {
          const lesson = section.lessons[lIdx];
          const isNewLesson = lesson.id.startsWith('lesson-') && lesson.id.includes('-');

          if (isNewLesson) {
            // Create new lesson
            const { error: lessonError } = await supabase
              .from('lessons')
              .insert({
                section_id: sectionId,
                title: lesson.title,
                slug: lesson.slug || generateSlug(lesson.title),
                content: lesson.content || '',
                order: lIdx,
                reading_time: lesson.readingTime || 5,
                is_free: lesson.isFree || false,
                has_quiz: lesson.hasQuiz || false,
              });

            if (lessonError) throw lessonError;
          } else {
            // Update existing lesson
            const { error: lessonError } = await supabase
              .from('lessons')
              .update({
                section_id: sectionId,
                title: lesson.title,
                slug: lesson.slug || generateSlug(lesson.title),
                content: lesson.content || '',
                order: lIdx,
                reading_time: lesson.readingTime || 5,
                is_free: lesson.isFree || false,
                has_quiz: lesson.hasQuiz || false,
              })
              .eq('id', lesson.id);

            if (lessonError) throw lessonError;
          }
        }
      }

      return { courseId: savedCourseId, status };
    },
    onSuccess: ({ courseId: savedId, status }) => {
      setCourseDbId(savedId);
      setCourse(prev => ({ ...prev, status }));
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['course', savedId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      if (isNewCourse && savedId) {
        navigate(`/instructor/courses/${savedId}/edit`, { replace: true });
      }
    },
  });

  if (!isNewCourse && isLoading) return <PageLoader />;

  const handleSaveDetails = async (data: any) => {
    setCourse({ ...course, ...data });
    toast.success('Course details updated locally. Click Save to persist.');
  };

  const handleSectionsChange = (newSections: Section[]) => {
    setSections(newSections);
  };

  const handleEditLesson = (sectionId: string, lessonId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const lesson = section?.lessons.find(l => l.id === lessonId);
    if (lesson) {
      setEditingLesson({ sectionId, lesson });
      setEditorView('lesson');
    }
  };

  const handleSaveLesson = (updatedLesson: Lesson) => {
    if (!editingLesson) return;
    setSections(
      sections.map(s =>
        s.id === editingLesson.sectionId
          ? { ...s, lessons: s.lessons.map(l => (l.id === updatedLesson.id ? updatedLesson : l)) }
          : s
      )
    );
    setEditingLesson(null);
    setEditorView('curriculum');
    toast.success('Lesson saved locally. Click Save to persist.');
  };

  const handleEditQuiz = (lessonId: string, quizId?: string) => {
    let foundLesson: Lesson | undefined;
    for (const section of sections) {
      foundLesson = section.lessons.find(l => l.id === lessonId);
      if (foundLesson) break;
    }
    if (foundLesson) {
      const existingQuiz: Quiz | null = quizId
        ? { id: quizId, lessonId, title: `${foundLesson.title} Quiz`, questions: [], passingScore: 70 }
        : null;
      setEditingQuiz({ lessonId, lessonTitle: foundLesson.title, quiz: existingQuiz });
      setEditorView('quiz');
    }
  };

  const handleSaveQuiz = (quiz: Quiz) => {
    setSections(
      sections.map(s => ({
        ...s,
        lessons: s.lessons.map(l =>
          l.id === quiz.lessonId ? { ...l, hasQuiz: true, quizId: quiz.id } : l
        ),
      }))
    );
    setEditingQuiz(null);
    setEditorView('curriculum');
    toast.success('Quiz saved');
  };

  const handleSubmitForReview = () => {
    saveMutation.mutate(
      { courseData: course, sectionsData: sections, newStatus: 'pending_review' },
      {
        onSuccess: () => {
          toast.success('Course submitted for review! An admin will review it shortly.');
        },
        onError: (error) => {
          toast.error(`Failed to submit: ${error.message}`);
        },
      }
    );
  };

  const handleSaveAll = () => {
    saveMutation.mutate(
      { courseData: course, sectionsData: sections },
      {
        onSuccess: () => {
          toast.success('All changes saved');
        },
        onError: (error) => {
          toast.error(`Failed to save: ${error.message}`);
        },
      }
    );
  };

  const getStatusBadge = () => {
    switch (course.status) {
      case 'published':
        return <Badge className="bg-accent/10 text-accent-foreground border-0">Published</Badge>;
      case 'pending_review':
        return <Badge className="bg-primary/10 text-primary border-0">Under Review</Badge>;
      case 'draft':
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (course.status) {
      case 'published':
        return 'This course is live and visible to students.';
      case 'pending_review':
        return 'This course is awaiting admin approval. You can still make edits.';
      case 'draft':
      default:
        return 'This course is a draft. Submit for review when ready to publish.';
    }
  };

  if (editorView === 'lesson' && editingLesson) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <LessonEditor
          lesson={editingLesson.lesson}
          onSave={handleSaveLesson}
          onBack={() => { setEditingLesson(null); setEditorView('curriculum'); }}
        />
      </div>
    );
  }

  if (editorView === 'quiz' && editingQuiz) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <QuizEditor
          quiz={editingQuiz.quiz}
          lessonId={editingQuiz.lessonId}
          lessonTitle={editingQuiz.lessonTitle}
          onSave={handleSaveQuiz}
          onBack={() => { setEditingQuiz(null); setEditorView('curriculum'); }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/instructor/courses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold">
                {isNewCourse ? 'Create New Course' : 'Edit Course'}
              </h1>
              {!isNewCourse && getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {course.title || 'Untitled Course'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNewCourse && courseDbId && (
            <Button variant="outline" asChild>
              <Link to={`/courses/${courseDbId}`}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
          )}
          <Button onClick={handleSaveAll} disabled={!hasChanges || saveMutation.isPending}>
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(course.status === 'draft' || course.status === undefined) && (
                <DropdownMenuItem onClick={handleSubmitForReview} disabled={saveMutation.isPending}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </DropdownMenuItem>
              )}
              {course.status === 'pending_review' && (
                <DropdownMenuItem disabled>
                  <Send className="h-4 w-4 mr-2" />
                  Awaiting Review...
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive Course
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status message */}
      <div className="mb-6 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
        {getStatusMessage()}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'details' | 'curriculum')}>
        <TabsList className="mb-6">
          <TabsTrigger value="details" className="gap-2">
            <Settings className="h-4 w-4" />
            Course Details
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Curriculum
            {sections.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {sections.reduce((acc, s) => acc + s.lessons.length, 0)}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <CourseMetadataForm
            initialData={{
              title: course.title,
              shortDescription: course.shortDescription,
              description: course.description,
              category: course.category,
              level: course.level,
              price: course.price,
              isFree: course.isFree,
              learningObjectives: course.learningObjectives,
              requirements: course.requirements,
              tags: course.tags,
            }}
            onSave={handleSaveDetails}
          />
        </TabsContent>

        <TabsContent value="curriculum" className="mt-0">
          <SectionManager
            sections={sections}
            onSectionsChange={handleSectionsChange}
            onEditLesson={handleEditLesson}
            onEditQuiz={handleEditQuiz}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
