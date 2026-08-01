INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image,
  category,
  tags,
  published_at,
  read_time,
  seo_title,
  seo_description,
  is_published
) VALUES (
  'React Dark Mode: System Preference & LocalStorage Guide',
  'react-dark-mode-system-preference-localstorage',
  'A comprehensive guide to implementing a robust, zero-flash dark mode in React, honoring both user system preferences and manual local storage overrides.',
  '# React Dark Mode: System Preference & LocalStorage Guide

Implementing dark mode seems deceptively simple. You add a toggle, toggle a class on the `<body>`, and call it a day. However, a truly robust implementation needs to respect the user''s operating system preference, allow them to override it manually, persist that choice across sessions, and do it all without that dreaded "flash of wrong theme" on initial page load.

In this tutorial, we will build a production-ready dark mode system using React Context, a custom hook, and Tailwind CSS. We''ll ensure that the user''s preference is respected seamlessly.

## What You''ll Learn
- How to detect the user''s system theme preference using `window.matchMedia`.
- How to persist theme overrides using `localStorage`.
- How to build a reusable `useDarkMode` hook and integrate it with React Context.
- Strategies to prevent the flash of incorrect theme on initial load.

## The Architecture: State Initialization

The most critical part of a dark mode implementation is the initial state calculation. If we default to ''light'' and the user prefers ''dark'', they will see a flash of white before React hydrates and updates the state.

We need to check two things sequentially:
1. Has the user explicitly set a preference on our site previously? (Check `localStorage`).
2. If not, what is their OS preference? (Check `prefers-color-scheme`).

```tsx
// src/hooks/useDarkMode.ts
import { useState, useEffect } from ''react'';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Note: We check if window is defined for Server-Side Rendering (SSR) compatibility
    if (typeof window !== ''undefined'') {
      const saved = localStorage.getItem(''theme'');

      // If a saved preference exists, use it.
      if (saved) {
         return saved === ''dark'';
      }

      // Otherwise, fallback to the system preference.
      return window.matchMedia(''(prefers-color-scheme: dark)'').matches;
    }
    return false; // Default for SSR
  });

  // ...
```

By passing a function to `useState`, this logic executes synchronously during the initial render, ensuring our React state is immediately correct.

## Applying the Theme and Persisting

Next, we need a side effect that applies the theme to the DOM. In Tailwind CSS, this usually means adding or removing the `dark` class on the `<html>` root element. Whenever `isDark` changes, we also want to save that new state to `localStorage`.

```tsx
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add(''dark'');
    } else {
      root.classList.remove(''dark'');
    }
    localStorage.setItem(''theme'', isDark ? ''dark'' : ''light'');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return { isDark, toggleTheme };
};
```

## Distributing State via Context

While you *could* use this hook in every component that needs it, that would cause redundant `localStorage` reads. A better approach is to wrap it in a React Context so the state is managed in one place and provided to the rest of the application.

```tsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext } from ''react'';
import { useDarkMode } from ''../hooks/useDarkMode'';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(''useTheme must be used within a ThemeProvider'');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

Wrap your `<App />` in this `<ThemeProvider>`, and now any component can call `const { isDark, toggleTheme } = useTheme();`.

## Common Mistakes and How to Avoid Them

1. **The Flash of Unstyled Content (FOUC):** Even with our robust React initialization, if you are using Server-Side Rendering (like Next.js or Gatsby) or Static Site Generation, the initial HTML sent to the client won''t have the `dark` class. You must include a tiny blocking `<script>` in the `<head>` of your HTML document that runs the exact same initialization logic before React even loads.
2. **Ignoring System Changes:** Our hook checks the system preference on load, but what if the user changes their OS theme *while* viewing the site? A truly complete solution adds an event listener to `window.matchMedia(''(prefers-color-scheme: dark)'')` to dynamically update the state if `localStorage` hasn''t been explicitly set.
3. **Hardcoding Colors:** Avoid hardcoding specific hex values in your components. Use CSS variables or Tailwind''s semantic utility classes (e.g., `text-gray-900 dark:text-gray-100`) so your components automatically adapt.

## Conclusion

Implementing dark mode is more than just toggling CSS. By combining `localStorage`, system media queries, and React Context, we''ve built a robust, user-friendly theme system that respects user preferences immediately.

What challenges have you faced when implementing dark mode in your projects? Let''s discuss on Twitter!

---
*Did this help? Share it on [Twitter/X](https://twitter.com/intent/tweet?text=React%20Dark%20Mode%3A%20System%20Preference%20%26%20LocalStorage%20Guide&url=https://jehadurre.me/blog/react-dark-mode-system-preference-localstorage) or [connect with Jehad on LinkedIn](https://linkedin.com/in/jehadurre).*',
  '/blog/react-dark-mode-system-preference-localstorage-cover.jpg',
  'Tutorial',
  ARRAY['react', 'dark-mode', 'css', 'tailwind', 'ux'],
  '2026-08-01 00:00:00+00',
  4,
  'React Dark Mode: System Preference & LocalStorage Guide',
  'Learn how to implement a professional dark mode in React that respects system preferences and saves user overrides using local storage.',
  true
);
