import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/stores/progressStore';
import { mockCourses } from '@/data/mockData';

export default function StudentNotes() {
  const { notes, removeNote } = useProgressStore();

  // Flatten all notes with course info
  const allNotes = Object.entries(notes).flatMap(([courseId, lessonNotes]) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return [];
    
    return Object.entries(lessonNotes).map(([lessonId, noteContent]) => {
      let lesson = null;
      let section = null;
      for (const s of course.sections) {
        const l = s.lessons.find(l => l.id === lessonId);
        if (l) {
          lesson = l;
          section = s;
          break;
        }
      }
      return { course, section, lesson, courseId, lessonId, noteContent };
    }).filter(n => n.lesson && n.noteContent);
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">My Notes</h1>
        <p className="text-muted-foreground">
          All your personal notes from lessons
        </p>
      </div>

      {allNotes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">
              Take notes while learning to review them here
            </p>
            <Button asChild>
              <Link to="/student/courses">Go to My Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {allNotes.map(({ course, section, lesson, courseId, lessonId, noteContent }) => (
            <Card key={`${courseId}-${lessonId}`} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {course?.title} / {section?.title}
                    </p>
                    <h3 className="font-medium text-foreground">
                      {lesson?.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeNote(courseId, lessonId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/student/learn/${courseId}/${lessonId}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Lesson
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap">
                  {noteContent}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
