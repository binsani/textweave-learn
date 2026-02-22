import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clock, Award, CheckCircle, ShieldCheck, Infinity, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface EnrollmentCardProps {
  course: Course;
  variant?: 'desktop' | 'mobile';
}

export function EnrollmentCard({ course, variant = 'desktop' }: EnrollmentCardProps) {
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      toast.info('Please log in to enroll in this course.');
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .maybeSingle();

      if (existing) {
        toast.info('You are already enrolled in this course!');
        navigate('/student/courses');
        return;
      }

      const { error } = await supabase
        .from('enrollments')
        .insert({ user_id: user.id, course_id: course.id });

      if (error) {
        console.error('Enrollment error:', error);
        toast.error(`Enrollment failed: ${error.message}`);
        return;
      }

      toast.success('Successfully enrolled! Start learning now.');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      navigate('/student/courses');
    } catch (error) {
      console.error('Unexpected enrollment error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const enrollLabel = course.price === 0 ? 'Enroll for Free' : 'Buy Now';

  if (variant === 'mobile') {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden z-50">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <span className="font-serif text-2xl font-bold">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
            {course.price > 0 && (
              <span className="text-sm text-muted-foreground line-through ml-2">$199</span>
            )}
          </div>
          <Button size="lg" className="flex-1 max-w-[200px]" onClick={handleEnroll} disabled={isEnrolling}>
            {isEnrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : enrollLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="sticky top-24 overflow-hidden shadow-elegant">
      {/* Course Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-serif text-3xl font-bold">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
          {course.price > 0 && (
            <>
              <span className="text-muted-foreground line-through">$199</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                {Math.round((1 - course.price / 199) * 100)}% off
              </span>
            </>
          )}
        </div>
        
        {course.price > 0 && (
          <p className="text-xs text-destructive font-medium mb-4">
            🔥 Sale ends in 2 days
          </p>
        )}

        {/* CTA Buttons */}
        <Button className="w-full mb-3" size="lg" onClick={handleEnroll} disabled={isEnrolling}>
          {isEnrolling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isEnrolling ? 'Enrolling...' : enrollLabel}
        </Button>
        
        {course.price > 0 && (
          <Button variant="outline" className="w-full mb-3" size="lg">
            Add to Wishlist
          </Button>
        )}

        <p className="text-center text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          30-Day Money-Back Guarantee
        </p>

        <Separator className="mb-6" />

        {/* Course Includes */}
        <h4 className="font-semibold mb-4">This course includes:</h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <span>{totalLessons} comprehensive lessons</span>
          </li>
          <li className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>{course.estimatedHours} hours of content</span>
          </li>
          <li className="flex items-center gap-3">
            <Award className="h-4 w-4 text-primary shrink-0" />
            <span>Certificate of completion</span>
          </li>
          <li className="flex items-center gap-3">
            <Infinity className="h-4 w-4 text-primary shrink-0" />
            <span>Lifetime access</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
            <span>Learn at your own pace</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
