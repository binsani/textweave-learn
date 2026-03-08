import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { Course, User, Review } from '@/types';

export type DbCourse = Tables<'courses'> & {
  instructor?: Tables<'profiles'>;
  sections?: (Tables<'sections'> & { lessons: Tables<'lessons'>[] })[];
};

async function fetchPublishedCourses(): Promise<DbCourse[]> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(*),
      sections(*, lessons(*))
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as DbCourse[];
}

export function usePublishedCourses() {
  return useQuery({
    queryKey: ['courses', 'published'],
    queryFn: fetchPublishedCourses,
  });
}

async function fetchCourseById(courseId: string): Promise<DbCourse | null> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(*),
      sections(*, lessons(*))
    `)
    .eq('id', courseId)
    .single();

  if (error) return null;
  return data as DbCourse;
}

export function useCourseById(courseId: string | undefined) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId!),
    enabled: !!courseId,
  });
}

async function fetchCourseReviews(courseId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles!reviews_user_id_fkey(*)')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export function useCourseReviews(courseId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', courseId],
    queryFn: () => fetchCourseReviews(courseId!),
    enabled: !!courseId,
  });
}

/** Map a DB profile to the app User shape */
export function dbProfileToUser(profile: Tables<'profiles'>): User {
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  return {
    id: profile.id,
    email: profile.email,
    name: [firstName, lastName].filter(Boolean).join(' ') || profile.email,
    firstName,
    lastName,
    role: 'instructor', // profiles don't store role; context-dependent
    avatar: profile.avatar_url || undefined,
    bio: profile.bio || undefined,
    createdAt: profile.created_at,
  };
}

/** Map a DB course row to the app Course shape */
export function dbCourseToCardProps(course: DbCourse): Course {
  const sections = (course.sections ?? [])
    .sort((a, b) => a.order - b.order)
    .map(s => ({
      id: s.id,
      courseId: s.course_id,
      title: s.title,
      description: s.description ?? undefined,
      order: s.order,
      lessons: (s.lessons ?? [])
        .sort((a, b) => a.order - b.order)
        .map(l => ({
          id: l.id,
          sectionId: l.section_id,
          courseId: course.id,
          title: l.title,
          slug: l.slug,
          content: l.content,
          order: l.order,
          readingTime: l.reading_time,
          isFree: l.is_free,
          hasQuiz: l.has_quiz,
          quizId: l.quiz_id ?? undefined,
        })),
    }));

  const instructor = course.instructor ? dbProfileToUser(course.instructor) : undefined;

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.short_description,
    thumbnail: course.thumbnail ?? undefined,
    instructorId: course.instructor_id,
    instructor,
    category: course.category,
    tags: course.tags ?? [],
    level: course.level,
    status: course.status,
    sections,
    totalLessons: sections.reduce((acc, s) => acc + s.lessons.length, 0),
    totalDuration: 0,
    enrolledCount: course.enrolled_count,
    estimatedHours: Number(course.estimated_hours),
    learningObjectives: course.learning_objectives ?? [],
    requirements: course.requirements ?? [],
    rating: Number(course.rating),
    reviewCount: course.review_count,
    price: Number(course.price),
    isFree: course.is_free,
    createdAt: course.created_at,
    updatedAt: course.updated_at,
    publishedAt: course.published_at ?? undefined,
  } as Course;
}

/** Map DB review to app Review */
export function dbReviewToReview(r: any): Review {
  const user = r.user ? dbProfileToUser(r.user) : undefined;
  return {
    id: r.id,
    courseId: r.course_id,
    userId: r.user_id,
    user,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
