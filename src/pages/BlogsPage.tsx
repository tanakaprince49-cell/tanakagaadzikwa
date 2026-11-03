import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Edit3, 
  ArrowLeft,
  Calendar, 
  Clock, 
  ArrowRight,
  BookOpen,
  LogOut,
  X,
  Sparkles,
  Tag,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { BlogPost, UserProfile } from '../types';
import { getStoredBlogs, fetchServerBlogs, deleteCommunityBlog } from '../data/blogsData';
import { getCurrentUser, signOut } from '../data/authData';
import { WriteBlogModal } from '../components/WriteBlogModal';
import { BlogReaderModal } from '../components/BlogReaderModal';
import { AuthModal } from '../components/AuthModal';
import { setBlogsHubSeo, setSingleBlogSeo, setAuthorPageSeo, resetHomeSeo } from '../utils/seo';

interface BlogsPageProps {
  onNavigateHome: () => void;
  initialPostSlug?: string | null;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ onNavigateHome, initialPostSlug }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  
  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('author');
    } catch {
      return null;
    }
  });

  // Modals
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'profile'>('signin');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Sync on blog creation / updates
  useEffect(() => {
    const handleUpdate = () => {
      setBlogs(getStoredBlogs());
    };
    window.addEventListener('tg_blogs_updated', handleUpdate);
    fetchServerBlogs().then((data) => setBlogs(data));
    return () => window.removeEventListener('tg_blogs_updated', handleUpdate);
  }, []);

  // Sync auth state
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('tg_auth_changed', handleAuthChange);
    return () => window.removeEventListener('tg_auth_changed', handleAuthChange);
  }, []);

  // Sync popstate for browser back/forward buttons with author & hash
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedAuthor(params.get('author'));
      
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const match = blogs.find((b) => b.slug === hash || b.id === hash);
        if (match) setSelectedPost(match);
      } else {
        setSelectedPost(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [blogs]);

  // Handle direct slug / hash link
  useEffect(() => {
    const checkSlug = initialPostSlug || (window.location.hash ? window.location.hash.replace('#', '') : null);
    if (checkSlug) {
      const match = blogs.find((b) => b.slug === checkSlug || b.id === checkSlug);
      if (match) {
        setSelectedPost(match);
      }
    }
  }, [initialPostSlug, blogs]);

  // Dynamic Categories gathered from all published blogs
  const dynamicCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach((b) => {
      const cat = b.category ? b.category.trim() : 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.keys(counts).map((cat) => ({
      name: cat,
      count: counts[cat],
    }));
  }, [blogs]);

  // Details for currently selected author (if any)
  const authorProfile = useMemo(() => {
    if (!selectedAuthor) return null;
    const authorBlogs = blogs.filter(
      (b) => b.author.toLowerCase() === selectedAuthor.toLowerCase()
    );
    const firstWithAvatar = authorBlogs.find((b) => b.authorAvatar)?.authorAvatar;
    const firstWithBio = authorBlogs.find((b) => b.authorBio)?.authorBio;

    const isCurrent = currentUser && `${currentUser.name} ${currentUser.surname}`.toLowerCase() === selectedAuthor.toLowerCase();

    return {
      name: selectedAuthor,
      avatarUrl: firstWithAvatar || (isCurrent ? currentUser.avatarUrl : undefined),
      bio: firstWithBio || (isCurrent ? currentUser.bio : undefined),
      count: authorBlogs.length,
    };
  }, [selectedAuthor, blogs, currentUser]);

  // Google News, Discover & Search SEO Synchronization
  useEffect(() => {
    if (selectedPost) {
      setSingleBlogSeo(selectedPost);
    } else if (selectedAuthor && authorProfile) {
      setAuthorPageSeo(authorProfile.name, authorProfile.avatarUrl, authorProfile.count);
    } else {
      setBlogsHubSeo(blogs.length);
    }
    return () => {
      resetHomeSeo();
    };
  }, [selectedPost, selectedAuthor, authorProfile, blogs.length]);

  // Combined Filtered Blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      if (selectedAuthor && blog.author.toLowerCase() !== selectedAuthor.toLowerCase()) {
        return false;
      }
      if (selectedCategory !== 'All' && (blog.category || 'General').toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = blog.title.toLowerCase().includes(q);
        const matchBody = blog.body.toLowerCase().includes(q);
        const matchAuthor = blog.author.toLowerCase().includes(q);
        const matchCategory = (blog.category || '').toLowerCase().includes(q);
        return matchTitle || matchBody || matchAuthor || matchCategory;
      }
      return true;
    });
  }, [blogs, selectedAuthor, selectedCategory, searchQuery]);

  const handleSelectAuthor = (authorName: string | null) => {
    setSelectedAuthor(authorName);
    try {
      const url = new URL(window.location.href);
      if (authorName) {
        url.searchParams.set('author', authorName);
      } else {
        url.searchParams.delete('author');
      }
      window.history.pushState({}, '', url.pathname + url.search + url.hash);
    } catch {
      // Ignore
    }
  };

  const handlePostCreated = (newPost: BlogPost) => {
    setBlogs(getStoredBlogs());
    setSelectedPost(newPost);
  };

  const handleDeleteBlog = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete your blog post?')) {
      await deleteCommunityBlog(id);
      setBlogs(getStoredBlogs());
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
    }
  };

  const handleOpenWrite = () => {
    if (!currentUser) {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    } else {
      setIsWriteModalOpen(true);
    }
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 flex flex-col font-sans selection:bg-zinc-200">
      
      {/* Top White Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 px-3 sm:px-6 lg:px-12 py-2.5 sm:py-3.5 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 sm:gap-2 font-serif text-[11px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-zinc-600 hover:text-black transition-colors cursor-pointer group shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline whitespace-nowrap">Tanaka Gaadzikwa</span>
            <span className="sm:hidden font-semibold whitespace-nowrap">Tanaka G.</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* User Account State */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('profile');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 pl-1 sm:pl-1.5 pr-2 sm:pr-3 py-1 rounded-full cursor-pointer transition-colors shadow-2xs group shrink-0"
                  title="Click to edit your author profile"
                >
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-zinc-300 shrink-0"
                  />
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-800 max-w-[70px] sm:max-w-none truncate whitespace-nowrap">
                    {currentUser.name}
                  </span>
                  <span className="hidden md:inline text-[10px] text-zinc-400 group-hover:text-zinc-700 border-l border-zinc-200 pl-1.5 font-medium whitespace-nowrap">
                    Edit
                  </span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer transition-colors shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Sign In with Google</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            <button
              onClick={handleOpenWrite}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 hover:bg-black text-white text-[11px] sm:text-xs font-serif sm:tracking-[0.15em] uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all whitespace-nowrap shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Write a Blog</span>
              <span className="sm:hidden font-sans font-semibold">Write</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section - Clean Responsive White */}
      <section className="relative w-full py-8 sm:py-14 border-b border-zinc-200 bg-zinc-50/70 px-4 sm:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-2.5">
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 tracking-tight">
            Blogs &amp; Stories
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-zinc-600 max-w-lg mx-auto leading-relaxed px-2">
            Publish stories, custom categories, and personal perspectives. Articles and author profiles are structured for rapid indexing on Google and Google News.
          </p>

          <div className="pt-1.5">
            <button
              onClick={handleOpenWrite}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write a Story</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 flex-1">
        
        {/* Active Author Profile Banner */}
        {authorProfile && (
          <div className="bg-gradient-to-r from-zinc-50 via-white to-zinc-50 border-2 border-zinc-900/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                {authorProfile.avatarUrl ? (
                  <img 
                    src={authorProfile.avatarUrl} 
                    alt={authorProfile.name} 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-zinc-900 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm shrink-0">
                    {authorProfile.name[0]?.toUpperCase() || 'A'}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-2xl font-serif font-bold text-zinc-900">
                      {authorProfile.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Author</span>
                    </span>
                  </div>
                  {authorProfile.bio && (
                    <p className="text-xs text-zinc-700 leading-relaxed max-w-lg">
                      {authorProfile.bio}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {authorProfile.count} {authorProfile.count === 1 ? 'published blog' : 'published blogs'} on TanakaGaadzikwa.com
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSelectAuthor(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors self-start sm:self-center cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Show All Authors</span>
              </button>
            </div>

            <div className="pt-2 border-t border-zinc-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google &amp; Google News Indexed: Author Profile &amp; Schema.org Person</span>
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-full">
                URL: https://www.tanakagaadzikwa.com/blogs?author={encodeURIComponent(authorProfile.name)}
              </span>
            </div>
          </div>
        )}

        {/* Search & Dynamic Category Filter Row */}
        {blogs.length > 0 && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, body, author, or category..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Reset Filters Shortcut */}
              {(selectedCategory !== 'All' || selectedAuthor || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    handleSelectAuthor(null);
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-zinc-600 hover:text-black flex items-center gap-1 underline self-end sm:self-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            {/* Dynamic Category Filter Pills */}
            {dynamicCategories.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Categories ({dynamicCategories.length})</span>
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar -mx-1 px-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      selectedCategory === 'All'
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    All ({blogs.length})
                  </button>

                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                        selectedCategory === cat.name
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat.name ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-600'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Blog Posts Grid / Empty state */}
        {blogs.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm my-4 sm:my-8">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-zinc-900">
              No Blogs Published Yet
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
              Sign in with Google to share insights, stories, or perspectives and get your own verified author profile indexed on Google &amp; Google News.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenWrite}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                Write the First Blog
              </button>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center space-y-3 max-w-md mx-auto shadow-sm">
            <p className="text-sm text-zinc-700">No blogs match the current filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                handleSelectAuthor(null);
                setSearchQuery('');
              }}
              className="text-xs text-zinc-900 font-semibold underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog) => {
              const currentFullName = currentUser ? `${currentUser.name} ${currentUser.surname}`.trim() : '';
              const isOwner = blog.isCommunityPost && (
                (currentUser && blog.authorUid && currentUser.id === blog.authorUid) ||
                (currentUser && currentUser.email === blog.authorEmail) ||
                (currentUser && currentFullName.toLowerCase() === blog.author.toLowerCase()) ||
                !blog.authorEmail
              );

              return (
                <article
                  key={blog.id}
                  itemScope
                  itemType="https://schema.org/NewsArticle"
                  onClick={() => setSelectedPost(blog)}
                  className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md relative"
                >
                  {blog.imageUrl && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-100 relative">
                      <img 
                        src={blog.imageUrl} 
                        alt={`${blog.title} - Cover photo by ${blog.author}`}
                        itemProp="image"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Category & Time row */}
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          itemProp="articleSection"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(blog.category || 'General');
                          }}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors cursor-pointer"
                          title={`Filter by category ${blog.category}`}
                        >
                          {blog.category || 'General'}
                        </button>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <div className="flex items-center gap-1.5" itemProp="datePublished">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          <span>{blog.publishedDate}</span>
                        </div>

                        {/* Owner Delete button on card */}
                        {isOwner && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteBlog(e, blog.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer flex items-center gap-1 font-sans text-[11px]"
                            title="Delete your blog post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>

                      <h3 itemProp="headline" className="font-serif text-xl font-medium text-zinc-900 group-hover:text-black transition-colors leading-snug">
                        {blog.title}
                      </h3>

                      <p itemProp="description" className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Author Card Footer */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAuthor(blog.author);
                        }}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group/author"
                        title={`Click to view ${blog.author}'s profile & articles`}
                      >
                        {blog.authorAvatar ? (
                          <img 
                            src={blog.authorAvatar} 
                            alt={blog.author} 
                            className="w-7 h-7 rounded-full object-cover border border-zinc-200 group-hover/author:border-zinc-900"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold">
                            {blog.author[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-900 group-hover/author:underline">
                            {blog.author}
                          </span>
                          <span className="text-[10px] text-zinc-400">Author Profile</span>
                        </div>
                      </div>

                      <span className="text-zinc-900 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          if (authMode !== 'profile') {
            setIsWriteModalOpen(true);
          }
        }}
        initialMode={authMode}
        existingUser={currentUser}
      />

      {/* Creator Modal */}
      <WriteBlogModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onPublished={handlePostCreated}
        currentUser={currentUser}
        onRequireAuth={() => {
          setIsWriteModalOpen(false);
          setAuthMode('signup');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Reader Modal */}
      <BlogReaderModal
        post={selectedPost}
        onClose={() => {
          setSelectedPost(null);
          if (window.location.hash) {
            try {
              history.pushState(null, '', window.location.pathname + window.location.search);
            } catch {
              // Ignore
            }
          }
        }}
        onOpenWriteBlog={handleOpenWrite}
        onPostDeleted={() => setBlogs(getStoredBlogs())}
        currentUser={currentUser}
        onSelectAuthor={(authorName) => {
          setSelectedPost(null);
          handleSelectAuthor(authorName);
        }}
      />

    </div>
  );
};
