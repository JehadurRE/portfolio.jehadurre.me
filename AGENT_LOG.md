# Portfolio Enhancement Agent Log — jehadurre.me
Last updated: 2026-07-18
Stack: React + TypeScript + Vite + Supabase
Domain: https://jehadurre.me

---

## MASTER FEATURE CHECKLIST

> ✅ DONE | ⏳ PENDING | 🔁 NEEDS REVIEW | 🚫 BLOCKED | ➕ NEW THIS SESSION

### A — Blog System
- ✅ A1: Blog routing /blog/:slug 2025-10-25
- ✅ A2: Blog post Supabase schema 2025-10-25
- ✅ A3: BlogPost page component 2025-10-25
- ✅ A4: Blog index page 2025-10-26
- ✅ A5: Per-post SEO meta tags 2025-10-25
- ✅ A6: RSS feed 2025-10-26
- ✅ A7: Reading time calculator 2025-10-27
- ✅ A8: Blog post JSON-LD 2025-10-25
- ✅ A9: Sitemap update 2025-10-27
- ✅ A10: Social sharing buttons 2026-06-16

### B — Missing Portfolio Features
- ✅ B1: Dark/Light mode toggle 2025-10-27
- ✅ B2: Individual Project pages 2026-06-25
- ✅ B3: GitHub Activity Integration 2026-06-27
- ✅ B4: Tech Stack / Skills visualization upgrade 2026-06-30
- ✅ B5: Resume/CV download button 2026-07-01
- ✅ B6: Contact form — fully functional 2026-06-29
- ✅ B7: 404 page 2026-07-01
- ✅ B8: Loading skeletons 2026-07-04
- ✅ B9: Toast notification system 2026-06-29
- ✅ B10: Newsletter signup 2026-07-05
- ⏳ B11: Analytics
- ✅ B12: Reading progress bar 2026-07-13
- ✅ B13: Back to top button 2026-07-18
- ✅ B14: Copy code button 2026-07-18
- ⏳ B15: Search
- ⏳ B16: Smooth page transitions

### C — Code Quality
- ⏳ C1: TypeScript strict mode
- ⏳ C2: Error boundaries
- ⏳ C3: Environment variable validation
- ⏳ C4: Custom React hooks
- ⏳ C5: Supabase Row Level Security
- ⏳ C6: Image optimization
- ⏳ C7: Lazy loading routes

### D — SEO
- ⏳ D1: public/robots.txt complete
- ✅ D2: public/sitemap.xml includes all blog post URLs 2025-10-27
- ⏳ D3: public/llms.txt updated with new blog posts
- ✅ D4: Per-page meta tags via react-helmet-async 2025-10-25
- ⏳ D5: JSON-LD per page type
- ✅ D6: RSS feed at /rss.xml 2025-10-26
- ⏳ D7: All Core Web Vitals improvements

---

## BLOG POSTS PUBLISHED
> Agent never repeats a topic from this list

| # | Date | Slug | Title | Category | Words |
|---|------|------|-------|----------|-------|
| 3 | 2026-07-13 | machine-learning-in-software-engineering-workflows | Machine Learning in Software Engineering: Bridging Research and Practice | Research | 839 |
| 2 | 2026-06-25 | building-the-research-management-system | Deep Dive: Building the Research Management System | Project | 442 |
| 1 | 2025-10-27 | how-i-architected-my-portfolio-with-vite-react-supabase | How I architected my portfolio with Vite + React + Supabase | Tutorial | 812 |

---

## JEHAD'S DETECTED INTERESTS
> Inferred from codebase — update if new info found
- Tech stack: React, TypeScript, Vite, Supabase, Tailwind CSS, Framer Motion
- Projects: Work in progress aimed at generating detailed images from Bangla textual descriptions using generative models. ML models for software engineering and data analysis.
- Research areas: Machine Learning Approaches for Software Engineering
- Certifications: AWS Certified Solutions Architect, Google Cloud Professional Developer, Certified Kubernetes Administrator, MongoDB Certified Developer, PMP, Machine Learning Specialization (Stanford)
- Blog categories used: Tutorial, Project

---

## HUMAN ACTION REQUIRED
> These cannot be automated — Jules will remind every session until resolved

