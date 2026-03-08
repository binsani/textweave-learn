

# Plan: Merge Vendor and Instructor

## Current State

- **Instructor** = a user role. Every course requires an `instructor_id`.
- **Vendor** = a separate `vendors` table with branding, storefront (`/school/:slug`), certificate customization, and an admin-approval workflow. An instructor must apply and get approved before they get a vendor storefront.
- Courses have an optional `vendor_id` column linking to the vendors table.

The two concepts overlap significantly: both represent "the entity that teaches and publishes courses." The vendor layer adds branding/storefront but requires a separate application flow that adds friction.

## Proposed Merge Strategy

**Eliminate the separate vendor entity.** Move branding/storefront fields directly onto the instructor's profile (or an `instructor_profiles` extension table). Every instructor automatically gets a school page at `/school/:slug`.

### Database Changes

1. **Add storefront columns to `profiles` table** via migration:
   - `school_name`, `school_slug` (unique), `school_description`, `logo_url`, `banner_url`, `website`, `primary_color`, `accent_color`, `certificate_template`, `certificate_bg_url`, `certificate_signature_url`, `certificate_custom_text`, `social_links`, `about_html`
   - Auto-populate `school_slug` from the instructor's name on signup (via trigger or application code)

2. **Migrate existing vendor data** into the corresponding instructor profiles.

3. **Update `courses` table**: Drop `vendor_id` foreign key (courses already have `instructor_id` which now carries all branding).

4. **Drop the `vendors` table** (after data migration).

5. **Update RLS policies** on profiles to allow public read of school fields for instructors.

### Frontend Changes

| Current | After Merge |
|---------|-------------|
| `VendorApplication.tsx` | **Delete** — no application needed |
| `VendorSettings.tsx` | **Rename** to School Settings, read/write from `profiles` instead of `vendors` |
| `VendorAnalytics.tsx` | **Simplify** — just show instructor's own course analytics (no vendor grouping) |
| `VendorStorefront.tsx` | **Update** — query `profiles` by `school_slug` instead of `vendors` |
| `AdminVendors.tsx` | **Delete** — no vendor approval flow |
| `InstructorLayout.tsx` | Update "My School" nav link to point to `/instructor/school-settings` |
| `CourseEditor.tsx` | Remove vendor selection dropdown |
| `Certificates.tsx` | Read certificate branding from instructor profile instead of vendor |
| `App.tsx` routes | Remove `/instructor/vendor*` routes, add `/instructor/school-settings`; remove `/admin/vendors` |
| Admin sidebar | Remove "Vendors" nav item |

### What Instructors Gain

- Automatic school page at `/school/:slug` — no application or admin approval needed
- Branding settings (logo, banner, colors) directly in their settings
- Simpler mental model: one identity, one dashboard

### What Gets Removed

- Vendor application + admin approval workflow
- The concept of a vendor as a separate entity
- Admin vendor management page
- The ability for one vendor to potentially have multiple instructors (not currently implemented anyway)

## Files Affected

~12 files modified/deleted, 1 migration created. Estimated scope: medium-large.

