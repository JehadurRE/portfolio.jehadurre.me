import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogApi, type BlogPost } from '../lib/supabase';

interface BlogProps {
  onNavigateToBlogPost: (slug: string) => void;
}

const Blog: React.FC<BlogProps> = ({ onNavigateToBlogPost }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogApi.getPublished();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = ['all', ...new Set(posts.flatMap(post => post.tags))];
  const filteredPosts = selectedTag === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePostClick = (slug: string,cardId: string) => {
    sessionStorage.setItem('fromBlog', 'true');
  sessionStorage.setItem('scrollToCardId', cardId);

  console.log('Navigating to blog post:', slug);
  //card
  console.log('Card ID:', cardId);
    onNavigateToBlogPost(slug);
  };

  if (error) {
    return (
      <section id="blog" className="section-padding bg-transparent">
        <div className="container-custom">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4 text-secondary-800 dark:text-secondary-200">
              Blog & Insights
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            Blog & Insights
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            Sharing thoughts on technology, software development, and research discoveries
          </p>
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
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                id={`blog-post-${index}`}
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => handlePostClick(post.slug, `blog-post-${index}`)}
              >
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
                <div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time} min read</span>
                    </div>
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
              </motion.article>
            ))}
          </div>
        )}

        {/* No posts message */}
        {!loading && filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
              {selectedTag === 'all' ? 'No blog posts available' : 'No posts found for this tag'}
            </h3>
            <p className="text-secondary-500 dark:text-secondary-500">
              {selectedTag === 'all' 
                ? 'Check back later for new content' 
                : 'Try selecting a different tag or check back later for new content'
              }
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
                className="flex-1 px-4 py-3 rounded-lg glass border border-secondary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary whitespace-nowrap"
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