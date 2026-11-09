import React, { useState, useEffect } from 'react';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BlogsPage } from './pages/BlogsPage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NowPage } from './pages/NowPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { PressKitPage } from './pages/PressKitPage';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/** Every internal route the SPA owns (used for link interception + routing). */
const INTERNAL_PATHS = ['/', '/about', '/projects', '/now', '/blogs', '/contact', '/privacy', '/terms', '/press'];

const isInternalHref = (href: string) => {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  if (href.startsWith('#')) return false;
  if (href.startsWith('/blogs/')) return true;
  const clean = href.split('?')[0].split('#')[0];
  return INTERNAL_PATHS.includes(clean) || INTERNAL_PATHS.includes(`${clean}/`);
};

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

  // Intercept every internal link so navigation stays instant (crawlers still get real hrefs)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const href = target.getAttribute('href');
      if (target.getAttribute('target') === '_blank') return;
      if (!href || !isInternalHref(href)) return;

      e.preventDefault();
      window.history.pushState({}, '', href);
      setCurrentPath(href.split('?')[0].toLowerCase());
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const isAboutRoute = currentPath === '/about';
  const isProjectsRoute = currentPath === '/projects';
  const isNowRoute = currentPath === '/now';
  const isContactRoute = currentPath === '/contact';
  const isPrivacyRoute = currentPath === '/privacy';
  const isTermsRoute = currentPath === '/terms';
  // Unlisted press/photo library. Not linked in any navigation - see PressKitPage.
  const isPressRoute = currentPath === '/press';

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-white font-sans selection:bg-[#38BDF8]/30 selection:text-white">
      {/* Route Switcher */}
      <main className="flex-1 w-full">
        {isBlogsRoute ? (
          <BlogsPage 
            onNavigateHome={() => navigateTo('/')} 
            initialPostSlug={currentPath.startsWith('/blogs/') ? decodeURIComponent(currentPath.replace('/blogs/', '')) : undefined}
          />
        ) : isAboutRoute ? (
          <AboutPage onOpenContact={() => navigateTo('/contact')} onNavigateHome={() => navigateTo('/')} />
        ) : isProjectsRoute ? (
          <ProjectsPage onNavigateBlogs={() => navigateTo('/blogs')} />
        ) : isNowRoute ? (
          <NowPage onOpenContact={() => navigateTo('/contact')} />
        ) : isContactRoute ? (
          <ContactPage />
        ) : isPrivacyRoute ? (
          <PrivacyPolicyPage
            onNavigateHome={() => navigateTo('/')}
            onNavigateBlogs={() => navigateTo('/blogs')}
          />
        ) : isTermsRoute ? (
          <TermsOfServicePage
            onNavigateHome={() => navigateTo('/')}
            onNavigateBlogs={() => navigateTo('/blogs')}
          />
        ) : isPressRoute ? (
          <PressKitPage />
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
