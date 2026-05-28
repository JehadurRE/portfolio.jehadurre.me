## 2024-05-25 - Added ARIA labels and states to Framer Motion icon buttons
**Learning:** Found that `framer-motion` `<motion.button>` components handling icon-only toggles (like theme switchers and mobile menus) frequently lack proper ARIA semantics by default.
**Action:** Always ensure that any interactive elements, especially icon-only toggles powered by animation libraries, have explicit `aria-label`s and `aria-expanded` (or `aria-pressed`) attributes to communicate state changes to screen readers.

## 2024-05-26 - Added ARIA labels to Framer Motion modal close buttons
**Learning:** Found that `<motion.button>` components used to close modals (specifically the "X" icon buttons) in `src/components/Projects.tsx` and `src/components/Certifications.tsx` lacked proper `aria-label` attributes, making them inaccessible to screen readers.
**Action:** When creating or modifying modal components, always verify that the close button (often an icon-only button) has an explicit `aria-label` attribute (e.g., `aria-label="Close README"`) to ensure the action is communicated clearly to assistive technologies.
## 2026-05-27 - [Form Accessibility]
**Learning:** Proper label association with `htmlFor` and `id` makes fields easier to focus on mobile and provides context for screen readers. Unlabeled inputs need an `aria-label`.
**Action:** Always verify if a form input has a valid associated label or aria-label for better accessibility.