- 🚫 Run SQL insert script `blog-posts/drafts/machine-learning-in-software-engineering-workflows.sql` in Supabase to publish the new blog post
- 🚫 Create `public/og-image.png` (1200×630px)
- 🚫 Add `public/resume.pdf` for CV download button
- 🚫 Set up Plausible/Umami analytics account and add script
- 🚫 Submit sitemap to Google Search Console
- 🚫 Create Supabase blog table (run migration: `supabase/migrations/20251025120000_blog_schema_update.sql`)
- 🚫 Configure EmailJS for contact form (Add YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, and YOUR_PUBLIC_KEY in src/components/Contact.tsx)
- 🚫 Run SQL insert script `blog-posts/drafts/how-i-architected-my-portfolio-with-vite-react-supabase.sql` in Supabase to publish the new blog post
- 🚫 Run SQL insert script `blog-posts/drafts/building-the-research-management-system.sql` in Supabase to publish the new blog post

---

## DAILY LOG

### 2026-07-18 — Day 15 — BUILD MODE
**Branch:** feature/B14-copy-code-button-2026-07-18
**PR:** feat: Marked Copy code button complete — Day 15
**Mode:** BUILD
**Files changed:**
- `AGENT_LOG.md`: Marked B14 as completed because it's already implemented.

**If BUILD:**
- Items completed: B14
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Verified that `CopyButton` component already exists and is implemented in `src/utils/MarkdownRenderer.tsx` and used for code blocks.


### 2026-07-18 — Day 14 — BUILD MODE
**Branch:** feature/B13-back-to-top-2026-07-18
**PR:** feat: Back to top button — Day 14
**Mode:** BUILD
**Files changed:**
- `src/components/BackToTop.tsx`: Created BackToTop component with Framer Motion animations and lucide-react icon, appears on scroll after 500px and scrolls to top on click.
- `src/App.tsx`: Imported and rendered `BackToTop` component to be available globally across pages.
- `AGENT_LOG.md`: Marked B13 as completed.

**If BUILD:**
- Items completed: B13
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Added an accessible back to top button to improve navigation on long pages, particularly the homepage and blog posts.


### 2026-07-13 — Day 13 — BOTH MODE
**Branch:** feat-blog/reading-progress-and-post-2026-07-13
**PR:** feat: Reading progress bar and new ML in SE blog post — Day 13
**Mode:** BOTH
**Files changed:**
- `src/hooks/useReadingProgress.ts`: Created a custom React hook to calculate scroll completion percentage using pure JS.
- `src/components/BlogPost.tsx`: Imported and implemented the reading progress hook using Framer Motion to display a horizontal progress bar fixed at the top of the screen.
- `AGENT_LOG.md`: Checked off B12 and added daily log entry.
- `blog-posts/drafts/machine-learning-in-software-engineering-workflows.sql`: Created SQL insert script for the new blog post.

**If BUILD:**
- Items completed: B12
- Items skipped: None

**If WRITE:**
- Post title: Machine Learning in Software Engineering: Bridging Research and Practice
- Slug: /blog/machine-learning-in-software-engineering-workflows
- Category: Research
- Word count: 839
- Primary keyword: Machine Learning Approaches for Software Engineering
- File: blog-posts/drafts/machine-learning-in-software-engineering-workflows.sql

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Added a reading progress bar to blog posts for better UX without requiring heavy external dependencies. Also wrote a new blog post discussing the intersection of machine learning and software engineering based on Jehad's research interests.




### 2026-07-05 — Day 12 — BUILD MODE
**Branch:** feature/B10-newsletter-signup-2026-07-05
**PR:** feat: Newsletter signup implementation — Day 12
**Mode:** BUILD
**Files changed:**
- `src/lib/supabase.ts`: Added `subscribeToNewsletter` function with strict constraint handling.
- `src/components/Blog.tsx`: Hooked up newsletter form to Supabase and added Sonner toasts.
- `src/components/Footer.tsx`: Hooked up newsletter form to Supabase and added Sonner toasts.
- `supabase/migrations/20260705120000_newsletter_schema.sql`: Created migration for `newsletter_subscribers` table.

**If BUILD:**
- Items completed: B10
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Implemented functional newsletter signup form connected to Supabase with duplicate email handling (`23505`) and GDPR consent text to both the blog and footer components.

### 2026-07-04 — Day 11 — BUILD MODE
**Branch:** feature/B8-loading-skeletons-2026-07-04
**PR:** feat: Loading skeletons for dynamic content — Day 11
**Mode:** BUILD
**Files changed:**
- `src/components/Blog.tsx`: Replaced loading spinner with react-loading-skeleton cards.
- `src/components/Projects.tsx`: Replaced loading spinner with react-loading-skeleton cards.
- `src/pages/ProjectDetail.tsx`: Replaced loading spinner with react-loading-skeleton cards.
- `src/components/Certifications.tsx`: Replaced loading spinner with react-loading-skeleton cards.
- `src/App.tsx`: Added react-loading-skeleton CSS import.
- `src/index.css`: Added CSS variables for skeleton colors in dark/light mode.

