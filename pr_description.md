### Fix Blank Screen & Add Error Boundaries

**Description:**
The application was suffering from a critical issue causing it to show a completely blank page. This was traced down to a `ReferenceError: Skeleton is not defined` inside `src/components/Projects.tsx`. Without an error boundary in place to catch this, the uncaught exception bubbled up to the top and crashed the entire React component tree.

**Changes:**
1.  **Fixed Missing Import:** Added the missing `Skeleton` component import from `react-loading-skeleton` at the top of `src/components/Projects.tsx`.
2.  **Added `ErrorBoundary`:** Introduced an `ErrorBoundary` component (`src/components/ErrorBoundary.tsx`) to wrap the main `<App />` tree in `src/main.tsx`. This ensures that any future runtime exceptions inside child components are caught locally, instead of causing the entire application to show a blank screen. It also provides a friendly "fallback UI" where users can restart the application securely and easily.

**Testing:**
- Verified that the `Projects` component correctly renders and the application boots successfully without any blank screen errors.
- Executed Playwright visually via headless tests to confirm there are no more uncaught error exceptions output from the browser console, confirming everything is functioning normally.
- Passed `pnpm lint` and `pnpm build` successfully with no build failures.
