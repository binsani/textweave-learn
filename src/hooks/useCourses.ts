import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

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

/** Map a DB course row to the shape CourseCard expects */
export function dbCourseToCardProps(course: DbCourse) {
  const sections = (course.sections ?? []).map(s => ({
    ...s,
    courseId: s.course_id,
    lessons: (s.lessons ?? []).map(l => ({
      ...l,
      sectionId: l.section_id,
      courseId: course.id,
      readingTime: l.reading_time,
      isFree: l.is_free,
      hasQuiz: l.has_quiz,
      quizId: l.quiz_id ?? undefined,
    })),
  }));

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.short_description,
    thumbnail: course.thumbnail ?? undefined,
    instructorId: course.instructor_id,
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
  };
}
