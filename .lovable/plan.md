

# Deploy-Readiness: Pending Tasks

Here is a complete list of everything that still needs to be done before the app is production-ready, organized by priority.

---

## Critical (Must Fix)

### 1. Real Authentication (Replace Mock Auth)
The `authStore.ts` still authenticates against `mockUsers` -- no real passwords are checked and no sessions are created. The `Signup.tsx` page fakes account creation. Both Login and Signup must be rewritten to use the real authentication system (Supabase Auth) so users can actually register and sign in.

- Rewrite `authStore.ts` to use `supabase.auth.signInWithPassword` / `signUp` / `signOut` / `onAuthStateChange`
- Update `Login.tsx` to call real sign-in
- Update `Signup.tsx` to call real sign-up (with first_name/last_name metadata so the `handle_new_user` trigger populates profiles)
- Update `ForgotPassword.tsx` and `ResetPassword.tsx` to use `supabase.auth.resetPasswordForEmail` / `updateUser`
- Update role-specific login pages (`StudentLogin`, `InstructorLogin`, `AdminLogin`) similarly
- Remove the `switchRole` dev bypass from authStore

### 2. Migrate All Pages Off Mock Data (17 files remaining)
These files still import from `mockData.ts` and must be converted to fetch from the database:

| Area | Files |
|------|-------|
| **Student pages** | Dashboard, Courses, Bookmarks, Notes, LearningInterface, QuizInterface |
| **Instructor pages** | Dashboard, CourseEditor |
| **Admin pages** | Dashboard |
| **Admin components** | PlatformAnalytics, CourseApprovalList, UserManagementTable |
| **Public pages** | Landing, CoursePreview |
| **Stores** | progressStore (uses mockCourseProgress) |
| **Components** | SearchCommandPalette |

### 3. Seed the Database
All database tables are currently empty. At minimum, seed one or two courses with sections, lessons, and quiz data so the app has content to display after launch.

---

## High Priority

### 4. Wire Up Progress Tracking to Database
The `progressStore` currently persists to `localStorage` via Zustand. Progress, notes, and bookmarks should read/write to the `course_progress`, `notes`, and `bookmarks` database tables so data persists across devices.

### 5. Wire Up Certificates
`Certificates.tsx` uses hardcoded mock data. It needs a `certificates` table (or derive from `course_progress` where `is_completed = true`) and fetch real completion data.

---

## Medium Priority

### 6. Image Fallbacks on Remaining Pages
`CoursePreview`, `Help`, and `Instructors` pages render external images without `onError` fallback handlers. Add `onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}`.

### 7. Accessibility Pass
- Add `aria-label` to icon-only buttons across layouts
- Verify keyboard navigation on course sidebar and quiz interface
- Improve `alt` text on blog/help page images

---

## Low Priority

### 8. Remove `mockData.ts`
Once all imports are migrated, delete `src/data/mockData.ts` entirely.

### 9. Environment Cleanup
Ensure no dev-only code (console.logs, test credentials) remains in production builds.

---

## Summary

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 1 | Real authentication (Supabase Auth) | Critical | Large |
| 2 | Migrate 17 files off mock data | Critical | Large |
| 3 | Seed database with content | Critical | Medium |
| 4 | Progress/notes/bookmarks to DB | High | Medium |
| 5 | Certificates from DB | High | Small |
| 6 | Image fallbacks on remaining pages | Medium | Small |
| 7 | Accessibility pass | Medium | Medium |
| 8 | Delete mockData.ts | Low | Trivial |
| 9 | Environment cleanup | Low | Trivial |

---

## Technical Notes

- **Auth migration**: The existing `ProtectedRoute` reads from `useAuthStore`. Once the store is backed by Supabase Auth sessions, route protection will work automatically with real users.
- **Data migration order**: Start with authentication (task 1), then seed data (task 3), then migrate pages in this order: public-facing pages (Landing, CoursePreview, Catalog) -> student pages -> instructor pages -> admin pages.
- **The `handle_new_user` trigger** already creates a profile and assigns the `student` role on signup, so the Signup page just needs to pass `first_name` and `last_name` as user metadata.

