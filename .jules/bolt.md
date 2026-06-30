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

## 2024-10-27 - Supabase Object Counts Optimization
**Learning:** Fetching full datasets to calculate counts client-side results in large O(N) network payloads and unnecessary memory allocation, which is severely inefficient for large tables.
**Action:** When querying Supabase just for record counts (e.g., total blog posts, featured skills), use `.select('*', { count: 'exact', head: true })`. This performs an O(1) HEAD request, offloading the calculation to the database and vastly reducing both the network payload and the client's memory footprint.
## 2024-06-13 - Expensive Array Operations in Scroll-Heavy Components
**Learning:** Components like `Projects` and `Blog` that use `react-intersection-observer` (`useInView`) trigger re-renders frequently when elements scroll into view. Performing expensive derived state calculations (like array filtering or mapping to sets) on every render is a significant bottleneck.
**Action:** Always wrap derived datasets like `filteredProjects`, `languages`, `allTags`, or `filteredPosts` in `useMemo` hooks. This ensures the array operations are only computed when their explicit dependencies (like the base data or the active filter) change, rather than on every scroll-induced re-render.

## 2024-06-15 - Memoizing Derived States and Expensive Array Operations with useInView
**Learning:** Because this application extensively uses `react-intersection-observer` (`useInView`), components re-render frequently during scroll events. In components like `Projects` and `Blog`, expensive array operations (like creating `Set`s from mapped arrays or running multiple `.filter()` operations) were running on every re-render, creating a performance bottleneck specific to this architecture.
**Action:** Always memoize derived states and expensive array operations (e.g., filtering lists or generating tag/language collections) using `useMemo` in components that re-render frequently due to scroll or intersection observers. This prevents unnecessary heavy calculations and improves UI responsiveness.

## 2024-06-21 - Moving Static Arrays Outside Components
**Learning:** In React, defining arrays or objects inside a component function body causes them to be recreated on every single render. When components re-render frequently (e.g., due to scroll events or `useInView`), this leads to unnecessary memory allocation and garbage collection overhead.
**Action:** When static arrays or objects do not depend on component state or props, always move them outside the component function body so they are instantiated only once when the module loads.
## 2024-06-25 - Expensive Filter Calculations in Admin Components During Re-Renders
**Learning:** The admin components (`SkillManager`, `CertificationManager`, `AchievementManager`, `BlogManager`) were executing multiple `Array.prototype.filter()` operations on every render. For example, `SkillManager` alone had 8 separate filter operations for categories, plus one for the displayed skills. This created an O(N) bottleneck on every state change or re-render.
**Action:** Always wrap derived datasets like `filteredSkills`, `categories`, `filteredCertifications`, `filteredAchievements`, and `filteredPosts` in `useMemo` hooks in admin panels to avoid redundant calculations.
## 2024-07-28 - Moving Static Arrays Outside Components
**Learning:** In React components that re-render frequently (like those using `useInView` for scroll animations), defining static arrays or objects inside the component function body causes them to be recreated on every single render. This leads to unnecessary memory allocation and garbage collection overhead.
**Action:** When static arrays or objects do not depend on component state or props, always hoist them outside the component function body so they are instantiated only once when the module loads. This is a common and easy performance win, especially in UI-heavy applications.
## 2024-07-28 - Moving Static Functions Outside Components
**Learning:** In React components that re-render frequently (like those using `useInView` for scroll animations), defining static functions (such as icon mappers like `getIconComponent`) inside the component function body causes them to be recreated on every single render. This leads to unnecessary memory allocation and garbage collection overhead.
**Action:** When static functions do not depend on component state or props, always hoist them outside the component function body so they are instantiated only once when the module loads. This is a common and easy performance win, especially in UI-heavy applications.
## 2023-10-27 - [ReactMarkdown Re-render Optimization]
**Learning:** In `react-markdown`, passing freshly allocated arrays (`[]`) and object references (`{}`) to `remarkPlugins`, `rehypePlugins`, or `components` causes the component to completely re-parse and re-render the Markdown AST on every render of the parent component, even if the markdown string itself didn't change.
**Action:** Always move static plugin arrays (e.g. `[remarkGfm]`) outside of the component body as static constants, and wrap any dynamically generated `components` prop in a `useMemo` hook (with its appropriate dependencies) to maintain stable references.
## 2024-08-11 - Hoisting static arrays passed to component props
**Learning:** React re-evaluates all variables inside the component body during a re-render. If you construct an array or object inline or inside the component function and pass it as a prop (such as the `sequence` prop for `TypeAnimation`), the child component receives a new reference on every render, which can cause unnecessary re-renders.
**Action:** When an array or object is static, define it outside the component function body. This ensures it's only created once and maintains reference stability across re-renders.

