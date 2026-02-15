import { useEffect, useRef } from 'react';
import { Bell, UserPlus, Star, CheckCircle2, Award, ShoppingCart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useNotificationStore,
  startNotificationSimulation,
  stopNotificationSimulation,
  type NotificationType,
} from '@/stores/notificationStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const iconMap: Record<NotificationType, typeof Bell> = {
  enrollment: UserPlus,
  review: Star,
  completion: CheckCircle2,
  certificate: Award,
  purchase: ShoppingCart,
};

const colorMap: Record<NotificationType, string> = {
  enrollment: 'bg-blue-500/10 text-blue-600',
  review: 'bg-yellow-500/10 text-yellow-600',
  completion: 'bg-green-500/10 text-green-600',
  certificate: 'bg-purple-500/10 text-purple-600',
  purchase: 'bg-primary/10 text-primary',
};

const toastTitles: Record<NotificationType, string> = {
  enrollment: '🎓 New Enrollment',
  review: '⭐ New Review',
  completion: '✅ Course Completed',
  certificate: '🏆 Certificate Earned',
  purchase: '💰 New Purchase',
};

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { toast } = useToast();
  const prevCountRef = useRef(notifications.length);

  useEffect(() => {
    startNotificationSimulation();
    return () => stopNotificationSimulation();
  }, []);

  // Show toast when a new notification arrives
  useEffect(() => {
    if (notifications.length > prevCountRef.current && notifications.length > 0) {
      const latest = notifications[0];
      toast({
        title: toastTitles[latest.type],
        description: `${latest.message} — ${latest.courseName}`,
      });
    }
    prevCountRef.current = notifications.length;
  }, [notifications, toast]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-scale-in">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-serif font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => {
                const Icon = iconMap[n.type];
                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      'flex gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <div className={cn('p-2 rounded-lg shrink-0 mt-0.5', colorMap[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{n.message}</p>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.courseName}</p>
                      {n.rating && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-3 w-3',
                                i < n.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                              )}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
