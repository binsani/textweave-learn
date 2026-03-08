import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/PageLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";

// Layouts (keep eager — needed for shell)
import { PublicLayout, StudentLayout, InstructorLayout, AdminLayout } from "@/components/layout";
import { SearchCommandPalette } from "@/components/search";

// Lazy-loaded pages
const Landing = lazy(() => import("@/pages/public/Landing"));
const Catalog = lazy(() => import("@/pages/public/Catalog"));
const CoursePreview = lazy(() => import("@/pages/public/CoursePreview"));
const Login = lazy(() => import("@/pages/public/Login"));
const Signup = lazy(() => import("@/pages/public/Signup"));
const ForgotPassword = lazy(() => import("@/pages/public/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/public/ResetPassword"));
const About = lazy(() => import("@/pages/public/About"));
const Contact = lazy(() => import("@/pages/public/Contact"));
const Pricing = lazy(() => import("@/pages/public/Pricing"));
const Instructors = lazy(() => import("@/pages/public/Instructors"));
const CertificateVerify = lazy(() => import("@/pages/public/CertificateVerify"));
const VendorStorefront = lazy(() => import("@/pages/public/VendorStorefront"));
const Help = lazy(() => import("@/pages/public/Help"));
const Blog = lazy(() => import("@/pages/public/Blog"));
const Community = lazy(() => import("@/pages/public/Community"));
const Privacy = lazy(() => import("@/pages/public/Privacy"));
const Terms = lazy(() => import("@/pages/public/Terms"));
const Cookies = lazy(() => import("@/pages/public/Cookies"));
const AdminLogin = lazy(() => import("@/pages/public/AdminLogin"));
const StudentLogin = lazy(() => import("@/pages/public/StudentLogin"));
const InstructorLogin = lazy(() => import("@/pages/public/InstructorLogin"));

const StudentDashboard = lazy(() => import("@/pages/student/Dashboard"));
const StudentCourses = lazy(() => import("@/pages/student/Courses"));
const StudentBookmarks = lazy(() => import("@/pages/student/Bookmarks"));
const StudentNotes = lazy(() => import("@/pages/student/Notes"));
const StudentSettings = lazy(() => import("@/pages/student/Settings"));
const StudentCertificates = lazy(() => import("@/pages/student/Certificates"));
const LearningInterface = lazy(() => import("@/pages/student/LearningInterface"));
const QuizInterface = lazy(() => import("@/pages/student/QuizInterface"));

const InstructorDashboard = lazy(() => import("@/pages/instructor/Dashboard"));
const CourseEditor = lazy(() => import("@/pages/instructor/CourseEditor"));
const InstructorCourses = lazy(() => import("@/pages/instructor/Courses"));
const InstructorAnalytics = lazy(() => import("@/pages/instructor/Analytics"));
const InstructorStudents = lazy(() => import("@/pages/instructor/Students"));
const InstructorSettings = lazy(() => import("@/pages/instructor/Settings"));
const VendorApplication = lazy(() => import("@/pages/instructor/VendorApplication"));

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminCourses = lazy(() => import("@/pages/admin/Courses"));
const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminVendors = lazy(() => import("@/pages/admin/Vendors"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <AuthInitializer>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SearchCommandPalette />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/courses" element={<Catalog />} />
                <Route path="/courses/:courseId" element={<CoursePreview />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/help" element={<Help />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/community" element={<Community />} />
                <Route path="/instructors" element={<Instructors />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/verify" element={<CertificateVerify />} />
                <Route path="/portal/secure-access-9x4k" element={<AdminLogin />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/instructor/login" element={<InstructorLogin />} />
              </Route>

              {/* Learning Interface - Protected, Standalone */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/learn/:courseId" element={<LearningInterface />} />
                <Route path="/learn/:courseId/:lessonId" element={<LearningInterface />} />
                <Route path="/learn/:courseId/:lessonId/quiz/:quizId" element={<QuizInterface />} />
              </Route>

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student" element={<StudentLayout />}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="bookmarks" element={<StudentBookmarks />} />
                  <Route path="notes" element={<StudentNotes />} />
                  <Route path="certificates" element={<StudentCertificates />} />
                  <Route path="settings" element={<StudentSettings />} />
                </Route>
              </Route>

              {/* Instructor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
                <Route path="/instructor" element={<InstructorLayout />}>
                  <Route path="dashboard" element={<InstructorDashboard />} />
                  <Route path="courses" element={<InstructorCourses />} />
                  <Route path="courses/new" element={<CourseEditor />} />
                  <Route path="courses/:courseId/edit" element={<CourseEditor />} />
                  <Route path="analytics" element={<InstructorAnalytics />} />
                  <Route path="students" element={<InstructorStudents />} />
                  <Route path="settings" element={<InstructorSettings />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* Catch-all with layout */}
              <Route element={<PublicLayout />}>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthInitializer>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
