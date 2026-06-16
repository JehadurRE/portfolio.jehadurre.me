import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, ArrowRight, RefreshCw, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { blogApi, type BlogPost } from '../lib/supabase';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return dateFormatter.format(date);
};

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'viewed'>('latest');
  const [visibleCount, setVisibleCount] = useState(8);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogApi.getPublished();
      setPosts(data);
    } catch (err: unknown) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ⚡ Bolt Performance Optimization:
  // Memoize `allTags` and `filteredPosts` to avoid running costly operations on every render.
  // Expected impact: Prevents unnecessary heavy calculations, improving UI responsiveness.
  const allTags = useMemo(() => ['all', ...new Set(posts.flatMap(post => post.tags))], [posts]);
  const allCategories = useMemo(() => ['all', ...new Set(posts.map(post => post.category || 'Uncategorized'))], [posts]);

  // Apply filters, search, and sorting
  const processedPosts = useMemo(() => {
    let filtered = selectedTag === 'all'
      ? posts
      : posts.filter(post => post.tags.includes(selectedTag));

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => (post.category || 'Uncategorized') === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      }
      if (sortBy === 'viewed') {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });
  }, [posts, selectedTag, selectedCategory, searchQuery, sortBy]);

  // Isolate featured post (first post if no filters are active and sorted by latest, or first processed post)
  const featuredPost = useMemo(() => {
    if (processedPosts.length > 0 && selectedTag === 'all' && selectedCategory === 'all' && searchQuery === '' && sortBy === 'latest') {
      return processedPosts[0];
    }
    return null;
  }, [processedPosts, selectedTag, selectedCategory, searchQuery, sortBy]);

  // Remaining posts to show in grid
  const gridPosts = useMemo(() => {
    const startIdx = featuredPost ? 1 : 0;
    return processedPosts.slice(startIdx, visibleCount + (featuredPost ? 1 : 0));
  }, [processedPosts, featuredPost, visibleCount]);

  const hasMore = processedPosts.length > (featuredPost ? 1 : 0) + gridPosts.length;

  const handlePostClick = (slug: string,cardId: string) => {
    sessionStorage.setItem('fromBlog', 'true');
  sessionStorage.setItem('scrollToCardId', cardId);

  console.log('Navigating to blog post:', slug);
  //card
  console.log('Card ID:', cardId);
    navigate(`/blog/${slug}`);
  };

  if (error) {
    return (
      <section id="blog" className="section-padding bg-transparent">
        <div className="container-custom">
          <div className="text-center py-16 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 text-secondary-800 dark:text-secondary-200">
              Blog & Insights
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchPosts()}
              disabled={loading}
              className="btn-primary inline-flex items-center space-x-2"
              aria-label="Try Again: load blog posts"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" aria-labelledby="blog-heading" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 id="blog-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            Blog & Insights
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            Sharing thoughts on technology, software development, and research discoveries
          </p>
        </motion.div>

        {/* Controls: Search, Category, Sort */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        >
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              aria-label="Search blog posts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50 dark:bg-secondary-900/50"
            />
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-xl glass border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50 dark:bg-secondary-900/50 text-secondary-700 dark:text-secondary-300"
              aria-label="Filter by category"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest' | 'viewed')}
              className="px-4 py-2 rounded-xl glass border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50 dark:bg-secondary-900/50 text-secondary-700 dark:text-secondary-300"
              aria-label="Sort posts"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="viewed">Most Viewed</option>
            </select>
          </div>
        </motion.div>

        {/* Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {allTags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(tag)}
              aria-label={`Filter by ${tag === 'all' ? 'all posts' : tag}`}
              aria-pressed={selectedTag === tag}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedTag === tag
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'glass-card text-secondary-600 dark:text-secondary-300 hover:shadow-md'
              }`}
            >
              {tag === 'all' ? 'All Posts' : tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-secondary-600 dark:text-secondary-300">Loading blog posts...</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5 }}
                onClick={() => handlePostClick(featuredPost.slug, 'blog-post-featured')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePostClick(featuredPost.slug, 'blog-post-featured');
                  }
                }}
                className="glass-card mb-12 hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col md:flex-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {featuredPost.cover_image && (
                  <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <img src={featuredPost.cover_image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className={`p-8 md:p-12 flex flex-col justify-center ${featuredPost.cover_image ? 'md:w-1/2' : 'w-full'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                      Featured
                    </span>
                    <span className="px-3 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 rounded-full">
                      {featuredPost.category || 'Uncategorized'}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {formatDate(featuredPost.published_at)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {featuredPost.read_time} min read</span>
                    </div>
                    <motion.div whileHover={{ x: 5 }} className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-medium">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            )}
          <div className="grid md:grid-cols-2 gap-8">
            {gridPosts.map((post, index) => (
              <motion.article
                id={`blog-post-${post.id}`}
                key={post.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePostClick(post.slug, `blog-post-${index}`);
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * (index % 8) }}
                whileHover={{ y: -5 }}
                className="glass-card flex flex-col hover:shadow-xl transition-all duration-300 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 overflow-hidden"
                onClick={() => handlePostClick(post.slug, `blog-post-${post.id}`)}
              >
                {post.cover_image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-3">
                    <span className="px-3 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 rounded-full">
                      {post.category || 'Uncategorized'}
                    </span>
                  </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center justify-between text-sm text-secondary-500 dark:text-secondary-400 mb-4 mt-auto pt-4">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time} min read</span>
                    </div>
                    {post.views !== undefined && (
                      <div className="flex items-center space-x-1" aria-label={`${post.views} views`}>
                        <Eye className="w-4 h-4" aria-hidden="true" />
                        <span>{post.views}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Read More */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-medium"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="btn-secondary"
              >
                Load More Posts
              </motion.button>
            </div>
          )}
          </>
        )}

        {/* No posts message */}
        {!loading && processedPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
              {selectedTag === 'all' && selectedCategory === 'all' && searchQuery === ''
                ? 'No blog posts available'
                : 'No posts found matching your criteria'}
            </h3>
            <p className="text-secondary-500 dark:text-secondary-500">
              {selectedTag === 'all' && selectedCategory === 'all' && searchQuery === ''
                ? 'Check back later for new content' 
                : 'Try adjusting your filters or search query'}
            </p>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
              Stay Updated
            </h3>
            <p className="text-secondary-600 dark:text-secondary-300 mb-6">
              Subscribe to get notified about new blog posts and research updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for updates"
                className="flex-1 px-4 py-3 rounded-lg glass border border-secondary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary whitespace-nowrap"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;