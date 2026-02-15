import { User, Course } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Star } from 'lucide-react';

interface InstructorSectionProps {
  instructor: User;
  courses: Course[];
}

export function InstructorSection({ instructor, courses }: InstructorSectionProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate instructor stats
  const totalStudents = courses.reduce((acc, c) => acc + c.enrollmentCount, 0);
  const totalCourses = courses.length;
  const averageRating = courses.length > 0
    ? courses.reduce((acc, c) => acc + c.rating, 0) / courses.length
    : 0;
  const totalReviews = courses.reduce((acc, c) => acc + c.reviewCount, 0);

  return (
    <section>
      <h2 className="font-serif text-2xl font-bold mb-6">Your Instructor</h2>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="h-24 w-24 shrink-0">
              <AvatarImage src={instructor.avatar} alt={instructor.name} />
              <AvatarFallback className="text-2xl">{getInitials(instructor.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-serif text-xl font-semibold mb-2">{instructor.name}</h3>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>{averageRating.toFixed(1)} Instructor Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalCourses} Courses</span>
                </div>
                {totalReviews > 0 && (
                  <span className="text-muted-foreground">
                    ({totalReviews.toLocaleString()} reviews)
                  </span>
                )}
              </div>
              
              {/* Bio */}
              {instructor.bio && (
                <p className="text-muted-foreground leading-relaxed">
                  {instructor.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
