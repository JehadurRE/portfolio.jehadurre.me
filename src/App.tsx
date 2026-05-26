import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
// ⚡ Bolt Performance Optimization:
// Lazily load Admin and BlogPost components.
// These components are not needed on the initial render of the portfolio.
// Code splitting here significantly reduces the main bundle size,
// improving initial load time and Time to Interactive (TTI).
const Admin = React.lazy(() => import('./pages/Admin'));
const BlogPost = React.lazy(() => import('./components/BlogPost'));
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Research from './components/Research';
import Certifications from './components/Certifications';
import Blog from './components/Blog';

import Contact from './components/Contact';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'portfolio' | 'admin' | 'blog-post'>('portfolio');
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(null);

  useEffect(() => {
    // Check current route
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path.startsWith('/blog/')) {
      setCurrentPage('blog-post');
      setCurrentBlogSlug(path.replace('/blog/', ''));
    } else {
      setCurrentPage('portfolio');
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentPage('admin');
        setCurrentBlogSlug(null);
      } else if (path.startsWith('/blog/')) {
        setCurrentPage('blog-post');
        setCurrentBlogSlug(path.replace('/blog/', ''));
      } else {
        setCurrentPage('portfolio');
        setCurrentBlogSlug(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);



useEffect(() => {
  if (currentPage === 'portfolio') {
    const scrollBack = sessionStorage.getItem('fromBlog');
    const cardId = sessionStorage.getItem('scrollToCardId');

    if (scrollBack === 'true' && cardId) {
      const tryScroll = () => {
        const cardEl = document.getElementById(cardId);
        console.log(`🔍 Trying to scroll to blog card: ${cardEl}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log(`✅ Scrolled to blog card: ${cardId}`);
          sessionStorage.removeItem('fromBlog');
          sessionStorage.removeItem('scrollToCardId');
        } else {
          // Retry after a bit if not ready yet
          console.log(`⏳ Retry scroll to ${cardId}`);
          setTimeout(tryScroll, 100);
        }
      };

      setTimeout(tryScroll, 300); // give Blog.tsx time to load/render
    } else {
      window.scrollTo(0, 0);
    }
  }
}, [currentPage]);





  // Navigation functions
  const navigateToBlogPost = (slug: string) => {
    setCurrentPage('blog-post');
    setCurrentBlogSlug(slug);
    window.history.pushState({}, '', `/blog/${slug}`);
  };



  const navigateToHome = () => {
    setCurrentPage('portfolio');
    setCurrentBlogSlug(null);
    window.history.pushState({}, '', '/');
  };

  if (currentPage === 'admin') {
    return (
      <ThemeProvider>
        <React.Suspense fallback={<LoadingScreen />}><Admin /></React.Suspense>
      </ThemeProvider>
    );
  }

  if (currentPage === 'blog-post' && currentBlogSlug) {
    return (
      <ThemeProvider>
        <div className="relative min-h-screen overflow-x-hidden">
          <Header />
          <React.Suspense fallback={<LoadingScreen />}><BlogPost slug={currentBlogSlug} onNavigateHome={navigateToHome} /></React.Suspense>
          <MobileNav />
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-x-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Header />
              <main>
                <Hero />
                <About />
                <Projects />
                <Research />
                <Certifications />
                <Blog onNavigateToBlogPost={navigateToBlogPost} />
                <Contact />
              </main>
              <Footer />
              <MobileNav />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}

export default App;