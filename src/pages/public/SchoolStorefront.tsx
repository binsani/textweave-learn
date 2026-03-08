import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseCard } from '@/components/course/CourseCard';
import { BookOpen, Globe, Store, Users } from 'lucide-react';

export default function SchoolStorefront() {
  const { slug } = useParams<{ slug: string }>();

  const { data: instructor, isLoading: instructorLoading } = useQuery({
    queryKey: ['school', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('school_slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['school-courses', instructor?.id],
    queryFn: async () => {
      if (!instructor) return [];
      const { data, error } = await supabase
        .from('courses')
        .select('*, sections(lessons(id))')
        .eq('instructor_id', instructor.id)
        .eq('status', 'published')
        .order('enrolled_count', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!instructor?.id,
  });

  useDocumentTitle(instructor?.school_name ? `${instructor.school_name}` : 'School - MasashiLearn');

  if (instructorLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-8 w-64" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">School Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This school doesn't exist or hasn't been set up yet.
        </p>
        <Button asChild>
          <Link to="/catalog">Browse All Courses</Link>
        </Button>
      </div>
    );
  }

  const primaryColor = instructor.primary_color || '#6366f1';
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolled_count || 0), 0);
  const instructorName = [instructor.first_name, instructor.last_name].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative py-16 md:py-24 px-4"
        style={{
          background: instructor.banner_url
            ? `url(${instructor.banner_url}) center/cover`
            : `linear-gradient(135deg, ${primaryColor}, ${instructor.accent_color || '#8b5cf6'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-6xl mx-auto text-center text-white">
          {instructor.logo_url && (
            <img
              src={instructor.logo_url}
              alt={instructor.school_name || ''}
              className="h-20 w-20 rounded-xl mx-auto mb-4 object-cover border-2 border-white/30"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">{instructor.school_name || instructorName}</h1>
          {instructor.school_description && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6">
              {instructor.school_description}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {courses.length} Courses
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {totalStudents} Students
            </span>
            {instructor.website && (
              <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-serif text-2xl font-bold mb-6">Courses</h2>

        {coursesLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No courses published yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const totalLessons = (course.sections ?? []).reduce(
                (acc: number, s: any) => acc + (s.lessons?.length || 0), 0
              );
              const mappedCourse = {
                id: course.id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                shortDescription: course.short_description,
                thumbnail: course.thumbnail || undefined,
                instructorId: course.instructor_id,
                instructor: { id: course.instructor_id, email: '', name: instructorName, role: 'instructor' as const, createdAt: '' },
                category: course.category as any,
                tags: course.tags || [],
                level: course.level as any,
                status: course.status as any,
                sections: [],
                totalLessons,
                totalDuration: 0,
                enrolledCount: course.enrolled_count,
                estimatedHours: Number(course.estimated_hours),
                learningObjectives: course.learning_objectives || [],
                requirements: course.requirements || [],
                rating: Number(course.rating),
                reviewCount: course.review_count,
                price: Number(course.price),
                isFree: course.is_free,
                createdAt: course.created_at,
                updatedAt: course.updated_at,
              };
              return <CourseCard key={course.id} course={mappedCourse} />;
            })}
          </div>
        )}
      </div>

      {/* Powered by footer */}
      <div className="border-t border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by{' '}
          <Link to="/" className="font-semibold text-primary hover:underline">
            MasashiLearn
          </Link>
        </p>
      </div>
    </div>
  );
}
