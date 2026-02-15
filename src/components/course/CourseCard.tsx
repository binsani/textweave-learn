import { Link } from 'react-router-dom';
import { Clock, BookOpen, Star, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact';
}

export function CourseCard({ course, variant = 'default' }: CourseCardProps) {
  const getLessonCount = () => {
    return course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  };

  const formatEnrollment = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (variant === 'compact') {
    return (
      <Link to={`/courses/${course.id}`}>
        <Card className="group hover:shadow-md transition-all duration-300 overflow-hidden hover:border-primary/30">
          <div className="flex">
            <div className="w-32 h-24 bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardContent className="p-4 flex-1 min-w-0">
              <h3 className="font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {course.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {getLessonCount()}
                </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {course.rating.toFixed(1)}
              </span>
              </div>
              <span className="text-sm font-semibold text-primary mt-2 block">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </span>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group h-full card-hover overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 relative overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs capitalize">
              {course.category.replace('-', ' ')}
            </Badge>
            <Badge 
              variant={
                course.level === 'beginner' 
                  ? 'default' 
                  : course.level === 'intermediate' 
                  ? 'secondary' 
                  : 'destructive'
              }
              className="text-xs capitalize backdrop-blur-sm"
            >
              {course.level}
            </Badge>
          </div>

          {/* Free badge */}
          {course.price === 0 && (
            <Badge variant="default" className="absolute bottom-3 left-3 backdrop-blur-sm">
              Free
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-5 space-y-4">
          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {course.shortDescription || course.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {getLessonCount()} lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {course.estimatedHours}h
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {formatEnrollment(course.enrolledCount)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Rating & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(course.rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : i < course.rating
                        ? 'text-yellow-500 fill-yellow-500/50'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{course.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({course.reviewCount.toLocaleString()})
              </span>
            </div>
            <span className="text-lg font-bold text-primary">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
