import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  ChevronDown,
  GripVertical,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileText,
  Clock,
  HelpCircle,
} from 'lucide-react';
import type { Section, Lesson } from '@/types';

interface SectionManagerProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onEditLesson: (sectionId: string, lessonId: string) => void;
  onEditQuiz: (lessonId: string, quizId?: string) => void;
}

export function SectionManager({
  sections,
  onSectionsChange,
  onEditLesson,
  onEditQuiz,
}: SectionManagerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map(s => s.id)));
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingLessonToSection, setAddingLessonToSection] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'section' | 'lesson'; id: string; sectionId?: string } | null>(null);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      courseId: '',
      title: 'New Section',
      order: sections.length + 1,
      lessons: [],
    };
    onSectionsChange([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
    setEditingSectionId(newSection.id);
    setNewSectionTitle('New Section');
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    onSectionsChange(
      sections.map(s => s.id === sectionId ? { ...s, title } : s)
    );
    setEditingSectionId(null);
    setNewSectionTitle('');
  };

  const deleteSection = (sectionId: string) => {
    onSectionsChange(sections.filter(s => s.id !== sectionId));
    setDeleteDialog(null);
  };

  const addLesson = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      sectionId,
      courseId: '',
      title: newLessonTitle || 'New Lesson',
      slug: `new-lesson-${Date.now()}`,
      content: '',
      order: section.lessons.length + 1,
      readingTime: 5,
      isFree: false,
      hasQuiz: false,
    };

    onSectionsChange(
      sections.map(s =>
        s.id === sectionId
          ? { ...s, lessons: [...s.lessons, newLesson] }
          : s
      )
    );
    setAddingLessonToSection(null);
    setNewLessonTitle('');
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    onSectionsChange(
      sections.map(s =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) }
          : s
      )
    );
    setDeleteDialog(null);
  };

  const toggleLessonFree = (sectionId: string, lessonId: string) => {
    onSectionsChange(
      sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map(l =>
                l.id === lessonId ? { ...l, isFree: !l.isFree } : l
              ),
            }
          : s
      )
    );
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDuration = sections.reduce(
    (acc, s) => acc + s.lessons.reduce((a, l) => a + l.readingTime, 0),
    0
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-serif">Course Curriculum</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {sections.length} sections • {totalLessons} lessons • {totalDuration} min total
          </p>
        </div>
        <Button onClick={addSection} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No sections yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start building your course by adding sections
            </p>
            <Button onClick={addSection} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Section
            </Button>
          </div>
        ) : (
          sections.map((section, sectionIndex) => (
            <Collapsible
              key={section.id}
              open={expandedSections.has(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <div className="border rounded-lg overflow-hidden">
                {/* Section Header */}
                <div className="flex items-center gap-2 p-3 bg-muted/50">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center gap-2 flex-1 text-left">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedSections.has(section.id) ? '' : '-rotate-90'
                        }`}
                      />
                      {editingSectionId === section.id ? (
                        <Input
                          value={newSectionTitle}
                          onChange={(e) => setNewSectionTitle(e.target.value)}
                          onBlur={() => updateSectionTitle(section.id, newSectionTitle)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateSectionTitle(section.id, newSectionTitle);
                            }
                            if (e.key === 'Escape') {
                              setEditingSectionId(null);
                            }
                          }}
                          className="h-7 text-sm font-medium"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="font-medium">
                          Section {sectionIndex + 1}: {section.title}
                        </span>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <Badge variant="secondary" className="shrink-0">
                    {section.lessons.length} lessons
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingSectionId(section.id);
                          setNewSectionTitle(section.title);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ type: 'section', id: section.id })}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Section
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Lessons */}
                <CollapsibleContent>
                  <div className="divide-y">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 pl-10 hover:bg-muted/30 transition-colors"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {lessonIndex + 1}. {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.readingTime} min
                            </span>
                            {lesson.hasQuiz && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                Quiz
                              </span>
                            )}
                          </div>
                        </div>
                        {lesson.isFree && (
                          <Badge variant="outline" className="text-xs">
                            Preview
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditLesson(section.id, lesson.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Content
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditQuiz(lesson.id, lesson.quizId)}>
                              <HelpCircle className="h-4 w-4 mr-2" />
                              {lesson.hasQuiz ? 'Edit Quiz' : 'Add Quiz'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleLessonFree(section.id, lesson.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {lesson.isFree ? 'Remove Preview' : 'Mark as Preview'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ type: 'lesson', id: lesson.id, sectionId: section.id })}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Lesson
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}

                    {/* Add Lesson */}
                    <div className="p-3 pl-10">
                      {addingLessonToSection === section.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Lesson title..."
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') addLesson(section.id);
                              if (e.key === 'Escape') setAddingLessonToSection(null);
                            }}
                            className="h-8 text-sm"
                            autoFocus
                          />
                          <Button size="sm" onClick={() => addLesson(section.id)}>
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAddingLessonToSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => setAddingLessonToSection(section.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Lesson
                        </Button>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {deleteDialog?.type === 'section' ? 'Section' : 'Lesson'}?
            </DialogTitle>
            <DialogDescription>
              {deleteDialog?.type === 'section'
                ? 'This will permanently delete the section and all its lessons. This action cannot be undone.'
                : 'This will permanently delete the lesson. This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialog?.type === 'section') {
                  deleteSection(deleteDialog.id);
                } else if (deleteDialog?.sectionId) {
                  deleteLesson(deleteDialog.sectionId, deleteDialog.id);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