## 2024-06-12 - Prevent Re-renders by Hoisting Static Configuration Arrays
**Learning:** In scroll-heavy applications (like this single-page portfolio with Intersection Observers for many components), it is a common anti-pattern to define static configuration arrays (e.g., `navItems`, `socialLinks`, `quickLinks`) inside the React functional component body. Doing so causes the array to be re-created on every single render. Since `useEffect` dependencies or child components often rely on object identity, these new arrays can cause unnecessary re-renders or allocations, increasing the Time to Interactive (TTI) and dropping frame rates during scrolling.
**Action:** Always inspect functional components for static data (arrays or objects) that do not depend on props or state. Hoist them outside the component function body. If the array or object must depend on props, memoize it using `useMemo`. This codebase has now been consistently optimized for this pattern across `Footer.tsx`, `Header.tsx`, `MobileNav.tsx`, `About.tsx`, `Hero.tsx`, and `Research.tsx` (previously optimized).

## 2024-11-20 - Intl.DateTimeFormat Re-initialization Bottleneck
**Learning:** Calling `new Date().toLocaleDateString()` inside lists or scroll-heavy components triggers the re-initialization of the `Intl.DateTimeFormat` object on every re-render. This is a severe bottleneck compared to `.format()`, taking ~100x longer to execute in benchmarks (1.8s vs 14ms for 10k ops).
**Action:** Always hoist `new Intl.DateTimeFormat()` outside the component as a static instance and use its `.format(new Date())` method in components that render frequently or render large lists of dates.
## 2024-08-11 - Hoisting static functions outside component function body
**Learning:** In React components that re-render frequently (like those using `useInView` for scroll animations), defining static helper functions (like `formatDate` or `getGithubOGImage`) inside the component function body causes them to be recreated on every single render. This leads to unnecessary memory allocation and garbage collection overhead.
**Action:** When helper functions do not depend on component state or props, always hoist them outside the component function body so they are instantiated only once when the module loads. This is a common and easy performance win, especially in UI-heavy applications.

## 2024-11-20 - Inline Arrays passed to mapping loops inside render functions
**Learning:** In React components that re-render frequently, defining inline static arrays inside the component function body or directly inside a JSX `.map()` call (like `{(['all', 'award'] as const).map(...)}`) causes them to be recreated on every single render. This leads to unnecessary memory allocation and garbage collection overhead.
**Action:** Always hoist static filter configuration arrays or similar static collections outside the component function body (e.g. `const FILTER_OPTIONS = ['all', 'published', 'draft'] as const;`) so they are instantiated only once when the module loads. This is a common and easy performance win, especially in UI-heavy admin panels.

## 2024-11-20 - Inline Array creation passed to mapping loops inside render functions
**Learning:** In React components that re-render frequently, defining inline static arrays inside the component function body or directly inside a JSX `.map()` call causes them to be recreated on every single render. This leads to unnecessary memory allocation and garbage collection overhead.

