import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Star, 
  CheckCircle2, 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  type: 'enrollment' | 'review' | 'completion';
  userName: string;
  userAvatar?: string;
  courseName: string;
  message?: string;
  rating?: number;
  timestamp: Date;
}

const activityConfig = {
  enrollment: {
    icon: UserPlus,
    color: 'bg-blue-500/10 text-blue-600',
    label: 'New Enrollment',
  },
  review: {
    icon: Star,
    color: 'bg-yellow-500/10 text-yellow-600',
    label: 'New Review',
  },
  completion: {
    icon: CheckCircle2,
    color: 'bg-green-500/10 text-green-600',
    label: 'Lesson Completed',
  },
};

export function RecentActivity() {
  const { user } = useAuthStore();

  const { data: activities = [] } = useQuery({
    queryKey: ['instructor-recent-activity', user?.id],
    queryFn: async (): Promise<Activity[]> => {
      if (!user) return [];

      // Get instructor's course IDs
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id);
      if (!courses?.length) return [];

      const courseIds = courses.map(c => c.id);
      const courseMap: Record<string, string> = {};
      for (const c of courses) courseMap[c.id] = c.title;

      // Fetch recent enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id, user_id, course_id, enrolled_at')
        .in('course_id', courseIds)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      // Fetch recent reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id, user_id, course_id, rating, comment, created_at')
        .in('course_id', courseIds)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get all user IDs
      const userIds = [
        ...(enrollments ?? []).map(e => e.user_id),
        ...(reviews ?? []).map(r => r.user_id),
      ];
      const uniqueUserIds = [...new Set(userIds)];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', uniqueUserIds.length > 0 ? uniqueUserIds : ['none']);

      const profileMap: Record<string, { name: string; avatar?: string }> = {};
      for (const p of profiles ?? []) {
        profileMap[p.id] = {
          name: [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown',
          avatar: p.avatar_url || undefined,
        };
      }

      const items: Activity[] = [];

      for (const e of enrollments ?? []) {
        const profile = profileMap[e.user_id];
        items.push({
          id: `enroll-${e.id}`,
          type: 'enrollment',
          userName: profile?.name || 'Unknown',
          userAvatar: profile?.avatar,
          courseName: courseMap[e.course_id] || 'Unknown',
          timestamp: new Date(e.enrolled_at),
        });
      }

      for (const r of reviews ?? []) {
        const profile = profileMap[r.user_id];
        items.push({
          id: `review-${r.id}`,
          type: 'review',
          userName: profile?.name || 'Unknown',
          userAvatar: profile?.avatar,
          courseName: courseMap[r.course_id] || 'Unknown',
          message: r.comment,
          rating: r.rating,
          timestamp: new Date(r.created_at),
        });
      }

      return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);
    },
    enabled: !!user,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest student interactions and events
        </p>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div key={activity.id} className="flex gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback className="bg-muted text-xs">
                      {activity.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.userName}</span>
                          {activity.type === 'enrollment' && ' enrolled in '}
                          {activity.type === 'review' && ' reviewed '}
                          {activity.type === 'completion' && ' completed a lesson in '}
                          <span className="text-muted-foreground">{activity.courseName}</span>
                        </p>
                        {activity.message && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                            "{activity.message}"
                          </p>
                        )}
                        {activity.rating && (
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < activity.rating!
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className={`shrink-0 ${config.color}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        <span className="text-xs">{config.label}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
