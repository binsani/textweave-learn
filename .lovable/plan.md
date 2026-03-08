

# Deploy-Readiness Audit — Remaining Tasks

All 12 original plan items are complete. Here is what remains based on the security scan, console logs, and code review:

---

## 1. Security Fixes (2 errors, 2 warnings)

### Error: Quiz answers exposed to students
Students can query `SELECT correct_answer FROM questions` directly, bypassing any client-side answer hiding. **Fix:** Move `correct_answer` and `explanation` to a separate `question_answers` table with a stricter RLS policy (only accessible after quiz submission), or use `REVOKE SELECT` on those columns + a `SECURITY DEFINER` function for server-side validation.

### Error: All authenticated users can read every profile's email
The profiles `SELECT` policy uses `true` for all authenticated users. **Fix:** Restrict to `id = auth.uid()` for full row access; create a limited view or policy for public-facing profile data (name, avatar only).

### Warning: Vendor contact emails publicly readable
The `vendors` SELECT policy for anon exposes `contact_email`. **Fix:** Revoke anon SELECT on that column or remove it from the public policy.

### Warning: Leaked password protection disabled
Requires manual toggle in the backend Authentication settings — cannot be done via migration.

---

## 2. Console Warning: forwardRef in Instructors page
`FormField` is passing a ref to a function component on the Instructors page. **Fix:** Wrap the affected form input component with `React.forwardRef`.

---

## 3. Stub Code: CourseApprovalList TODO
`handleApprove` and `handleReject` in `CourseApprovalList.tsx` are empty stubs with `// TODO` comments. **Fix:** Wire them to update course status in the database.

---

## 4. Unused PlaceholderPage component
`PlaceholderPage.tsx` exists but is not imported anywhere. **Fix:** Delete the file.

---

## Summary

| # | Task | Priority |
|---|------|----------|
| 1 | Protect quiz answers from direct DB queries | High |
| 2 | Restrict profile email visibility to own row | High |
| 3 | Hide vendor contact_email from anon access | Medium |
| 4 | Enable leaked password protection (manual) | Medium |
| 5 | Fix forwardRef warning on Instructors page | Low |
| 6 | Wire CourseApprovalList approve/reject to DB | Medium |
| 7 | Delete unused PlaceholderPage.tsx | Low |

