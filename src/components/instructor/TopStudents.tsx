import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Award className="h-4 w-4 text-amber-600" />;
    default:
      return (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold text-muted-foreground">
          {rank}
        </span>
      );
  }
};

export function TopStudents() {
  const { user } = useAuthStore();

  const { data: topStudents = [] } = useQuery({
    queryKey: ['top-students', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get instructor's courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('instructor_id', user.id);
      if (!courses?.length) return [];

      const courseIds = courses.map(c => c.id);

      // Get all progress for these courses
      const { data: progress } = await supabase
        .from('course_progress')
        .select('user_id, is_completed')
        .in('course_id', courseIds);

      if (!progress?.length) return [];

      // Count completed lessons per student
      const studentStats: Record<string, { completed: number; total: number }> = {};
      for (const p of progress) {
        if (!studentStats[p.user_id]) studentStats[p.user_id] = { completed: 0, total: 0 };
        studentStats[p.user_id].total++;
        if (p.is_completed) studentStats[p.user_id].completed++;
      }

      // Sort by completion count, take top 5
      const sorted = Object.entries(studentStats)
        .sort(([, a], [, b]) => b.completed - a.completed)
        .slice(0, 5);

      const userIds = sorted.map(([uid]) => uid);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      const profileMap: Record<string, typeof profiles extends (infer T)[] ? T : never> = {};
      for (const p of profiles ?? []) profileMap[p.id] = p;

      return sorted.map(([uid, stats], i) => {
        const p = profileMap[uid];
        const name = p ? [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown' : 'Unknown';
        const progressPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        return {
          id: uid,
          name,
          avatar: p?.avatar_url || undefined,
          completedLessons: stats.completed,
          totalProgress: progressPct,
          rank: i + 1,
        };
      });
    },
    enabled: !!user,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Top Students</CardTitle>
        <p className="text-sm text-muted-foreground">
          Highest performing learners across your courses
        </p>
      </CardHeader>
      <CardContent>
        {topStudents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No student data yet</p>
        ) : (
          <div className="space-y-4">
            {topStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6">
                  {getRankIcon(student.rank)}
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {student.completedLessons} lessons
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={student.totalProgress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground shrink-0">
                      {student.totalProgress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
