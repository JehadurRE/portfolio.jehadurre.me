import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
// ⚡ Bolt Performance Optimization:
// Lazily load Admin and BlogPost components.
// These components are not needed on the initial render of the portfolio.
// Code splitting here significantly reduces the main bundle size,
// improving initial load time and Time to Interactive (TTI).
const Admin = React.lazy(() => import('./pages/Admin'));
const BlogPost = React.lazy(() => import('./components/BlogPost'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import BackToTop from './components/BackToTop';

import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
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
      } else if (!location.hash) {
        window.scrollTo(0, 0);
      }
    } else {
       if (!location.hash) {
           window.scrollTo(0, 0);
       }
    }
  }, [location.pathname, location.hash]);

  // For Admin Route without standard layout
  if (location.pathname.startsWith('/admin')) {
    return (
      <ThemeProvider>
        <React.Suspense fallback={<LoadingScreen />}><Admin /></React.Suspense>
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
              <Toaster theme="dark" richColors position="top-right" />
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog/:slug" element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <BlogPost />
                  </React.Suspense>
                } />
                <Route path="/project/:id" element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <ProjectDetail />
                  </React.Suspense>
                } />
                <Route path="*" element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <NotFound />
                  </React.Suspense>
                } />
              </Routes>
              <Footer />
              <MobileNav />
              <BackToTop />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}

export default App;
