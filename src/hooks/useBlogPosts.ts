import { useState, useEffect } from 'react';
import { blogApi, type BlogPost } from '../lib/supabase';

let cachedPosts: BlogPost[] | null = null;
let fetchPromise: Promise<BlogPost[]> | null = null;

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(cachedPosts || []);
  const [loading, setLoading] = useState(!cachedPosts);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (force = false) => {
    if (!force && cachedPosts) {
      setPosts(cachedPosts);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!fetchPromise || force) {
        fetchPromise = blogApi.getPublished();
      }

      const data = await fetchPromise;
      cachedPosts = data;
      setPosts(data);
    } catch (err: unknown) {
      console.error('Error fetching blog posts:', err);
      fetchPromise = null;
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, fetchPosts };
};
