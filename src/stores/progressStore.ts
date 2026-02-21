import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from './authStore';
import type { CourseProgress } from '@/types';

interface ProgressState {
  courseProgress: Record<string, CourseProgress>;
  bookmarks: Record<string, string[]>; // courseId -> lessonIds
  notes: Record<string, Record<string, string>>; // courseId -> lessonId -> content
  loaded: boolean;

  // Course Progress Actions
  loadProgress: () => Promise<void>;
  initCourseProgress: (courseId: string, totalLessons: number) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  markLessonIncomplete: (courseId: string, lessonId: string) => void;
  updateLastAccessed: (courseId: string, lessonId: string) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;

  // Notes Actions
  addNote: (courseId: string, lessonId: string, content: string) => void;
  updateNote: (courseId: string, lessonId: string, content: string) => void;
  removeNote: (courseId: string, lessonId: string) => void;

  // Bookmark Actions
  addBookmark: (courseId: string, lessonId: string, title?: string) => void;
  removeBookmark: (courseId: string, lessonId: string) => void;
  isLessonBookmarked: (courseId: string, lessonId: string) => boolean;
}

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  courseProgress: {},
  bookmarks: {},
  notes: {},
  loaded: false,

  loadProgress: async () => {
    const userId = getUserId();
    if (!userId) return;

    const [progressRes, bookmarksRes, notesRes] = await Promise.all([
      supabase.from('course_progress').select('*').eq('user_id', userId),
      supabase.from('bookmarks').select('*').eq('user_id', userId),
      supabase.from('notes').select('*').eq('user_id', userId),
    ]);

    // Build courseProgress map
    const courseProgress: Record<string, CourseProgress> = {};
    for (const row of progressRes.data ?? []) {
      if (!courseProgress[row.course_id]) {
        courseProgress[row.course_id] = {
          courseId: row.course_id,
          userId: row.user_id,
          enrolledAt: row.last_accessed_at,
          completedLessons: [],
          totalLessons: 0,
          progressPercentage: 0,
          lastAccessedAt: row.last_accessed_at,
          lastLessonId: row.lesson_id,
          certificateEarned: false,
        };
      }
      if (row.is_completed) {
        courseProgress[row.course_id].completedLessons.push(row.lesson_id);
      }
      if (row.last_accessed_at > (courseProgress[row.course_id].lastAccessedAt || '')) {
        courseProgress[row.course_id].lastAccessedAt = row.last_accessed_at;
        courseProgress[row.course_id].lastLessonId = row.lesson_id;
      }
    }

    // Build bookmarks map
    const bookmarks: Record<string, string[]> = {};
    for (const bm of bookmarksRes.data ?? []) {
      if (!bookmarks[bm.course_id]) bookmarks[bm.course_id] = [];
      bookmarks[bm.course_id].push(bm.lesson_id);
    }

    // Build notes map
    const notes: Record<string, Record<string, string>> = {};
    for (const n of notesRes.data ?? []) {
      if (!notes[n.course_id]) notes[n.course_id] = {};
      notes[n.course_id][n.lesson_id] = n.content;
    }

    set({ courseProgress, bookmarks, notes, loaded: true });
  },

  initCourseProgress: (courseId, totalLessons) => {
    const { courseProgress } = get();
    if (courseProgress[courseId]) {
      // Just update totalLessons + recalculate percentage
      const cp = courseProgress[courseId];
      cp.totalLessons = totalLessons;
      cp.progressPercentage = totalLessons > 0 ? Math.round((cp.completedLessons.length / totalLessons) * 100) : 0;
      cp.certificateEarned = cp.completedLessons.length === totalLessons && totalLessons > 0;
      set({ courseProgress: { ...courseProgress, [courseId]: { ...cp } } });
    } else {
      const userId = getUserId();
      const newProgress: CourseProgress = {
        courseId,
        userId: userId || '',
        enrolledAt: new Date().toISOString(),
        completedLessons: [],
        totalLessons,
        progressPercentage: 0,
        lastAccessedAt: new Date().toISOString(),
        certificateEarned: false,
      };
      set({ courseProgress: { ...courseProgress, [courseId]: newProgress } });
    }
  },

  markLessonComplete: (courseId, lessonId) => {
    const userId = getUserId();
    const { courseProgress } = get();
    const progress = courseProgress[courseId];
    if (progress && !progress.completedLessons.includes(lessonId)) {
      const updatedLessons = [...progress.completedLessons, lessonId];
      const pct = progress.totalLessons > 0 ? Math.round((updatedLessons.length / progress.totalLessons) * 100) : 0;
      set({
        courseProgress: {
          ...courseProgress,
          [courseId]: {
            ...progress,
            completedLessons: updatedLessons,
            progressPercentage: pct,
            lastAccessedAt: new Date().toISOString(),
            lastLessonId: lessonId,
            certificateEarned: updatedLessons.length === progress.totalLessons,
          },
        },
      });
      // Persist to DB
      if (userId) {
        supabase.from('course_progress').upsert(
          { user_id: userId, course_id: courseId, lesson_id: lessonId, is_completed: true, completed_at: new Date().toISOString(), last_accessed_at: new Date().toISOString() },
          { onConflict: 'user_id,course_id,lesson_id' }
        ).then();
      }
    }
  },

  markLessonIncomplete: (courseId, lessonId) => {
    const userId = getUserId();
    const { courseProgress } = get();
    const progress = courseProgress[courseId];
    if (progress) {
      const updatedLessons = progress.completedLessons.filter(id => id !== lessonId);
      const pct = progress.totalLessons > 0 ? Math.round((updatedLessons.length / progress.totalLessons) * 100) : 0;
      set({
        courseProgress: {
          ...courseProgress,
          [courseId]: { ...progress, completedLessons: updatedLessons, progressPercentage: pct, certificateEarned: false },
        },
      });
      if (userId) {
        supabase.from('course_progress').update({ is_completed: false, completed_at: null }).eq('user_id', userId).eq('course_id', courseId).eq('lesson_id', lessonId).then();
      }
    }
  },

  updateLastAccessed: (courseId, lessonId) => {
    const userId = getUserId();
    const { courseProgress } = get();
    const progress = courseProgress[courseId];
    if (progress) {
      set({
        courseProgress: {
          ...courseProgress,
          [courseId]: { ...progress, lastAccessedAt: new Date().toISOString(), lastLessonId: lessonId },
        },
      });
      if (userId) {
        supabase.from('course_progress').upsert(
          { user_id: userId, course_id: courseId, lesson_id: lessonId, last_accessed_at: new Date().toISOString() },
          { onConflict: 'user_id,course_id,lesson_id' }
        ).then();
      }
    }
  },

  getCourseProgress: (courseId) => get().courseProgress[courseId],

  addNote: (courseId, lessonId, content) => {
    const userId = getUserId();
    const { notes } = get();
    set({ notes: { ...notes, [courseId]: { ...(notes[courseId] || {}), [lessonId]: content } } });
    if (userId) {
      supabase.from('notes').upsert(
        { user_id: userId, course_id: courseId, lesson_id: lessonId, content, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,course_id,lesson_id' }
      ).then();
    }
  },

  updateNote: (courseId, lessonId, content) => {
    get().addNote(courseId, lessonId, content); // Same logic
  },

  removeNote: (courseId, lessonId) => {
    const userId = getUserId();
    const { notes } = get();
    const courseNotes = { ...(notes[courseId] || {}) };
    delete courseNotes[lessonId];
    set({ notes: { ...notes, [courseId]: courseNotes } });
    if (userId) {
      supabase.from('notes').delete().eq('user_id', userId).eq('course_id', courseId).eq('lesson_id', lessonId).then();
    }
  },

  addBookmark: (courseId, lessonId, title = '') => {
    const userId = getUserId();
    const { bookmarks } = get();
    const courseBookmarks = bookmarks[courseId] || [];
    if (!courseBookmarks.includes(lessonId)) {
      set({ bookmarks: { ...bookmarks, [courseId]: [...courseBookmarks, lessonId] } });
      if (userId) {
        supabase.from('bookmarks').insert({ user_id: userId, course_id: courseId, lesson_id: lessonId, title }).then();
      }
    }
  },

  removeBookmark: (courseId, lessonId) => {
    const userId = getUserId();
    const { bookmarks } = get();
    set({ bookmarks: { ...bookmarks, [courseId]: (bookmarks[courseId] || []).filter(id => id !== lessonId) } });
    if (userId) {
      supabase.from('bookmarks').delete().eq('user_id', userId).eq('course_id', courseId).eq('lesson_id', lessonId).then();
    }
  },

  isLessonBookmarked: (courseId, lessonId) => {
    return (get().bookmarks[courseId] || []).includes(lessonId);
  },
}));
