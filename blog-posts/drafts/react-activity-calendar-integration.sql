INSERT INTO blog_posts (
  id, title, slug, excerpt, content, cover_image, category, tags,
  published_at, read_time, is_published, views, seo_title, seo_description
) VALUES (
  gen_random_uuid(),
  'Showcasing Your GitHub Activity in React: A Complete Guide',
  'showcasing-github-activity-react-complete-guide',
  'Learn how to easily integrate and visualize your GitHub contribution graph in a React portfolio using react-activity-calendar and serverless API endpoints.',
  '# Showcasing Your GitHub Activity in React: A Complete Guide

If you''re a developer, your GitHub contribution graph is your true resume. While listing projects is great, nothing says "I write code every day" like a sea of green squares. When building my portfolio, I knew I needed to embed my GitHub activity directly into my "About" section.

In this tutorial, we''ll explore how to add a beautiful, interactive GitHub activity calendar to your React application using the excellent `react-activity-calendar` package, without needing a heavy backend.

## What You''ll Learn
- How to fetch GitHub contribution data without authentication headaches
- How to format that data for `react-activity-calendar`
- How to style the calendar to match your dark/light theme automatically

## The Problem: Fetching the Data

The biggest hurdle with GitHub''s API is that it doesn''t provide a simple endpoint for "give me the contribution graph data" without resorting to complex GraphQL queries and personal access tokens. You definitely don''t want to expose a GitHub PAT in your frontend!

The solution? We can use a lightweight, community-maintained serverless endpoint that scrapes the public contribution graph and returns it as JSON. I chose to use `github-contributions-api.jasonrogers.workers.dev`.

## Step 1: Install Dependencies

First, let''s add the necessary package:

```bash
pnpm add react-activity-calendar
```

If you are using Vite and React, `react-activity-calendar` is lightweight and renders the squares using simple SVG elements, which is great for performance.

## Step 2: The Component Setup

Let''s create a new component `GithubActivity.tsx`. We''ll need to fetch the data and transform it into the format the calendar expects: an array of objects containing `date`, `count`, and a `level` from 0 to 4.

```tsx
import React, { useState, useEffect } from "react";
import ActivityCalendar, { ThemeInput } from "react-activity-calendar";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const GithubActivity: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  const username = "YourGitHubUsername";

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`https://github-contributions-api.jasonrogers.workers.dev/${username}`);
        const data = await response.json();

        // Find last 365 days
        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);

        // Transform the nested JSON into a flat array
        const formattedData = Object.keys(data.contributions).flatMap(year => {
            return Object.keys(data.contributions[year]).flatMap(month => {
                return Object.keys(data.contributions[year][month]).map(day => {
                   const count = data.contributions[year][month][day];
                   const dateStr = `${year}-${String(month).padStart(2, ''0'')}-${String(day).padStart(2, ''0'')}`;

                   // Determine the color intensity level
                   let level: 0|1|2|3|4 = 0;
                   if (count > 0 && count <= 3) level = 1;
                   else if (count > 3 && count <= 6) level = 2;
                   else if (count > 6 && count <= 9) level = 3;
                   else if (count > 9) level = 4;

                   return { date: dateStr, count, level };
                });
            })
        })
        .filter(d => new Date(d.date) >= lastYear && new Date(d.date) <= today)
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setContributions(formattedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  // ... render method
};
```

## Step 3: Styling and Theming

One of the best features of `react-activity-calendar` is the ability to define custom themes. Since my portfolio supports both light and dark modes via Tailwind CSS, I wanted the calendar to match exactly.

```tsx
  const explicitTheme: ThemeInput = {
    light: [''#f0fdf4'', ''#dcfce7'', ''#86efac'', ''#22c55e'', ''#166534''],
    dark: [''#1e293b'', ''#064e3b'', ''#059669'', ''#10b981'', ''#34d399''],
  };

  if (loading) return <div>Loading activity...</div>;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800">
      <ActivityCalendar
        data={contributions}
        theme={explicitTheme}
        labels={{
            totalCount: `{{count}} contributions in the last year`,
        }}
      />
    </div>
  );
```

## Common Mistakes and How to Avoid Them

1. **Not handling timezone differences:** Be careful when filtering dates; JavaScript''s `Date` object parses `YYYY-MM-DD` as UTC, which can shift your squares by a day depending on the user''s timezone.
2. **Exposing personal API tokens:** Never use a GitHub Personal Access Token directly in your frontend code. If the public scraper APIs ever go down, the proper way to handle this is a small serverless function (e.g., using Supabase Edge Functions or Next.js API routes) that safely makes the authenticated request.

## Conclusion

Adding a GitHub contribution graph adds a dynamic, personal touch to any developer portfolio. By leveraging `react-activity-calendar` and a public worker API, you can implement this feature in under an hour without wrestling with GraphQL.

Have you built something cool for your portfolio recently? Let me know on LinkedIn!',
  '/blog/showcasing-github-activity-react-complete-guide-cover.jpg',
  'Tutorial',
  ARRAY['React', 'GitHub API', 'TypeScript', 'Portfolio'],
  NOW(),
  6,
  true,
  0,
  'Showcasing Your GitHub Activity in React: A Complete Guide',
  'Learn how to easily integrate and visualize your GitHub contribution graph in a React portfolio using react-activity-calendar and serverless API endpoints.'
);
