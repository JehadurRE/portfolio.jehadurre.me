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
## 2024-05-29 - MobileNav Scroll Optimization
**Learning:** The `MobileNav` component previously performed synchronous DOM queries (`querySelector`), read layout properties (`offsetTop`, `offsetHeight`), and logged to the console on every pixel scrolled inside an unthrottled scroll listener. This caused severe layout thrashing.
**Action:** When working with scroll tracking for navigation, always use `requestAnimationFrame` to throttle layout reads, use `{ passive: true }` on the event listener, and break early out of mapping loops when the active element is found to save computation. Use `getElementById` instead of `querySelector` for faster DOM access.

## 2024-05-24 - [Syntax Highlighter Bundle Bloat]
**Learning:** `react-syntax-highlighter` includes dictionaries for *all* supported languages by default when importing `Prism` or `Light`, which can add over 1MB to the initial JavaScript bundle if used in a component loaded on the main route.
**Action:** Always import `PrismAsync` (or `LightAsync`) instead of the synchronous versions when using `react-syntax-highlighter` in components that are part of the initial page load to ensure dynamic, on-demand loading of language dictionaries.

## 2024-06-12 - Caching External API Calls in Modals
**Learning:** Repeatedly opening modals that trigger unauthenticated network requests to rate-limited APIs (like the GitHub API for READMEs) quickly exhausts the rate limit and creates redundant loading states, harming perceived performance.
**Action:** When a modal fetches remote data that doesn't change frequently (e.g., project READMEs), always introduce a client-side dictionary cache (`Record<id, data>`) and check it before initiating the fetch.
## 2026-05-31 - Expensive Filter Calculations During Re-Renders
**Learning:** The `Certifications` component used to execute eight separate `Array.prototype.filter()` operations on every render, which is inefficient, especially when triggered frequently by intersection observers or unrelated state changes.
**Action:** Use `useMemo` to cache expensive operations that depend on specific data (like `certifications` or `achievements`). By doing so, the calculations only run when the dependencies change, leading to faster re-renders.
## 2024-06-13 - Expensive Array Operations in Scroll-Heavy Components
**Learning:** Components like `Projects` and `Blog` that use `react-intersection-observer` (`useInView`) trigger re-renders frequently when elements scroll into view. Performing expensive derived state calculations (like array filtering or mapping to sets) on every render is a significant bottleneck.
**Action:** Always wrap derived datasets like `filteredProjects`, `languages`, `allTags`, or `filteredPosts` in `useMemo` hooks. This ensures the array operations are only computed when their explicit dependencies (like the base data or the active filter) change, rather than on every scroll-induced re-render.
