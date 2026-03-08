

# Plan: Enforce Admin Approval for Course Publishing

## Current State
- CourseEditor has a "Submit for Review" button that sets status to `pending_review` (local state only)
- CourseApprovalList lets admins approve/reject courses
- **Problem**: The CourseEditor doesn't persist to the database - `handleSaveAll` only updates local state and shows a toast

## Changes Required

### 1. Database: RLS Policy Update
Add a policy to prevent instructors from setting their own courses to "published" status. Only admins should be able to publish.

```sql
-- Create function to prevent instructors from publishing directly
CREATE OR REPLACE FUNCTION public.validate_course_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If changing to 'published', require admin role
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    IF NOT has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can publish courses';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on courses table
CREATE TRIGGER enforce_course_publishing
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION validate_course_status_change();
```

### 2. CourseEditor: Implement Database Persistence
Update `handleSaveAll` and `handlePublish` to actually save to Supabase:
- Save course metadata, sections, and lessons to database
- For new courses: INSERT into courses table
- For existing courses: UPDATE courses, upsert sections/lessons
- Submit for Review: Update status to `pending_review`

### 3. UI Improvements
- Remove any direct "Publish" option from instructor UI (keep only "Submit for Review")
- Show clear status messages explaining the review process
- Add a "Resubmit for Review" option for courses that were rejected (sent back to draft)

### 4. Notification System (Future Enhancement)
Store rejection reasons so instructors can see why their course was rejected. This would require a `course_reviews` or `moderation_log` table.

## Files to Modify
| File | Changes |
|------|---------|
| `supabase/migrations/` | New migration with publishing trigger |
| `src/pages/instructor/CourseEditor.tsx` | Implement Supabase persistence for save/submit |
| `src/components/admin/CourseApprovalList.tsx` | Minor: store rejection reason in future |

## Flow After Implementation
1. Instructor creates/edits course → saves as **draft**
2. Instructor clicks "Submit for Review" → status changes to **pending_review**
3. Admin sees course in Review Queue → can **Approve** (published) or **Reject** (back to draft)
4. If published, course becomes visible to students
5. If rejected, instructor can edit and resubmit

