## 2024-05-26 - Route-based Code Splitting in App.tsx
**Learning:** React applications utilizing Vite tend to compile large bundles if route components are not lazily loaded.
**Action:** Use `React.lazy` and `React.Suspense` to load components that are not immediately needed, particularly admin dashboards and specific blog post pages, to reduce initial bundle sizes.
