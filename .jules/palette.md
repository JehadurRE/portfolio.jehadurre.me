## $(date +%Y-%m-%d) - Modal Keyboard Accessibility
**Learning:** Custom modals (like those using Framer Motion) in React don't have native keyboard support. Users expect to be able to dismiss them using the Escape key. Without this, keyboard-only users and screen reader users can get trapped or face a degraded experience, violating WCAG 2.1.1 Keyboard Accessible.
**Action:** Always add a global `keydown` event listener for the 'Escape' key when implementing custom modal/dialog components. Ensure it is attached when the modal opens and cleaned up when the modal closes (e.g., using `useEffect` with dependency tracking).
## $(date +%Y-%m-%d) - Empty State ARIA Live Regions
**Learning:** When users interact with dynamic filtering or search components (like tabs, categories, or search inputs), screen reader users need immediate feedback if their action results in zero matches. Relying on visual changes alone (like the appearance of a "No items found" message) leaves them without context.
**Action:** Always add `aria-live="polite"` and `role="status"` to empty state container components (e.g., `<div>` or `<motion.div>`) that conditionally render when a list is empty. This ensures screen readers announce the empty state text as soon as it appears in the DOM.
## 2024-05-30 - Focus Visibility on Framer Motion Elements
**Learning:** Elements styled with Framer Motion (`<motion.button>`, `<motion.a>`) or custom buttons in dynamic components often lack default focus rings, severely degrading keyboard accessibility for tab-navigating users.
**Action:** Consistently apply `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500` (or the respective primary brand color ring) to all interactive elements to ensure WCAG 2.4.7 Focus Visible compliance, so keyboard users can track their location on the page.
## 2024-07-01 - Replace Blocking Alerts with Toast Notifications
**Learning:** Using native browser `alert()` for user feedback (like copying to clipboard) blocks the main thread, pauses all UI updates, and provides a jarring user experience. Users prefer non-intrusive feedback that doesn't interrupt their workflow.
**Action:** Always replace native `alert()` calls with non-blocking toast notifications (e.g., using `sonner` or the project's toast library) for transient success/error feedback.
## 2024-07-24 - Empty States in Dynamic Layouts
**Learning:** For layout grids handling dynamic data (e.g., project filters), missing "empty state" handling will cause the layout to abruptly collapse or display a blank void, leading to confusing UX and non-accessible interactions (since screen readers get nothing).
**Action:** Always wrap dynamic rendering arrays (like `.map`) in a ternary checking for `.length === 0` and provide a fallback `aria-live="polite"` empty state message so visually impaired users know why the UI changed.

## 2024-05-23 - Playwright Focus-Visible Verification
**Learning:** When using Playwright to verify Tailwind's `focus-visible` styles, using `page.focus()` will fail to trigger the pseudo-class because the browser requires a keyboard event.
**Action:** Always simulate keyboard navigation using `page.keyboard.press('Tab')` to successfully capture the focus ring in automated tests.

## $(date +%Y-%m-%d) - Focus Accessibility on Custom Terminal Inputs
**Learning:** Custom terminal-style inputs using `outline-none` lack visual focus indicators, hindering keyboard navigation. Furthermore, without proper ARIA attributes, validation errors lack direct association with the failing inputs, making error recovery difficult for screen reader users.
**Action:** When styling custom terminal inputs with `outline-none`, manually re-add focus rings (e.g., `focus-visible:ring-1 focus-visible:ring-green-500 rounded`) for keyboard accessibility. Ensure validation errors are directly linked to inputs using `aria-invalid`, `aria-describedby`, and use `role="alert"` on the error text.
