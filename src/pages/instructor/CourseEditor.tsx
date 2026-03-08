import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isNewCourse = courseId === 'new';

  const { data: dbCourse, isLoading } = useCourseById(isNewCourse ? undefined : courseId);

  // Initialize course data
  const [course, setCourse] = useState<Partial<Course>>(() => {
    if (isNewCourse) {
      return {
        id: `course-${Date.now()}`,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  // Populate from DB when loaded
  useEffect(() => {
    if (dbCourse && !isNewCourse) {
      const mapped = dbCourseToCardProps(dbCourse);
      setCourse(mapped);
      setSections(mapped.sections || []);
    }
  }, [dbCourse, isNewCourse]);

  useEffect(() => {
    setHasChanges(true);
  }, [course, sections]);

  if (!isNewCourse && isLoading) return <PageLoader />;

  const handleSaveDetails = (data: any) => {
    setCourse({ ...course, ...data, updatedAt: new Date().toISOString() });
    toast.success('Course details saved');
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
    toast.success('Lesson saved');
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

  const handlePublish = () => {
    setCourse({ ...course, status: 'pending_review' });
    toast.success('Course submitted for review');
  };

  const handleSaveAll = () => {
    setCourse({ ...course, sections, updatedAt: new Date().toISOString() });
    setHasChanges(false);
    toast.success('All changes saved');
  };

  const getStatusBadge = () => {
    switch (course.status) {
      case 'published':
        return <Badge className="bg-green-500/10 text-green-600 border-0">Published</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-500/10 text-amber-600 border-0">Under Review</Badge>;
      case 'draft':
      default:
        return <Badge variant="secondary">Draft</Badge>;
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
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/instructor/dashboard">
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
          {!isNewCourse && (
            <Button variant="outline" asChild>
              <Link to={`/courses/${courseId}`}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
          )}
          <Button onClick={handleSaveAll} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {course.status === 'draft' && (
                <DropdownMenuItem onClick={handlePublish}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
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
              vendorId: (course as any).vendorId || '',
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
