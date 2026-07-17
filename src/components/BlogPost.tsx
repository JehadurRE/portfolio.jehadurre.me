import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { formatDate } from '../utils/dateUtils';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, BookOpen, User } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogApi, type BlogPost as BlogPostType } from '../lib/supabase';

import MarkdownRenderer from '../utils/MarkdownRenderer';
import { useReadingProgress } from '../hooks/useReadingProgress';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const completion = useReadingProgress();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await blogApi.getBySlug(slug);
        setPost(data);
      } catch (err: unknown) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);



  if (loading) {
    return (
      <div className="min-h-screen pt-20 section-padding bg-transparent">
        <div className="container-custom">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 section-padding bg-transparent">
        <div className="container-custom">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4 text-secondary-800 dark:text-secondary-200">
              {error || 'Post Not Found'}
            </h2>
            <p className="text-secondary-600 dark:text-secondary-300 mb-8">
              {error || 'The blog post you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 section-padding bg-transparent">
      <div className="container-custom">

        {/* Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary-600 dark:bg-primary-500 z-50 origin-left"
          style={{ scaleX: completion / 100 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: completion / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
        <Helmet>
          <title>{post.seo_title || post.title} | Jehadur Rahman Emran</title>
          <meta name="description" content={post.seo_description || post.excerpt} />
          <meta property="og:title" content={post.seo_title || post.title} />
          <meta property="og:description" content={post.seo_description || post.excerpt} />
          <meta property="og:type" content="article" />
          {post.cover_image && <meta property="og:image" content={post.cover_image} />}
          <meta property="article:published_time" content={post.published_at} />
          <meta property="article:author" content="Jehadur Rahman Emran" />
          {post.tags.map(tag => (
            <meta property="article:tag" content={tag} key={tag} />
          ))}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://jehadurre.me"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://jehadurre.me/#blog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title
                }
              ]
            })}
          </script>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.seo_title || post.title,
              "description": post.seo_description || post.excerpt,
              "image": post.cover_image,
              "datePublished": post.published_at,
              "dateModified": post.updated_at,
              "author": {
                "@type": "Person",
                "name": "Jehadur Rahman Emran",
                "url": "https://jehadurre.me"
              },
              "url": `https://jehadurre.me/blog/${post.slug}`,
              "keywords": post.tags.join(', '),
              "timeRequired": `PT${post.read_time}M`
            })}
          </script>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://jehadurre.me"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://jehadurre.me/#blog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title,
                  "item": `https://jehadurre.me/blog/${post.slug}`
                }
              ]
            })}
          </script>
        </Helmet>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 mb-8 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </motion.button>
          </Link>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {post.cover_image && (
              <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center space-x-2 text-secondary-500 dark:text-secondary-400">
                <User className="w-4 h-4" />
                <span>Md. Jehadur Rahman Emran</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-500 dark:text-secondary-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-500 dark:text-secondary-400">
                <Clock className="w-4 h-4" />
                <span>{post.read_time} min read</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-500 dark:text-secondary-400">
                <BookOpen className="w-4 h-4" />
                <span>{post.category || 'Article'}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>


            {/* Social Share Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 glass-card text-secondary-600 dark:text-secondary-300 rounded-xl hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Share on Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Share</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 glass-card text-secondary-600 dark:text-secondary-300 rounded-xl hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>Share</span>
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 glass-card text-secondary-600 dark:text-secondary-300 rounded-xl hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Copy Link"
              >
                <Share2 className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-8 lg:p-12 rounded-3xl"
          >
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gradient prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-code:bg-secondary-100 dark:prose-code:bg-secondary-800 prose-code:px-2 prose-code:py-1 prose-code:rounded whitespace-pre-wrap text-secondary-700 dark:text-secondary-300 leading-relaxed">
              <MarkdownRenderer markdown={post.content} />
            </div>
          </motion.article>

          {/* Article Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-secondary-200 dark:border-secondary-700"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-secondary-600 dark:text-secondary-300">
                  Thanks for reading! Feel free to share your thoughts.
                </p>
              </div>
              <div className="flex items-center space-x-4">

                {/* Footer Share Buttons */}
                <div className="flex items-center space-x-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>Share</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    }}
                    className="btn-secondary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    aria-label="Copy Link"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
                <Link to="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;