import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container-custom section-padding pt-32">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-6">
            Page Not Found
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-8 leading-relaxed">
            Oops! The page you are looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <a
            href="/#blog"
            className="btn-secondary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg w-full sm:w-auto justify-center"
          >
            <span>Read Blog</span>
          </a>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