## 2024-11-20 - Markdown Renderer Standardization
**Learning:** The `BlogPost` component was importing and rendering `ReactMarkdown` directly with custom `remarkPlugins` and `rehypePlugins` arrays. This is an anti-pattern as it bypasses the optimized, centralized `MarkdownRenderer` component which already handles asynchronous syntax highlighting (`PrismAsync`), proper dependency memoization, sanitization, and GitHub URL conversion, significantly reducing bundle size and preventing re-renders.
**Action:** Replace inline `ReactMarkdown` usage with the centralized `MarkdownRenderer` component across all views displaying markdown.
## 2024-11-20 - Memoizing Config Arrays Bound to State
**Learning:** In React components that re-render frequently, defining inline configuration arrays inside the component function body causes them to be recreated on every single render. When these arrays depend on local component state (e.g. `statCards` depending on `stats` data), they cannot be statically hoisted outside the component body.
**Action:** When creating configuration arrays that depend on component state (such as `statCards` or `categories` inside admin UI components), always wrap them in a `useMemo` hook with the relevant state dependencies instead of hoisting them outside the component body. This prevents unnecessary array allocations on every render without breaking their reactivity to state changes.

## 2026-06-23 - Prevent Duplicate Function Initialization & IIFE in Render
**Learning:** Defining local utility functions like `formatDate` that duplicate imported utils (e.g., in `Projects.tsx`) causes unnecessary `Intl.DateTimeFormat` initializations and bundle duplication. Similarly, using Immediately Invoked Function Expressions (IIFEs) inline inside JSX (e.g., in `AdminDashboard.tsx`) forces React to create a new anonymous function object on every render.
**Action:** Delete duplicate local function definitions if the utility is already imported. Replace inline IIFEs in render functions with direct calls or memoized values to prevent unnecessary function allocations on re-renders.
## 2024-06-25 - Prevent Frequent Object Reallocation in Mapped Components
**Learning:** Functions that return statically mapped values (e.g., mapping a string to a Lucide React icon component) shouldn't define the mapping object inside the function body if the function is called repeatedly (such as within a component's render loop or `.map()`). Defining `const icons = { ... }` inside `getIconComponent` means a new object is allocated in memory and subsequently garbage collected on every invocation.
**Action:** When creating utility mapping functions or standard mappings, explicitly hoist the mapping dictionary (e.g. `const icons = { ... }`) to module-level scope outside the function body. Doing this simultaneously centralizes duplicates across components (like `About.tsx` and `SkillManager.tsx`) into shared utilities (`skillUtils.ts`), reducing bundle sizes and eliminating unnecessary object allocations.
## 2024-05-24 - Code Split MarkdownRenderer in Projects.tsx
**Learning:** Initial application load included `MarkdownRenderer` in the main bundle through `Projects.tsx`, which brings in hefty dependencies like `react-markdown` and `react-syntax-highlighter`, bloating the bundle significantly (adding ~600KB). The renderer is only needed when a user clicks a project to view its README modal.
**Action:** Implemented code-splitting in `Projects.tsx` by changing the static import of `MarkdownRenderer` to a dynamic `React.lazy()` import wrapped in a `React.Suspense` boundary. This correctly splits `MarkdownRenderer` and its heavy dependencies into a separate chunk (`MarkdownRenderer-[hash].js`), dramatically reducing the size of the initial entry bundle (`index-[hash].js`).
## 2024-11-20 - Hoisting Admin Form Option Arrays
**Learning:** In admin panels built with frequently re-rendering components (like `SkillForm` and `AchievementForm`), static configuration arrays for select dropdowns or button groups (such as `iconOptions`, `categoryOptions`, and `proficiencyLevels`) were defined inside the component function body. This causes unnecessary memory reallocation on every render when the user interacts with form inputs.
**Action:** Move all static, unchanging options arrays (e.g., `iconOptions`, `categoryOptions`) outside the component function body. They do not depend on form state or props and should be instantiated once at the module scope.
## 2024-11-20 - Ensure Build Artifacts Aren't Committed

**Learning:** When generating a build using dummy Supabase environment variables, the prebuild scripts (`generateRSS.ts`, `generate-sitemap.ts`) will fail to fetch actual data and overwrite `public/rss.xml` and `public/sitemap.xml` with empty/truncated content. Committing these files leads to massive regressions in SEO indexation.

**Action:** Always explicitly verify `git status` after running `pnpm build`, and use `git restore` and `git checkout` to discard unintentional changes to auto-generated build artifacts like `public/rss.xml` and `public/sitemap.xml` before submitting the PR.
