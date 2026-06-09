## 2024-05-25 - Added ARIA labels and states to Framer Motion icon buttons
**Learning:** Found that `framer-motion` `<motion.button>` components handling icon-only toggles (like theme switchers and mobile menus) frequently lack proper ARIA semantics by default.
**Action:** Always ensure that any interactive elements, especially icon-only toggles powered by animation libraries, have explicit `aria-label`s and `aria-expanded` (or `aria-pressed`) attributes to communicate state changes to screen readers.

## 2024-05-26 - Added ARIA labels to Framer Motion modal close buttons
**Learning:** Found that `<motion.button>` components used to close modals (specifically the "X" icon buttons) in `src/components/Projects.tsx` and `src/components/Certifications.tsx` lacked proper `aria-label` attributes, making them inaccessible to screen readers.
**Action:** When creating or modifying modal components, always verify that the close button (often an icon-only button) has an explicit `aria-label` attribute (e.g., `aria-label="Close README"`) to ensure the action is communicated clearly to assistive technologies.
## 2026-05-27 - [Form Accessibility]
**Learning:** Proper label association with `htmlFor` and `id` makes fields easier to focus on mobile and provides context for screen readers. Unlabeled inputs need an `aria-label`.
**Action:** Always verify if a form input has a valid associated label or aria-label for better accessibility.
## 2024-05-28 - [Error State Retry Pattern]
**Learning:** Hard reloads (`window.location.reload()`) for recovering from API errors result in poor user experience because they reset the entire application state and force the user to scroll back down.
**Action:** Always implement a dedicated `retry` function for failed fetch calls. Wrap it in a UI that does not reload the page and provides visual feedback (like a loading spinner).
## 2024-03-24 - Replace Full-Page Reloads with Async Component Refetching
**Learning:** Found an anti-pattern where component-level data fetch errors in `Blog.tsx` and `Certifications.tsx` were handled by triggering a jarring full page reload (`window.location.reload()`). This severely disrupted UX and could potentially cause loss of transient state in other areas of the SPA.
**Action:** Always extract inner fetch logic out of `useEffect` hooks so it can be attached directly to local UI retry buttons, ensuring error recovery is localized and doesn't flush application state.
