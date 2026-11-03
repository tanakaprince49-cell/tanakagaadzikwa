import React, { useState, useEffect } from 'react';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BlogsPage } from './pages/BlogsPage';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname.toLowerCase();
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.toLowerCase());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Intercept internal links like /blogs and /
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && (href === '/' || href === '/blogs' || href.startsWith('/blogs/'))) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        setCurrentPath(href.toLowerCase());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.toLowerCase());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isBlogsRoute = currentPath === '/blogs' || currentPath === '/blog' || currentPath.startsWith('/blogs/');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-white font-sans selection:bg-[#38BDF8]/30 selection:text-white">
      {/* Route Switcher */}
      <main className="flex-1 w-full">
        {isBlogsRoute ? (
          <BlogsPage onNavigateHome={() => navigateTo('/')} />
        ) : (
          <HomePage onNavigateToBlogs={() => navigateTo('/blogs')} />
        )}
      </main>

      {/* Minimalist Luxury Footer - hidden on blogs page */}
      {!isBlogsRoute && <Footer />}

      {/* Vercel Tracking & Insights */}
      {isMounted && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </div>
  );
}
