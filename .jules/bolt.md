## 2024-05-28 - Scroll Event Optimization Pattern
**Learning:** In React, listening to `scroll` events to track scroll position (e.g. `scrollY`) triggers a re-render on every pixel scrolled. This is a common bottleneck in this app's architecture. Additionally, performing synchronous DOM queries (`querySelector`) and reading layout properties (`offsetTop`, `offsetHeight`) inside unthrottled scroll listeners causes severe layout thrashing.
**Action:** When a scroll event is only used for threshold checks (e.g., `scrollY > 50`), store a boolean state (`isScrolled`) instead of the raw number. React's state bailout will automatically prevent re-renders when the boolean doesn't change. For layout reads, always throttle scroll handlers (e.g., using `requestAnimationFrame`) and use `{ passive: true }` to avoid blocking the main thread.
## 2024-05-26 - Route-based Code Splitting in App.tsx
**Learning:** React applications utilizing Vite tend to compile large bundles if route components are not lazily loaded.
**Action:** Use `React.lazy` and `React.Suspense` to load components that are not immediately needed, particularly admin dashboards and specific blog post pages, to reduce initial bundle sizes.
## 2024-05-27 - Lazy loading images
**Learning:** Avoid adding `loading="lazy"` to images that appear immediately 'above the fold' (such as header avatars), as this is an anti-pattern that delays the Largest Contentful Paint (LCP). Only apply to below-the-fold content.
**Action:** Check image locations before lazily loading them.
## 2024-05-27 - Skeleton image loading
**Learning:** Perceived performance is often just as important as actual performance. Adding blur placeholders/skeletons to lazy-loaded images makes the site feel faster and prevents layout shifts.
**Action:** Extract repeated logic for image loading states into a reusable component like `LazyImage`.
