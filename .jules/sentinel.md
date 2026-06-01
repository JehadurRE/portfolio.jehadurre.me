## 2024-05-30 - Admin Login Info Leakage & Missing Input Constraints
**Vulnerability:** Admin login error handling exposed the raw backend error message `err.message` to the user. Additionally, multiple user-facing and admin-facing forms lacked any input length constraints (`maxLength`), opening the potential for excessive resource consumption or minor DoS by malicious large inputs.
**Learning:** This codebase historically defaults to passing raw error messages upward and relies on client-side logic without built-in HTML element length constraints.
**Prevention:** Catch errors as `unknown` (rather than `any`), log details securely via `console.error()`, and always display a generic fallback message like "Invalid email or password." Always include `maxLength` on form inputs matching expected field constraints.
## 2025-02-27 - Markdown URL Sanitization
**Vulnerability:** XSS risk via `javascript:` and `vbscript:` URIs in Markdown links (`href`).
**Learning:** While `rehypeSanitize` is used, relying on it implicitly without explicit custom sanitization on custom components (like the `a` tag overriding the default) can leave defense-in-depth gaps if configurations change.
**Prevention:** Always implement an explicit URL sanitization utility function (e.g., `sanitizeUrl`) and apply it to dynamically rendered `href` and `src` attributes, especially when handling user-generated or external content in Markdown renderers.
## 2025-02-27 - Markdown Image URL Sanitization
**Vulnerability:** XSS risk via `javascript:` and `vbscript:` URIs in Markdown images (`src`).
**Learning:** The previous fix only addressed `a` tags, leaving `img` tags vulnerable to similar malicious URIs.
**Prevention:** Apply the `sanitizeUrl` utility consistently to all attributes that accept URLs, including `src` in `img` tags.
## 2025-06-25 - Data URI XSS Bypass
**Vulnerability:** XSS vulnerability in Markdown link rendering via `data:` URIs (e.g., `[click here](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)`). The original sanitization only blocked `javascript:` and `vbscript:`.
**Learning:** Naive URL sanitization filters often overlook `data:` URIs. While `data:image/...` is safe for `<img>` tags, `data:text/html` or `data:image/svg+xml` in `<a>` tags can lead to script execution if the user clicks the link.
**Prevention:** Implement context-aware URL sanitization. Block all `data:` URIs in links by default, and explicitly allow only `data:image/...` URIs when the context is known to be an image source where scripts cannot execute.
## 2026-06-01 - Supabase Mutation Info Leakage
**Vulnerability:** Supabase mutation catch blocks in admin forms exposed the raw backend error message `err.message` to the user, potentially leaking database details or schema information.
**Learning:** The codebase previously used `catch (err: any)` and passed `err.message` directly to the UI's error state in data mutation forms (Blog, Achievement, Skill, Certification).
**Prevention:** Use `catch (err: unknown)`, log the specific error securely via `console.error()`, and display a generic, safe fallback message (e.g., 'Failed to save post') to the user.
