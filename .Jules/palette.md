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
## 2024-05-29 - [Standardizing Error State Retry Pattern UI]
**Learning:** For failed fetch calls, implementing a dedicated retry function is only half the battle. A standard UI pattern is needed to ensure consistency across the application. The standard pattern observed is a `Try Again` button styled with `btn-primary inline-flex items-center space-x-2`, an explicit `aria-label` describing the action, a `disabled={loading}` state, and a `<RefreshCw>` icon from `lucide-react` with an `animate-spin` class and `aria-hidden="true"` while the `loading` state is true.
**Action:** When implementing error state retries, always adhere to the standard UI pattern using the `<RefreshCw>` icon and associated styling/accessibility attributes to maintain a consistent and accessible user experience.
## 2024-05-29 - [Standardizing Error States]
**Learning:** Found that error retry buttons across different components (`About.tsx`, `Blog.tsx`, `Certifications.tsx`) had inconsistent UI patterns and lacked proper accessibility attributes like `aria-hidden` on the refresh icon and descriptive `aria-label`s on the button itself.
**Action:** Standardized the "Try Again" error state pattern. Now all retry buttons use a consistent `inline-flex` layout, a spinning `RefreshCw` icon with `aria-hidden="true"`, an explicit `aria-label`, and a `disabled` state when loading to prevent multiple submissions.
## 2026-06-08 - Enhance error state retry buttons
**Learning:** Found that the 'Try Again' error state retry buttons in components like `Blog.tsx` and `Certifications.tsx` lacked clear feedback when loading and explicit accessibility labels, which is a poor UX pattern in async processes.
**Action:** When implementing error state retries, always add a visual loading indicator (like `animate-spin`), a `disabled` state to prevent duplicate clicks, and an `aria-label` for screen reader users. Also ensure icons inside buttons that already have text have `aria-hidden="true"`.
## 2023-10-25 - Native title attributes vs ARIA labels for icon-only buttons
**Learning:** Removing a native `title` attribute from an icon-only button (even when adding an `aria-label`) degrades discoverability for sighted mouse users because the visual tooltip disappears.
**Action:** When adding `aria-label` to an icon-only button for screen reader support, ALWAYS retain the native `title` attribute as a fallback tooltip, unless replacing it with a custom, accessible visual tooltip component.
## 2026-10-25 - [Dynamic Filter/View Toggle Accessibility]
**Learning:** Dynamic filter or view toggle buttons (like those found in `Projects.tsx`, `Blog.tsx`, and `Certifications.tsx`) map over arrays to create UI controls but lack explicit accessibility attributes by default. Relying solely on the inner text is insufficient because it doesn't communicate the element's purpose as a *filter* or its current active state to screen readers.
**Action:** Always add explicitly interpolated `aria-label`s (e.g., `aria-label=\`Filter by ${category.name}\``) and `aria-pressed` states (e.g., `aria-pressed={filter === category.id}`) to any dynamic toggles or filter buttons to ensure their purpose and active state are clearly communicated to assistive technologies.
## 2026-06-16 - Added explicit aria-labels to unlabelled inputs\n**Learning:** Inputs that rely purely on placeholders or adjacent icons for context (like search bars or newsletter signups) are inaccessible to screen readers without an explicit label.\n**Action:** Always add an `aria-label` to `<input>` elements that lack an associated `<label>` tag to ensure proper screen reader accessibility.
## 2026-06-18 - Added keyboard focus states to Framer Motion link toggles
**Learning:** Found that `<motion.a>` components handling link toggles frequently lack proper visual ARIA focus states by default.
**Action:** Always ensure that any interactive elements, especially link toggles powered by animation libraries, have explicit focus visual states (such as `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`) added to their `className` property to assist keyboard users.
## 2026-06-18 - Focus Visible Styles for Framer Motion Elements
**Learning:** Interactive elements wrapped in Framer Motion components (like `<motion.a>` and `<motion.button>`) in this codebase often lack clear default focus indicators, making them inaccessible for keyboard navigation.
**Action:** Always verify keyboard accessibility (tabbing through the UI). Explicitly add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded` classes to interactive elements to ensure a highly visible focus state without impacting mouse users.
## 2024-05-18 - Playwright Timeouts due to Hardcoded Loading Screens
**Learning:** Hardcoded loading screens with artificial delays (e.g., `setTimeout` for 3 seconds in `LoadingScreen.tsx`) can block automated visual verification tools like Playwright, leading to blank screenshots or timeouts if the script only waits for `networkidle`.
**Action:** When writing frontend verification scripts in this repository, explicitly wait for the loading screen to unmount or for specific content elements (like `#hero` or `header`) to be visible using `page.wait_for_selector('...', state='visible', timeout=10000)` instead of relying solely on network state.
## 2024-06-25 - Added keyboard focus states to Framer Motion link buttons
**Learning:** Found that `<motion.button>` components acting as navigational links in `BlogPost.tsx` frequently lack proper visual ARIA focus states by default.
**Action:** Always ensure that any interactive elements, especially navigational buttons powered by animation libraries, have explicit focus visual states (such as `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded`) added to their `className` property to assist keyboard users.
## 2024-07-21 - [Form Accessibility in Admin Components]
**Learning:** Found that many admin form components (`BlogForm.tsx`, `SkillForm.tsx`, etc.) lacked `htmlFor` on labels and `id` on inputs, reducing accessibility and breaking click-to-focus behavior for users relying on assistive technologies or mouse interactions.
**Action:** Always ensure that form inputs have unique `id`s and their corresponding labels have matching `htmlFor` attributes to properly associate them.
## 2024-08-01 - [Native title attributes vs ARIA labels for icon-only buttons]
**Learning:** Removing a native `title` attribute from an icon-only button (even when adding an `aria-label`) degrades discoverability for sighted mouse users because the visual tooltip disappears.
**Action:** When adding `aria-label` to an icon-only button for screen reader support, ALWAYS retain or add the native `title` attribute as a fallback tooltip, unless replacing it with a custom, accessible visual tooltip component.
