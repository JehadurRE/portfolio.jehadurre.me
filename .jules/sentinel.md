## 2025-02-27 - Markdown URL Sanitization
**Vulnerability:** XSS risk via `javascript:` and `vbscript:` URIs in Markdown links (`href`).
**Learning:** While `rehypeSanitize` is used, relying on it implicitly without explicit custom sanitization on custom components (like the `a` tag overriding the default) can leave defense-in-depth gaps if configurations change.
**Prevention:** Always implement an explicit URL sanitization utility function (e.g., `sanitizeUrl`) and apply it to dynamically rendered `href` and `src` attributes, especially when handling user-generated or external content in Markdown renderers.
