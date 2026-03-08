import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseCard } from '@/components/course/CourseCard';
import { BookOpen, Globe, Mail, Store, Users } from 'lucide-react';

export default function VendorStorefront() {
  const { slug } = useParams<{ slug: string }>();

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendor', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('vendors')
        .select('*, owner:profiles!vendors_owner_id_fkey(first_name, last_name, avatar_url, bio)')
        .eq('slug', slug)
        .eq('status', 'approved')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['vendor-courses', vendor?.id],
    queryFn: async () => {
      if (!vendor) return [];
      const { data, error } = await supabase
        .from('courses')
        .select('*, instructor:profiles!courses_instructor_id_fkey(first_name, last_name, avatar_url), sections(lessons(id))')
        .eq('vendor_id', vendor.id)
        .eq('status', 'published')
        .order('enrolled_count', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!vendor?.id,
  });

  useDocumentTitle(vendor ? `${vendor.name}` : 'School - MasashiLearn');

  if (vendorLoading) {
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

  if (!vendor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">School Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This school doesn't exist or hasn't been approved yet.
        </p>
        <Button asChild>
          <Link to="/catalog">Browse All Courses</Link>
        </Button>
      </div>
    );
  }

  const owner = vendor.owner as any;
  const primaryColor = vendor.primary_color || '#6366f1';
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolled_count || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative py-16 md:py-24 px-4"
        style={{
          background: vendor.banner_url
            ? `url(${vendor.banner_url}) center/cover`
            : `linear-gradient(135deg, ${primaryColor}, ${vendor.accent_color || '#8b5cf6'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-6xl mx-auto text-center text-white">
          {vendor.logo_url && (
            <img
              src={vendor.logo_url}
              alt={vendor.name}
              className="h-20 w-20 rounded-xl mx-auto mb-4 object-cover border-2 border-white/30"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">{vendor.name}</h1>
          {vendor.description && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6">
              {vendor.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {courses.length} Courses
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {totalStudents} Students
            </span>
            {vendor.website && (
              <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
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
              const instructor = course.instructor as any;
              const totalLessons = (course.sections ?? []).reduce(
                (acc: number, s: any) => acc + (s.lessons?.length || 0), 0
              );
              return (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.short_description}
                  thumbnail={course.thumbnail || undefined}
                  instructor={instructor ? [instructor.first_name, instructor.last_name].filter(Boolean).join(' ') : 'Instructor'}
                  category={course.category}
                  level={course.level}
                  rating={Number(course.rating)}
                  reviewCount={course.review_count}
                  enrolledCount={course.enrolled_count}
                  totalLessons={totalLessons}
                  estimatedHours={Number(course.estimated_hours)}
                  price={Number(course.price)}
                  isFree={course.is_free}
                />
              );
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
