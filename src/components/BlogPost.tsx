import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, User } from 'lucide-react';
import { blogApi, type BlogPost as BlogPostType } from '../lib/supabase';

interface BlogPostProps {
  slug: string;
  onNavigateHome: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ slug, onNavigateHome}) => {
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log('onNavigateHome:', onNavigateHome);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogApi.getBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

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
            <h1 className="text-3xl font-bold mb-4 text-secondary-800 dark:text-secondary-200">
              {error || 'Post Not Found'}
            </h1>
            <p className="text-secondary-600 dark:text-secondary-300 mb-8">
              {error || 'The blog post you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateHome}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateHome}
            className="inline-flex items-center space-x-2 mb-8 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </motion.button>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
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
                <span>Article</span>
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

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="inline-flex items-center space-x-2 px-4 py-2 glass-card text-secondary-600 dark:text-secondary-300 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </motion.button>
          </motion.header>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-8 lg:p-12 rounded-3xl"
          >
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gradient prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-code:bg-secondary-100 dark:prose-code:bg-secondary-800 prose-code:px-2 prose-code:py-1 prose-code:rounded">
              {/* Content formatting */}
              <div className="whitespace-pre-wrap text-secondary-700 dark:text-secondary-300 leading-relaxed">
                {post.content.split('\n\n').map((paragraph, index) => {
                  // Handle different content types
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-secondary-800 dark:text-secondary-200">
                        {paragraph.replace('# ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-secondary-800 dark:text-secondary-200">
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const code = paragraph.replace(/```[\w]*\n?/, '').replace(/```$/, '');
                    return (
                      <pre key={index} className="bg-secondary-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto my-6">
                        <code>{code}</code>
                      </pre>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(item => item.startsWith('- '));
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 my-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  
                  return (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNavigateHome}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </motion.button>
              </div>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;