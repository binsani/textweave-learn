import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCourses, mockUsers, mockReviews } from '@/data/mockData';
import { 
  InstructorSection, 
  CourseReviews, 
  CourseCurriculum, 
  EnrollmentCard 
} from '@/components/course';

export default function CoursePreview() {
  const { courseId } = useParams<{ courseId: string }>();

  const course = mockCourses.find(c => c.id === courseId);
  const instructor = mockUsers.find(u => u.id === course?.instructorId);
  const instructorCourses = mockCourses.filter(c => c.instructorId === course?.instructorId);
  const reviews = mockReviews.filter(r => r.courseId === courseId);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-foreground text-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge variant="secondary" className="mb-4">{course.category}</Badge>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-background/80 mb-6">
                {course.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-background/60">({course.reviewCount} reviews)</span>
                </div>
                <span className="text-background/60">•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.enrollmentCount.toLocaleString()} students
                </span>
                <span className="text-background/60">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.estimatedHours} hours
                </span>
                <span className="text-background/60">•</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {totalLessons} lessons
                </span>
              </div>

              {/* Instructor Mini */}
              {instructor && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background/20">
                    <AvatarImage src={instructor.avatar} alt={instructor.name} />
                    <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-background/60">Created by</p>
                    <p className="font-medium">{instructor.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enrollment Card (Desktop) */}
            <div className="hidden lg:block">
              <EnrollmentCard course={course} variant="desktop" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* What you'll learn */}
            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">What you'll learn</h2>
              <Card>
                <CardContent className="p-6">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold mb-6">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Course Curriculum */}
            <CourseCurriculum sections={course.sections} />

            {/* Instructor */}
            {instructor && (
              <InstructorSection instructor={instructor} courses={instructorCourses} />
            )}

            {/* Reviews */}
            <CourseReviews course={course} reviews={reviews} users={mockUsers} />
          </div>

          {/* Desktop Sidebar Spacer */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Mobile Enrollment Card */}
      <EnrollmentCard course={course} variant="mobile" />
      
      {/* Spacer for mobile fixed CTA */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}
