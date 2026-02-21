import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CourseProgress, LessonProgress } from '@/types';

interface ProgressState {
  courseProgress: Record<string, CourseProgress>;
  lessonProgress: Record<string, LessonProgress>;
  notes: Record<string, Record<string, string>>; // courseId -> lessonId -> content
  bookmarks: Record<string, string[]>; // courseId -> lessonIds
  
  // Course Progress Actions
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
  addBookmark: (courseId: string, lessonId: string) => void;
  removeBookmark: (courseId: string, lessonId: string) => void;
  isLessonBookmarked: (courseId: string, lessonId: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      courseProgress: {},
      lessonProgress: {},
      notes: {},
      bookmarks: {},

      initCourseProgress: (courseId: string, totalLessons: number) => {
        const { courseProgress } = get();
        if (!courseProgress[courseId]) {
          const newProgress: CourseProgress = {
            courseId,
            userId: '',
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

      markLessonComplete: (courseId: string, lessonId: string) => {
        const { courseProgress } = get();
        const progress = courseProgress[courseId];
        if (progress && !progress.completedLessons.includes(lessonId)) {
          const updatedLessons = [...progress.completedLessons, lessonId];
          set({
            courseProgress: {
              ...courseProgress,
              [courseId]: {
                ...progress,
                completedLessons: updatedLessons,
                progressPercentage: Math.round((updatedLessons.length / progress.totalLessons) * 100),
                lastAccessedAt: new Date().toISOString(),
                lastLessonId: lessonId,
                certificateEarned: updatedLessons.length === progress.totalLessons,
              },
            },
          });
        }
      },

      markLessonIncomplete: (courseId: string, lessonId: string) => {
        const { courseProgress } = get();
        const progress = courseProgress[courseId];
        if (progress) {
          const updatedLessons = progress.completedLessons.filter(id => id !== lessonId);
          set({
            courseProgress: {
              ...courseProgress,
              [courseId]: {
                ...progress,
                completedLessons: updatedLessons,
                progressPercentage: Math.round((updatedLessons.length / progress.totalLessons) * 100),
                certificateEarned: false,
              },
            },
          });
        }
      },

      updateLastAccessed: (courseId: string, lessonId: string) => {
        const { courseProgress } = get();
        const progress = courseProgress[courseId];
        if (progress) {
          set({
            courseProgress: {
              ...courseProgress,
              [courseId]: { ...progress, lastAccessedAt: new Date().toISOString(), lastLessonId: lessonId },
            },
          });
        }
      },

      getCourseProgress: (courseId: string) => get().courseProgress[courseId],

      addNote: (courseId: string, lessonId: string, content: string) => {
        const { notes } = get();
        set({ notes: { ...notes, [courseId]: { ...(notes[courseId] || {}), [lessonId]: content } } });
      },

      updateNote: (courseId: string, lessonId: string, content: string) => {
        const { notes } = get();
        set({ notes: { ...notes, [courseId]: { ...(notes[courseId] || {}), [lessonId]: content } } });
      },

      removeNote: (courseId: string, lessonId: string) => {
        const { notes } = get();
        const courseNotes = { ...(notes[courseId] || {}) };
        delete courseNotes[lessonId];
        set({ notes: { ...notes, [courseId]: courseNotes } });
      },

      addBookmark: (courseId: string, lessonId: string) => {
        const { bookmarks } = get();
        const courseBookmarks = bookmarks[courseId] || [];
        if (!courseBookmarks.includes(lessonId)) {
          set({ bookmarks: { ...bookmarks, [courseId]: [...courseBookmarks, lessonId] } });
        }
      },

      removeBookmark: (courseId: string, lessonId: string) => {
        const { bookmarks } = get();
        set({ bookmarks: { ...bookmarks, [courseId]: (bookmarks[courseId] || []).filter(id => id !== lessonId) } });
      },

      isLessonBookmarked: (courseId: string, lessonId: string) => {
        return (get().bookmarks[courseId] || []).includes(lessonId);
      },
    }),
    { name: 'masashi-progress' }
  )
);
