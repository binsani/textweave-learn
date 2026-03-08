

# Pending Tasks for Deploy Readiness

Based on a thorough audit of the current codebase and database, here is the updated status of all tasks. Several items from the original plan have already been completed.

---

## Already Completed (No Action Needed)

| Task | Status |
|------|--------|
| Real Authentication (Supabase Auth) | Done — `authStore.ts` uses real Supabase Auth with `signInWithPassword`, `signUp`, `signOut`, `onAuthStateChange` |
| Remove `mockData.ts` | Done — file no longer exists, no imports found |
| Migrate most pages off mock data | Done — Landing, CoursePreview, Admin Dashboard, Student Dashboard/Courses/Certificates, Instructor Dashboard all fetch from database |
| Progress/notes/bookmarks to DB | Done — `progressStore.ts` reads/writes to `course_progress`, `bookmarks`, `notes` tables |
| Certificates from DB | Done — `Certificates.tsx` queries `course_progress` for completed courses |
| Database seeded | Partially done — 5 courses, 12 sections, 15 lessons exist. No quizzes seeded yet. |

---

## Still Pending

### Critical

**1. Seed Quiz Data**
- 0 quizzes exist in the database. The quiz interface will show nothing.
- Need to create quizzes and quiz questions for at least some of the existing courses.
- Effort: Medium

**2. CertificateVerify page still uses hardcoded mock data**
- `src/pages/public/CertificateVerify.tsx` has a hardcoded `certificateDatabase` object with fake certificate entries instead of querying the database.
- Needs to query `course_progress` (or a certificates table) to verify real certificates.
- Effort: Small

### High Priority

**3. Rename "Masashi LMS" across the entire app**
- 269 occurrences of "Masashi" across 30 files (page titles, headers, footer, legal pages, metadata).
- Once a new name is chosen, a global find-and-replace is needed.
- Effort: Medium

**4. Image fallbacks on CoursePreview page**
- `CoursePreview.tsx` renders images without `onError` fallback handlers. Blog and Landing pages already have them.
- Help and Instructors pages don't render `<img>` tags, so they're fine.
- Effort: Trivial

### Medium Priority

**5. Accessibility pass**
- Add `aria-label` to icon-only buttons in layout components (MobileSidebar, AdminLayout, InstructorLayout, StudentLayout).
- Verify keyboard navigation on course sidebar and quiz interface.
- Effort: Medium

### Low Priority

**6. Environment cleanup**
- No `console.log` statements found — this is largely clean already.
- Verify no test credentials are hardcoded (the admin edge function exists but is behind an edge function, not client-side).
- Effort: Trivial

---

## Summary

| # | Task | Priority | Effort | Status |
|---|------|----------|--------|--------|
| 1 | Seed quiz data | Critical | Medium | Pending |
| 2 | Wire CertificateVerify to DB | Critical | Small | Pending |
| 3 | Rename platform (choose name) | High | Medium | Pending — awaiting name choice |
| 4 | Image fallbacks on CoursePreview | High | Trivial | Pending |
| 5 | Accessibility pass | Medium | Medium | Pending |
| 6 | Environment cleanup | Low | Trivial | Mostly done |

## Recommended Order
1. Choose a platform name and rename globally
2. Seed quiz data
3. Wire CertificateVerify to database
4. Add image fallbacks on CoursePreview
5. Accessibility pass

