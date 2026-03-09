import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  User,
  BookOpen,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { dbCourseToCardProps, type DbCourse } from '@/hooks/useCourses';
import type { CourseStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending_review: 'bg-yellow-500/10 text-yellow-600',
  under_review: 'bg-blue-500/10 text-blue-600',
  published: 'bg-green-500/10 text-green-600',
  archived: 'bg-muted text-muted-foreground',
};

export function CourseApprovalList() {
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allCourses = [], isLoading } = useQuery({
    queryKey: ['admin-all-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`*, instructor:profiles!courses_instructor_id_fkey(*), sections(*, lessons(*))`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((c) => dbCourseToCardProps(c as DbCourse));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ courseId, status, rejectionReason }: { courseId: string; status: string; rejectionReason?: string }) => {
      const updateData: Record<string, any> = { status };
      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
        updateData.rejection_reason = null;
      }
      if (status === 'draft' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }
      const { error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-courses'] });
    },
  });

  const filteredCourses = allCourses.filter(course => {
    if (statusFilter === 'all') return true;
    return course.status === statusFilter;
  });

  const pendingCount = allCourses.filter(c => c.status === 'pending_review').length;

  const handleApprove = (courseId: string) => {
    updateStatusMutation.mutate(
      { courseId, status: 'published' },
      {
        onSuccess: () => {
          toast({ title: 'Course approved', description: 'The course is now published.' });
        },
        onError: (error) => {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        },
      }
    );
  };

  const handleReject = () => {
    if (!selectedCourse) return;
    updateStatusMutation.mutate(
      { courseId: selectedCourse, status: 'draft' },
      {
        onSuccess: () => {
          toast({ title: 'Course rejected', description: 'The course has been sent back to draft.' });
          setRejectDialogOpen(false);
          setRejectReason('');
          setSelectedCourse(null);
        },
        onError: (error) => {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
            {pendingCount} Pending
          </Badge>
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CourseStatus | 'all')}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => {
          const isPending = course.status === 'pending_review';
          
          return (
            <Card key={course.id} className={isPending ? 'border-accent/30' : ''}>
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Course Thumbnail */}
                  <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <BookOpen className="h-8 w-8 text-primary/50" />
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground truncate">{course.title}</h3>
                      <Badge className={statusColors[course.status] || ''}>
                        {course.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {course.shortDescription}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{course.instructor?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.estimatedHours}h content</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    {isPending && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => {
                            setSelectedCourse(course.id);
                            setRejectDialogOpen(true);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => handleApprove(course.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">All caught up!</h3>
          <p className="text-muted-foreground">No courses match your current filter.</p>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Course</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this course. The instructor will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim() || updateStatusMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
