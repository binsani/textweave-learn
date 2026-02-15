import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseCardSkeletonProps {
  variant?: 'default' | 'compact';
}

export function CourseCardSkeleton({ variant = 'default' }: CourseCardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden">
        <div className="flex">
          <Skeleton className="w-32 h-24 shrink-0 rounded-none" />
          <CardContent className="p-4 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-16" />
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/50">
      {/* Thumbnail skeleton */}
      <Skeleton className="aspect-video w-full rounded-none" />

      {/* Content skeleton */}
      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Rating & Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
