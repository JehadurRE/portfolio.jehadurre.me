import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, FileText, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404: Page Not Found | Md. Jehadur Rahman Emran</title>
        <meta name="description" content="The page you are looking for does not exist or has been moved." />
      </Helmet>

      <section className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-secondary-300/20 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>

        <div className="container-custom max-w-3xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 404 Header */}
            <h1 className="text-8xl sm:text-9xl font-black mb-4 tracking-tight">
              <span className="text-gradient drop-shadow-sm">404</span>
            </h1>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-secondary-800 dark:text-secondary-200">
              Page Not Found
            </h2>

            <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-10 max-w-xl mx-auto leading-relaxed">
              It seems you've ventured into uncharted territory. The page you're looking for might have been moved, deleted, or perhaps it never existed at all.
            </p>

            {/* Navigation Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="btn-primary inline-flex items-center space-x-2 w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
                >
                  <Home className="w-5 h-5" />
                  <span>Return to Home</span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/#blog"
                  className="btn-secondary inline-flex items-center space-x-2 w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-secondary-800"
                >
                  <FileText className="w-5 h-5" />
                  <span>Read the Blog</span>
                </Link>
              </motion.div>
            </div>

            {/* Quick Back Button Option */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8, duration: 0.6 }}
               className="mt-12"
            >
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center space-x-2 text-sm text-secondary-500 hover:text-primary-500 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go back to previous page</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
