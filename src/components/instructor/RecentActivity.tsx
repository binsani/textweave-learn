import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Award,
  ShoppingCart 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'enrollment' | 'review' | 'completion' | 'certificate' | 'purchase' | 'question';
  userName: string;
  userAvatar?: string;
  courseName: string;
  message?: string;
  rating?: number;
  timestamp: Date;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'enrollment',
    userName: 'Sarah Chen',
    courseName: 'Python Programming Fundamentals',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    type: 'review',
    userName: 'Michael Brown',
    courseName: 'Data Science with Python',
    message: 'Excellent course! Very comprehensive.',
    rating: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '3',
    type: 'completion',
    userName: 'Emma Wilson',
    courseName: 'Python Programming Fundamentals',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '4',
    type: 'certificate',
    userName: 'James Lee',
    courseName: 'Machine Learning Basics',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '5',
    type: 'purchase',
    userName: 'Lisa Anderson',
    courseName: 'Advanced Python Techniques',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: '6',
    type: 'question',
    userName: 'David Kim',
    courseName: 'Python Programming Fundamentals',
    message: 'How do I handle async operations?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
];

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
    label: 'Course Completed',
  },
  certificate: {
    icon: Award,
    color: 'bg-purple-500/10 text-purple-600',
    label: 'Certificate Earned',
  },
  purchase: {
    icon: ShoppingCart,
    color: 'bg-primary/10 text-primary',
    label: 'New Purchase',
  },
  question: {
    icon: MessageSquare,
    color: 'bg-orange-500/10 text-orange-600',
    label: 'New Question',
  },
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest student interactions and events
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
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
                        {activity.type === 'completion' && ' completed '}
                        {activity.type === 'certificate' && ' earned a certificate for '}
                        {activity.type === 'purchase' && ' purchased '}
                        {activity.type === 'question' && ' asked a question in '}
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
      </CardContent>
    </Card>
  );
}