**If BUILD:**
- Items completed: B8
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Implemented loading skeletons across components that fetch data from Supabase or GitHub API (Blog, Projects, ProjectDetail, Certifications) to improve UX and perceived performance. Added theming support for dark mode skeleton colors.


### 2026-07-01 — Day 10 — BUILD MODE
**Branch:** feature/B7-not-found-page-2026-07-01
**PR:** feat: 404 Page implementation — Day 10
**Mode:** BUILD
**Files changed:**
- `src/pages/NotFound.tsx`: Created custom 404 page design using Framer Motion and standard layout options.
- `src/App.tsx`: Updated routing with `*` catch-all mapping to the NotFound page.
- `AGENT_LOG.md`: Updated checklist status.

**If BUILD:**
- Items completed: B5, B7
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Added a customized NotFound page matching the site's aesthetic. Also marked B5 (Resume/CV download) as completed, as it had previously been implemented.

### 2026-06-30 — Day 9 — BUILD MODE
**Branch:** feature/B4-skills-visualization-2026-06-30
**PR:** feat: Tech Stack / Skills visualization upgrade — Day 9
**Mode:** BUILD
**Files changed:**
- `src/components/About.tsx`: Refactored to replace compact/detailed view toggle with an interactive, tab-based category navigation (Frontend, Backend, Cloud, Database, Tools, Research). Added a 5-star proficiency rating system utilizing `lucide-react` icons. Rebuilt `skillsraw` fallback array.
- `package.json`: Added `react-icons` and `@playwright/test` (for frontend verification).

**If BUILD:**
- Items completed: B4
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Upgraded skills grid to an interactive tab-based view grouped by categories. Replaced text proficiency with visual 5-star ratings. Also added robust fallback `skillsraw` data to handle potential Supabase configuration failures gracefully.

### 2026-06-29 — Day 8 — BUILD MODE
**Branch:** feature/B6-contact-form-2026-06-29
**PR:** feat: Contact form and Toast notifications — Day 8
**Mode:** BUILD
**Files changed:**
- `src/App.tsx`: Added `Toaster` from `sonner` for global toast notifications.
- `src/components/Contact.tsx`: Replaced dummy form submission with `@emailjs/browser` integration, `react-hook-form` + `zod` for validation, and added `sonner` toast notifications for success/error states. Added a 60-second rate limit.

**If BUILD:**
- Items completed: B6, B9
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Implemented functional contact form with EmailJS and global toast notifications using sonner. Human action required to add EmailJS credentials to `src/components/Contact.tsx`.

### 2026-06-27 — Day 7 — BUILD MODE
**Branch:** feature/B3-github-activity-2026-06-27
**PR:** feat: GitHub Activity Integration fixes — Day 7
**Mode:** BUILD
**Files changed:**
- `src/components/GithubActivity.tsx`: Swapped out the dead API for the github activity calendar, replaced with a working deno.dev endpoint, and updated mapping to properly calculate the array `react-activity-calendar` expects without raising type errors.

**If BUILD:**
- Items completed: B3
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** The community API used for Github contributions had gone down, causing the profile to only display statistics. Restored full visual map support via a reliable Deno alternative.

### 2026-06-25 — Day 4 — BOTH MODE
**Branch:** feat-blog/project-pages-and-post-2026-06-25
**PR:** feat: Individual Project Pages and new blog post — Day 4
**Mode:** BOTH
**Files changed:**
- `src/pages/ProjectDetail.tsx`: Created new page to display individual project details and README.
- `src/App.tsx`: Added lazy-loaded route for `/projects/:slug`.
- `src/components/Projects.tsx`: Refactored to remove the in-page modal and link to the new project detail pages.
- `blog-posts/drafts/building-the-research-management-system.sql`: Created SQL insert script for the new blog post.

**If BUILD:**
- Items completed: B2
- Items skipped: None

**If WRITE:**
- Post title: Deep Dive: Building the Research Management System
- Slug: /blog/building-the-research-management-system
- Category: Project
- Word count: 442
- Primary keyword: Research Management System
- File: blog-posts/drafts/building-the-research-management-system.sql

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Replaced complex modal state in Projects.tsx with standard React Router navigation, improving performance and enabling direct linking (SEO benefit). Also wrote a new blog post breaking down the architecture of the Research Management System project.

