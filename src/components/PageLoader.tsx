import { Skeleton } from '@/components/ui/skeleton';

export function PageLoader() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
