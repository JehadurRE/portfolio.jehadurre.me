-- Insert a new blog post: How I architected my portfolio with Vite + React + Supabase
INSERT INTO blog_posts (
  id,
  title,
  slug,
  excerpt,
  content,
  cover_image,
  category,
  tags,
  published_at,
  read_time,
  is_published,
  views,
  seo_title,
  seo_description,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'How I architected my portfolio with Vite + React + Supabase',
  'how-i-architected-my-portfolio-with-vite-react-supabase',
  'A deep dive into the technical decisions, architecture, and optimizations that power my developer portfolio using Vite, React, and Supabase.',
  '# How I architected my portfolio with Vite + React + Supabase

Building a developer portfolio is more than just throwing together a few static HTML pages. It is an opportunity to showcase your engineering skills, explore new technologies, and build a scalable platform for your personal brand. In this post, I will walk you through how I architected my portfolio using **Vite**, **React**, and **Supabase**, and the technical decisions that went into it.

## What You''ll Learn
- Why I chose Vite and React for my frontend architecture
- How Supabase acts as the perfect backend-as-a-service for personal projects
- Key performance optimizations, including lazy loading and bundle splitting
- Managing SEO and dynamic content in a Single Page Application (SPA)

## The Frontend: Vite and React

When starting a new React project, the ecosystem offers several options: Next.js, Remix, Create React App (CRA), and Vite. I chose **Vite** with **React** for a few specific reasons:

1. **Incredible Developer Experience (DX):** Vite''s dev server starts almost instantly, thanks to native ES modules. Hot Module Replacement (HMR) is lightning fast, making UI iteration a breeze.
2. **Lean Architecture:** Unlike Next.js, which brings a lot of opinions and server-side rendering (SSR) overhead, Vite + React allows for a pure Single Page Application (SPA). For a portfolio that doesn''t require complex server-side data fetching on every request, an SPA is often sufficient and easier to deploy.
3. **Optimized Build Process:** Vite uses Rollup under the hood for production builds, resulting in highly optimized, code-split assets.

### Code Splitting for Performance

One of the first things I implemented was route-level code splitting using `React.lazy` and `Suspense`. This ensures that heavy components, like the Markdown renderer for blog posts or the admin dashboard, are only loaded when needed.

```typescript
// src/App.tsx
import React, { useState, useEffect } from ''react'';
import { Routes, Route, useLocation } from ''react-router-dom'';

// Lazy load heavy components
const Admin = React.lazy(() => import(''./pages/Admin''));
const BlogPost = React.lazy(() => import(''./components/BlogPost''));

// ...

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/blog/:slug" element={
    <React.Suspense fallback={<LoadingScreen />}>
      <BlogPost />
    </React.Suspense>
  } />
</Routes>
```

This simple optimization significantly reduces the initial JavaScript bundle size, improving the Time to Interactive (TTI) for first-time visitors.

## The Backend: Supabase

For a long time, building a full-stack portfolio meant setting up a custom Node.js/Express server, configuring a MongoDB or PostgreSQL database, and writing REST or GraphQL endpoints. **Supabase** completely changes this equation.

Supabase is an open-source Firebase alternative built on top of PostgreSQL. It provides a real-time database, authentication, storage, and auto-generated APIs out of the box.

### Why Supabase?

1. **PostgreSQL Power:** Underneath the hood, Supabase is just standard Postgres. This means I can write raw SQL when I need to, use powerful Postgres functions, and benefit from a robust relational database.
2. **Row Level Security (RLS):** Security is handled directly at the database level. I can define policies that allow anyone to read published blog posts, but restrict inserts and updates to authenticated users (i.e., me).
3. **TypeScript Integration:** Supabase generates TypeScript definitions from my database schema, ensuring end-to-end type safety between my database and frontend components.

### Structuring the Data

The database schema is designed to support dynamic content like blog posts, projects, certifications, and skills. Here is an example of the `blog_posts` table schema:

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT ''{}'',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  read_time INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

This schema provides everything needed for a fully featured blog, including SEO metadata and view tracking.

## Handling SEO in an SPA

One of the main drawbacks of a pure SPA is Search Engine Optimization (SEO). Because the initial HTML is mostly empty (just a `<div id="root">`), web crawlers can struggle to index dynamic content.

To mitigate this, I implemented several strategies:

1. **React Helmet Async:** I use `react-helmet-async` to dynamically inject per-page meta tags (`<title>`, `<meta name="description">`, Open Graph tags) based on the current route or blog post.
2. **Sitemap Generation:** A Node.js script runs during the build process to fetch all published blog posts from Supabase and generate a `public/sitemap.xml` file.
3. **JSON-LD Structured Data:** For blog posts, I inject JSON-LD schema markup into the DOM, helping search engines understand the structure and content of the article.

```tsx
// Example of injecting JSON-LD
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      // ... other metadata
    })}
  </script>
</Helmet>
```

## Common Mistakes and How to Avoid Them

When building a similar architecture, there are a few common pitfalls to watch out for:

1. **Over-fetching Data:** When using Supabase, always use the `select()` method to query only the specific columns you need, especially for list views. Fetching the entire `content` column for an index page can lead to massive payloads.
2. **Ignoring RLS:** Forgetting to enable Row Level Security on your Supabase tables means your data is publicly writable by default. Always enable RLS and write explicit policies.
3. **Synchronous Heavy Imports:** Importing libraries like `react-syntax-highlighter` synchronously can bloat your main bundle. Always use async imports or React.lazy for heavy dependencies that aren''t immediately required.

## Conclusion

Architecting a portfolio with Vite, React, and Supabase provides a fantastic balance of developer experience, performance, and scalability. It allows me to maintain a lean frontend while leveraging the power of a real database for dynamic content like a blog and project showcase.

By focusing on performance optimizations like code splitting and addressing SPA SEO challenges head-on, the result is a fast, robust platform that serves as a solid foundation for my personal brand.

Have you built a portfolio recently? What tech stack did you choose? Let me know!

---
*Did this help? Share it on [Twitter/X](https://twitter.com/intent/tweet?text=How%20I%20architected%20my%20portfolio%20with%20Vite%20%2B%20React%20%2B%20Supabase&url=https://jehadurre.me/blog/how-i-architected-my-portfolio-with-vite-react-supabase) or [connect with Jehad on LinkedIn](https://linkedin.com/in/jehadurre).*',
  '/blog/how-i-architected-my-portfolio-with-vite-react-supabase-cover.jpg',
  'Tutorial',
  ARRAY['React', 'Vite', 'Supabase', 'Architecture', 'TypeScript'],
  CURRENT_TIMESTAMP,
  6,
  true,
  0,
  'How I architected my portfolio with Vite + React + Supabase',
  'A deep dive into the technical decisions, architecture, and optimizations that power my developer portfolio using Vite, React, and Supabase.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
