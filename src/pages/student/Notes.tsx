import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function StudentNotes() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">My Notes</h1>
        <p className="text-muted-foreground">All your personal notes from lessons</p>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">Take notes while learning to review them here</p>
            <Button asChild><Link to="/student/courses">Go to My Courses</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteNote.mutate(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/learn/${note.course_id}/${note.lesson_id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />Open Lesson
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap">
                  {note.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
