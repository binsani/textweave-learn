

# Deploy-Readiness Audit (Frontend Only)

The app is well-built with all pages complete, consistent styling, error boundaries, code-splitting, and a clean codebase. Below are the remaining items to address before deploying.

---

## 1. SEO and Meta Tags

Currently only `index.html` has meta tags. React Router pages don't update the document title or meta description per route.

**Fix:** Add a lightweight `useDocumentTitle` hook (or use `react-helmet-async`) so each page sets its own `<title>` and `<meta description>`. This is critical for SEO and for users bookmarking pages.

---

## 2. Accessibility (a11y) Improvements

- The mobile menu toggle button in `PublicLayout.tsx` has an `aria-label`, which is good.
- However, many interactive elements across the app (e.g., icon-only buttons, form inputs without visible labels in some components) could benefit from an accessibility pass.
- The blog and help page images from Unsplash may need more descriptive `alt` text.
- Keyboard navigation should be verified on the course sidebar and quiz interface.

---

## 3. Image Optimization

- No images use `loading="lazy"` for below-the-fold content.
- Course thumbnails and blog images (external Unsplash URLs) have no fallback if they fail to load. Adding `onError` handlers with a placeholder fallback would prevent broken image icons.
- Consider adding `width` and `height` attributes to prevent layout shift (CLS).

---

## 4. Login Redirect Logic

Currently `Login.tsx` always redirects to `/student/dashboard` after login, ignoring the user's actual role. It should redirect based on role (student/instructor/admin) similar to the `getDashboardLink()` logic already in `PublicLayout.tsx`.

---

## 5. Route Protection

There are no route guards. Any unauthenticated user can navigate directly to `/student/dashboard`, `/instructor/dashboard`, or `/admin/dashboard`. A `ProtectedRoute` wrapper component should redirect unauthenticated users to `/login` and optionally check role-based access.

---

## 6. 404 Page Styling

The `NotFound` page is minimal and doesn't use `PublicLayout`, so it lacks the header/footer. It should be wrapped in the public layout or at least include navigation back to the app.

---

## 7. Favicon and PWA Basics

- `favicon.ico` and `favicon.png` exist, which is good.
- No `manifest.json` or `apple-touch-icon` -- adding these would improve mobile "Add to Home Screen" experience and is a quick win.

---

## 8. Performance: Font Loading

The app loads Google Fonts (Crimson Pro + Inter) via a CSS `@import`, which is render-blocking. Switching to a `<link rel="preload">` in `index.html` would improve First Contentful Paint.

---

## 9. Remove Dev-Only Features

The `switchRole` function in `authStore.ts` allows role switching without authentication. If any UI exposes this (e.g., a dev toolbar), it should be removed or gated behind a dev-mode flag before deploying.

---

## Summary: Priority Order

| Priority | Item | Effort |
|----------|------|--------|
| High | Route protection (guards) | Medium |
| High | Login redirect by role | Small |
| High | SEO / page titles | Small |
| Medium | Image lazy loading + fallbacks | Small |
| Medium | 404 page with layout | Small |
| Medium | Font preloading | Small |
| Low | Accessibility pass | Medium |
| Low | PWA manifest | Small |
| Low | Remove dev role-switching | Small |

---

## Technical Details

- **Route Guards**: Create a `ProtectedRoute` component that reads `useAuthStore` and wraps role-specific route groups. Redirect to `/login` if unauthenticated, or to the appropriate dashboard if wrong role.
- **Page Titles**: A simple `useEffect(() => { document.title = "Page - Masashi LMS" }, [])` in each page, or a shared hook.
- **Font Preload**: Move the Google Fonts URL from `index.css` `@import` to `<link rel="preconnect">` + `<link rel="preload">` in `index.html`.
- **Image Fallbacks**: Add `onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}` to `<img>` tags with external sources.

