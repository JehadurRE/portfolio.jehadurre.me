## What/why
- Added `vercel.json` with a rewrite rule. Since this application is a Vite-based SPA, Vercel needs to be configured to fallback to `/index.html` on unmatched routes (like deep links or page refreshes). This resolves 404s on direct navigation to routes like `/blog/building-scalable-react-applications`.
- Updated `src/components/ErrorBoundary.tsx` to explicitly catch `ChunkLoadError` and "Failed to fetch dynamically imported module" errors. When these happen (typically because a user is on the site while a new deployment finishes, deleting the old JS chunks), it now automatically calls `window.location.reload()` to silently fetch the newest version, improving the user experience rather than showing the red crash screen.

## Files changed
- `vercel.json`
- `src/components/ErrorBoundary.tsx`

## Human action items outstanding
- None.

## Build Verification Status
- Linting passed
- Build completed successfully
