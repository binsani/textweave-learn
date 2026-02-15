import { useState, useEffect } from 'react';
import { X, Save, Trash2, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NotesPanelProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NotesPanel({ courseId, lessonId, lessonTitle, isOpen, onClose }: NotesPanelProps) {
  const { toast } = useToast();
  const notes = useProgressStore(state => state.notes);
  const addNote = useProgressStore(state => state.addNote);
  const updateNote = useProgressStore(state => state.updateNote);
  const removeNote = useProgressStore(state => state.removeNote);

  const existingNote = notes[courseId]?.[lessonId] || '';
  const [noteContent, setNoteContent] = useState(existingNote);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update local state when lesson changes
  useEffect(() => {
    setNoteContent(notes[courseId]?.[lessonId] || '');
    setHasUnsavedChanges(false);
  }, [courseId, lessonId, notes]);

  const handleChange = (value: string) => {
    setNoteContent(value);
    setHasUnsavedChanges(value !== existingNote);
  };

  const handleSave = () => {
    if (noteContent.trim()) {
      if (existingNote) {
        updateNote(courseId, lessonId, noteContent);
      } else {
        addNote(courseId, lessonId, noteContent);
      }
      setHasUnsavedChanges(false);
      toast({
        title: 'Note saved',
        description: 'Your note has been saved successfully.',
      });
    }
  };

  const handleDelete = () => {
    removeNote(courseId, lessonId);
    setNoteContent('');
    setHasUnsavedChanges(false);
    toast({
      title: 'Note deleted',
      description: 'Your note has been removed.',
    });
  };

  // Auto-save on blur
  const handleBlur = () => {
    if (hasUnsavedChanges && noteContent.trim()) {
      handleSave();
    }
  };

  return (
    <aside
      className={cn(
        'fixed lg:relative inset-y-0 right-0 z-40 w-80 bg-background border-l border-border',
        'transform transition-transform duration-300 ease-in-out',
        'lg:transform-none lg:transition-none',
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        !isOpen && 'lg:hidden'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Notes</h3>
            {hasUnsavedChanges && (
              <span className="text-xs text-amber-500">• Unsaved</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Lesson info */}
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Notes for</p>
          <p className="text-sm font-medium text-foreground line-clamp-2">{lessonTitle}</p>
        </div>

        {/* Note content */}
        <div className="flex-1 p-4 flex flex-col">
          <Textarea
            placeholder="Write your notes here... 

• Key concepts
• Questions to revisit
• Personal insights"
            value={noteContent}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className="flex-1 min-h-[200px] resize-none bg-muted/30 border-border focus:border-primary"
          />

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={!existingNote && !noteContent.trim()}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || !noteContent.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Notes auto-save when you click outside the text area.
          </p>
        </div>
      </div>
    </aside>
  );
}
