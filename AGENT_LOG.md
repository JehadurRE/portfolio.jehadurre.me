# Portfolio Enhancement Agent Log — jehadurre.me
Last updated: 2025-10-27
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
- ✅ A6: RSS feed 2025-10-27
- ✅ A7: Reading time calculator 2025-10-27
- ✅ A6: RSS feed 2025-10-26
- ⏳ A7: Reading time calculator
- ✅ A8: Blog post JSON-LD 2025-10-25
- ✅ A9: Sitemap update 2025-10-27
- ✅ A10: Social sharing buttons 2025-10-27

### B — Missing Portfolio Features
- ⏳ B1: Dark/Light mode toggle
- ⏳ B2: Individual Project pages
- ⏳ B3: GitHub Activity Integration
- ⏳ B4: Tech Stack / Skills visualization upgrade
- ⏳ B5: Resume/CV download button
- ⏳ B6: Contact form — fully functional
- ⏳ B7: 404 page
- ⏳ B8: Loading skeletons
- ⏳ B9: Toast notification system
- ⏳ B10: Newsletter signup
- ⏳ B11: Analytics
- ⏳ B12: Reading progress bar
- ⏳ B13: Back to top button
- ⏳ B14: Copy code button
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

---

## JEHAD'S DETECTED INTERESTS
> Inferred from codebase — update if new info found
- Tech stack: React, TypeScript, Vite, Supabase, Tailwind CSS, Framer Motion
- Projects: Work in progress aimed at generating detailed images from Bangla textual descriptions using generative models. ML models for software engineering and data analysis.
- Research areas: Machine Learning Approaches for Software Engineering
- Certifications: AWS Certified Solutions Architect, Google Cloud Professional Developer, Certified Kubernetes Administrator, MongoDB Certified Developer, PMP, Machine Learning Specialization (Stanford)
- Blog categories used:

---

## HUMAN ACTION REQUIRED
> These cannot be automated — Jules will remind every session until resolved

- 🚫 Create `public/og-image.png` (1200×630px)
- 🚫 Add `public/resume.pdf` for CV download button
- 🚫 Set up Plausible/Umami analytics account and add script
- 🚫 Submit sitemap to Google Search Console
- 🚫 Create Supabase blog table (run migration: `supabase/migrations/20251025120000_blog_schema_update.sql`)
- 🚫 Configure EmailJS or Resend for contact form

---

## DAILY LOG

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
