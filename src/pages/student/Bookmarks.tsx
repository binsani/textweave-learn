import { Link } from 'react-router-dom';
import { BookMarked, ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function StudentBookmarks() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const deleteBookmark = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Bookmarks</h1>
        <p className="text-muted-foreground">Quick access to your saved lessons</p>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-4">Bookmark lessons to access them quickly later</p>
            <Button asChild><Link to="/student/courses">Go to My Courses</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <Card key={bm.id} className="group hover-lift">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {bm.title || 'Bookmarked Lesson'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteBookmark.mutate(bm.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/learn/${bm.course_id}/${bm.lesson_id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />Open
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
