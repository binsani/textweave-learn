// ============================================
// Masashi LMS - Core Type Definitions
// ============================================

// User & Authentication Types
export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
  enrolledCourses?: string[];
  createdCourses?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Course Types
export type CourseStatus = 'draft' | 'pending_review' | 'published' | 'archived' | 'under_review';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory = 
  | 'programming'
  | 'data-science'
  | 'business'
  | 'design'
  | 'marketing'
  | 'personal-development'
  | 'mathematics'
  | 'science'
  | 'humanities'
  | 'language';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  instructorId: string;
  instructor?: User;
  category: CourseCategory;
  tags: string[];
  level: CourseLevel;
  status: CourseStatus;
  sections: Section[];
  totalLessons: number;
  totalDuration: number; // in minutes (reading time)
  enrolledCount: number;
  enrollmentCount?: number; // alias for compatibility
  estimatedHours: number;
  learningObjectives: string[];
  requirements: string[];
  rating: number;
  reviewCount: number;
  price: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  courseId: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  order: number;
  readingTime: number; // in minutes
  isFree: boolean; // Preview lesson
  hasQuiz: boolean;
  quizId?: string;
}

// Quiz Types
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes, optional
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[]; // Can be index(es) or text
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string | string[]>;
  score: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
}

// Progress Tracking Types
export interface LessonProgress {
  lessonId: string;
  courseId: string;
  userId: string;
  isCompleted: boolean;
  completedAt?: string;
  lastAccessedAt: string;
  scrollPosition?: number; // For resume
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt: string;
  lastLessonId?: string;
  certificateEarned: boolean;
  certificateId?: string;
}

// Student Tools Types
export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  title: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  color: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  courseId: string;
  userId: string;
  user?: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'expired';
  expiresAt?: string;
}

// Navigation & UI Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter & Sort Types
export interface CourseFilters {
  category?: CourseCategory;
  level?: CourseLevel;
  priceRange?: 'free' | 'paid' | 'all';
  rating?: number;
  search?: string;
}

export type SortOption = 'newest' | 'popular' | 'rating' | 'title-asc' | 'title-desc';

// Statistics Types (for dashboards)
export interface StudentStats {
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLearningTime: number;
  certificatesEarned: number;
  averageQuizScore: number;
}

export interface InstructorStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  averageRating: number;
  totalReviews: number;
  totalRevenue: number;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  pendingReviews: number;
  recentEnrollments: number;
}
