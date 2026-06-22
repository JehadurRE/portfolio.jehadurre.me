
## 2024-06-21 - Focus states on motion.button
**Learning:** In this application, many interactive elements are built using `<motion.button>` from Framer Motion. By default, these elements (or standard `<button>` elements with reset styles like `outline-none`) often lack visible focus states. This significantly impairs keyboard navigation accessibility.
**Action:** When adding or auditing interactive elements, especially those using Framer Motion, explicitly add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500` (or `ring-green-400` as appropriate for the context) to ensure a clear focus indicator is visible for keyboard users.

## 2024-06-21 - Contact form button accessibility
**Learning:** The Contact form submit button handles async submission (displaying "Sending..."). While it was `disabled` during submission, it didn't communicate its state clearly to screen reader users using an `aria-live` region. Adding `aria-disabled` combined with a live region allows screen readers to announce the changing state effectively.
**Action:** When working on async submit buttons, wrap the loading text in a `<span aria-live="polite">` and consider adding `aria-disabled` matching the disabled state to enhance screen reader announcements without breaking standard disabled behavior.