### 2025-10-27 — Day 3 — BUILD MODE (2)
**Branch:** feature/B1-dark-mode-2025-10-27
**PR:** feat: Dark/Light mode toggle — Day 3
**Mode:** BUILD
**Files changed:**
- `src/index.css`: Fix dark mode transition

**If BUILD:**
- Items completed: B1
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Added dark mode transition CSS

### 2025-10-27 — Day 3 — BUILD MODE
**Branch:** feature/blog-reading-time-A7-2025-10-27
**PR:** feat: Auto-calculate blog reading time — Day 3
**Mode:** BUILD
**Files changed:**
- `src/components/admin/BlogForm.tsx`: Updated to auto-calculate the reading time when the content field is changed. Also set the input field to `readOnly`.
- `src/components/Header.tsx`, `src/components/Certifications.tsx`, `src/components/BlogPost.tsx`, `src/lib/generateRSS.ts`: Fixed pre-existing linting and build issues so standard pipeline works cleanly.

**If BUILD:**
- Items completed: A7
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Added integration of the `calculateReadingTime` utility with the `BlogForm` component, streamlining the content authoring process and guaranteeing consistency in reading time metadata. Included fixups for existing build failures.

### 2025-10-26 — Day 2 — BUILD MODE (2)
**Branch:** feature/blog-rss-A6-2025-10-26
**PR:** feat: Generate blog RSS feed on build — Day 2
**Mode:** BUILD
**Files changed:**
- `package.json`: Added `feed`, `dotenv`, and `tsx` dependencies, along with `prebuild` script.
- `src/lib/generateRSS.ts`: Implemented script using the Supabase client to fetch published posts and generate `public/rss.xml`.
- `index.html`: Added `<link>` tag referencing the RSS feed.
- `public/sitemap.xml`: Added entry for `rss.xml`.

**If BUILD:**
- Items completed: A6, D6
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Added the `generateRSS.ts` prebuild step to create an automated RSS feed. Used `dotenv` to load environment variables safely during the script execution. Handled Supabase fetch error gracefully (so it doesn't fail the build when Supabase is down).

### 2025-10-26 — Day 2 — BUILD MODE
**Branch:** feature/blog-index-upgrade-2025-10-26
**PR:** feat: Blog index page features (search, sort, filter, featured post) — Day 2
**Mode:** BUILD
**Files changed:**
- `src/components/Blog.tsx`: Implemented advanced features for the blog index page, including:
  - Search functionality
  - Category filtering
  - Sorting (Latest, Oldest, Most Viewed)
  - Featured post distinct layout
  - Pagination ("Load More" button)

**If BUILD:**
- Items completed: A4
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Completed the A4 requirements to significantly improve the UX of the blog index page.

### 2025-10-25 — Day 1 — BUILD MODE
**Branch:** feat-blog/routing-schema-2025-10-25
**PR:** feat: Blog routing, schema update and metadata — Day 1
**Mode:** BUILD
**Files changed:**
- `package.json`: Add react-router-dom, react-helmet-async, react-markdown, remark/rehype plugins
- `src/main.tsx`: Wrap App with BrowserRouter and HelmetProvider
- `src/App.tsx`: Define routes `/` and `/blog/:slug` using React Router
- `src/pages/Home.tsx`: Extract homepage content into separate page
- `src/components/Header.tsx`, `src/components/MobileNav.tsx`, `src/components/Footer.tsx`: Update navigation anchor links based on React Router `useLocation`
- `src/components/Blog.tsx`: Update `handlePostClick` to use `useNavigate`
- `supabase/migrations/20251025120000_blog_schema_update.sql`: Add missing schema fields for blog posts
- `src/lib/supabase.ts`: Update `BlogPost` interface types
- `src/components/BlogPost.tsx`: Fetch `slug` from `useParams`, render content using `react-markdown`, dynamically set SEO meta tags

**If BUILD:**
- Items completed: A1, A2, A3, A5, A8, D4
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Initial setup of standard SPA routing using react-router-dom, prepared enhanced blog post schema and markdown rendering.

### 2026-06-16 — Day 3 — BUILD MODE
**Branch:** feature/blog-sharing-A10-2026-06-16
**PR:** feat: Add social sharing buttons to blog posts — Day 3
**Mode:** BUILD
**Files changed:**
- `src/components/BlogPost.tsx`: Replaced native Web Share API button with dedicated Twitter, LinkedIn, and copy link buttons. Implemented copy to clipboard feedback using a local state.

**If BUILD:**
- Items completed: A10
- Items skipped: None

**Build:** pnpm lint ✅ | pnpm build ✅
**Notes:** Added standard share intents without requiring a heavy package. Preserved full keyboard accessibility.
