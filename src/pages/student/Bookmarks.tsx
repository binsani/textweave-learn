import { Link } from 'react-router-dom';
import { BookMarked, ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/stores/progressStore';
import { mockCourses } from '@/data/mockData';

export default function StudentBookmarks() {
  const { bookmarks, removeBookmark } = useProgressStore();

  // Flatten all bookmarks with course info
  const allBookmarks = Object.entries(bookmarks).flatMap(([courseId, lessonIds]) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course || !Array.isArray(lessonIds)) return [];
    
    return lessonIds.map(lessonId => {
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
      return { course, section, lesson, courseId, lessonId };
    }).filter(b => b.lesson);
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Bookmarks</h1>
        <p className="text-muted-foreground">
          Quick access to your saved lessons
        </p>
      </div>

      {allBookmarks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-4">
              Bookmark lessons to access them quickly later
            </p>
            <Button asChild>
              <Link to="/student/courses">Go to My Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allBookmarks.map(({ course, section, lesson, courseId, lessonId }) => (
            <Card key={`${courseId}-${lessonId}`} className="group hover-lift">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      {course?.title} / {section?.title}
                    </p>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {lesson?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lesson?.readingTime} min read
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeBookmark(courseId, lessonId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/student/learn/${courseId}/${lessonId}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
