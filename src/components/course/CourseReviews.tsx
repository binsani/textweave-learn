import { Review, User, Course } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseReviewsProps {
  course: Course;
  reviews: Review[];
  users: User[];
}

export function CourseReviews({ course, reviews, users }: CourseReviewsProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  return (
    <section>
      <h2 className="font-serif text-2xl font-bold mb-6">Student Reviews</h2>
      
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-8">
          {/* Rating Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-[auto_1fr] gap-8">
                {/* Overall Rating */}
                <div className="text-center sm:text-left sm:pr-8 sm:border-r border-border">
                  <div className="font-serif text-5xl font-bold text-foreground mb-2">
                    {course.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < Math.round(course.rating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Course Rating • {course.reviewCount} reviews
                  </p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                  {ratingCounts.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{rating}</span>
                      </div>
                      <Progress value={percentage} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {reviews.slice(0, 5).map((review) => {
              const reviewer = users.find(u => u.id === review.userId);
              const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <Card key={review.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={reviewer?.avatar} />
                        <AvatarFallback>
                          {reviewer?.name ? getInitials(reviewer.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div>
                            <p className="font-medium">{reviewer?.name || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground">{reviewDate}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-4 w-4',
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-muted-foreground/30'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {reviews.length > 5 && (
            <p className="text-center text-sm text-muted-foreground">
              Showing 5 of {reviews.length} reviews
            </p>
          )}
        </div>
      )}
    </section>
  );
}
