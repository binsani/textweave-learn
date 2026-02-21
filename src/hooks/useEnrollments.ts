import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { Tables } from '@/integrations/supabase/types';
import type { Course } from '@/types';
import { dbCourseToCardProps, type DbCourse } from './useCourses';

export function useEnrolledCourses() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      if (!enrollments?.length) return [];

      const courseIds = enrollments.map((e) => e.course_id);
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select(`*, instructor:profiles!courses_instructor_id_fkey(*), sections(*, lessons(*))`)
        .in('id', courseIds);

      if (coursesError) throw coursesError;
      return (courses ?? []).map((c) => dbCourseToCardProps(c as DbCourse));
    },
    enabled: !!user,
  });
}

export function useCourseProgress() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['course_progress', user?.id],
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Group by course_id, collect completed lesson_ids
      const progressMap: Record<string, { completedLessons: string[]; lastLessonId?: string }> = {};
      for (const row of data ?? []) {
        if (!progressMap[row.course_id]) {
          progressMap[row.course_id] = { completedLessons: [] };
        }
        if (row.is_completed) {
          progressMap[row.course_id].completedLessons.push(row.lesson_id);
        }
        progressMap[row.course_id].lastLessonId = row.lesson_id;
      }
      return progressMap;
    },
    enabled: !!user,
  });
}
