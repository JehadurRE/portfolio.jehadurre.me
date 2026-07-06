💡 What: Added `aria-live="polite"` and `role="status"` to empty state containers in `About.tsx` (skills) and `ProjectDetail.tsx` (README).
🎯 Why: When dynamic filtering yields zero results (e.g. "No skills found in this category"), visually impaired users need screen readers to proactively announce the state change since relying on visual changes alone leaves them without context.
📸 Before/After:
Before: `<div className="...">No skills found...</div>`
After: `<div className="..." aria-live="polite" role="status">No skills found...</div>`
♿ Accessibility: Improves WCAG compliance for dynamic content updates by immediately notifying assistive technologies when empty states appear in the DOM.
