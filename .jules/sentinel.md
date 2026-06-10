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
## 2025-06-25 - Information Leakage in Admin Forms
**Vulnerability:** Admin forms (`AchievementForm`, `BlogForm`, `CertificationForm`, `SkillForm`) used `catch (err: any)` and directly rendered `err.message` from Supabase database mutation errors to the UI, leaking potentially sensitive backend details to end-users if an error occurred.
**Learning:** This codebase historically defaults to passing raw error messages upward instead of using generic fallback messages.
**Prevention:** Always refactor error catching for database calls to use strict `catch (err: unknown)` typing, log the actual error securely using `console.error`, and display a hardcoded generic error message such as "An error occurred while saving." to the user.
## 2025-06-25 - Missing Input Constraints in Admin Forms
**Vulnerability:** Multiple admin-facing forms (`AchievementForm`, `BlogForm`, `CertificationForm`, `SkillForm`) lacked `maxLength` constraints on their text input fields. This omission could allow malicious users to submit excessively large strings, potentially leading to resource exhaustion or minor DoS attacks.
**Learning:** This codebase historically relies on client-side logic without built-in HTML element length constraints.
**Prevention:** Always include `maxLength` on form inputs matching expected field constraints.
## 2023-10-27 - [URL Sanitization Bypass via URL-Encoding]
**Vulnerability:** XSS bypass in custom URL sanitizer (`sanitizeUrl` in `MarkdownRenderer.tsx`). Attackers could use URL-encoded whitespaces or control characters (e.g., `%09javascript:alert(1)`) to bypass regex filters that only check for unencoded control characters `[\x00-\x20]`.
**Learning:** Browsers decode URL-encoded payloads before evaluating the scheme (like `javascript:`). If a sanitizer checks the raw, encoded input without decoding it first, malicious schemes can slip through.
**Prevention:** Always decode URLs (using `decodeURIComponent`, with appropriate `catch` blocks for malformed URIs) before applying string or regex-based security filters.
## 2026-06-06 - Refactor API Error Handling UI
**Vulnerability:** API error handling fallback buttons previously used `window.location.reload()` to trigger refetch, which forced a full page reload and lost all local application state. This architectural pattern can be exploited as a denial of service if an attacker intentionally hits failing endpoints to exhaust resources or user state.
**Learning:** This codebase historically defaults to utilizing `window.location.reload()` for fallback states instead of utilizing local refetch functions, especially when components fetch data on mount within `useEffect`.
**Prevention:** Avoid `window.location.reload()` for error recovery. Always extract fetch logic into a standalone function (e.g. `fetchData`) and call it directly from the UI retry button to maintain application state while recovering.
## 2025-02-27 - Centralized URL Sanitization
**Vulnerability:** XSS risk via unvalidated `verification_url` rendered in `<a>` tags within `CertificationManager.tsx` and `Certifications.tsx`.
**Learning:** `MarkdownRenderer.tsx` already had a `sanitizeUrl` utility, but other components directly consumed dynamic inputs for URLs without sanitizing them.
**Prevention:** Extracted the URL sanitization logic into a shared utility (`src/utils/sanitizeUrl.ts`) and applied it to dynamically rendered `href` attributes across components to ensure consistent XSS protection.
