import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Edit3, 
  ArrowLeft,
  Calendar, 
  Clock, 
  ArrowRight,
  BookOpen,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { BlogPost, UserProfile } from '../types';
import { getStoredBlogs } from '../data/blogsData';
import { getCurrentUser, signOut } from '../data/authData';
import { WriteBlogModal } from '../components/WriteBlogModal';
import { BlogReaderModal } from '../components/BlogReaderModal';
import { AuthModal } from '../components/AuthModal';

interface BlogsPageProps {
  onNavigateHome: () => void;
  initialPostSlug?: string | null;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ onNavigateHome, initialPostSlug }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  
  // Modals
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Sync on blog creation / updates
  useEffect(() => {
    const handleUpdate = () => {
      setBlogs(getStoredBlogs());
    };
    window.addEventListener('tg_blogs_updated', handleUpdate);
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

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return blogs;
    return blogs.filter((blog) => 
      blog.title.toLowerCase().includes(q) ||
      blog.body.toLowerCase().includes(q) ||
      blog.author.toLowerCase().includes(q)
    );
  }, [blogs, searchQuery]);

  const handlePostCreated = (newPost: BlogPost) => {
    setBlogs(getStoredBlogs());
    setSelectedPost(newPost);
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
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 lg:px-12 py-3.5 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 font-serif text-xs tracking-[0.2em] uppercase text-zinc-600 hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Tanaka Gaadzikwa</span>
          </button>

          <div className="flex items-center gap-3">
            {/* User Account State */}
            {currentUser ? (
              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 pl-1.5 pr-3 py-1 rounded-full">
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-zinc-300"
                />
                <span className="text-xs font-semibold text-zinc-800 hidden sm:inline">
                  {currentUser.name} {currentUser.surname}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-zinc-400 hover:text-zinc-700 p-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-black transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer hidden sm:block"
                >
                  Create Account
                </button>
              </div>
            )}

            <button
              onClick={handleOpenWrite}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-serif text-xs tracking-[0.15em] uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write a Blog</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section - Clean Crisp White */}
      <section className="relative w-full py-16 sm:py-20 border-b border-zinc-200 bg-zinc-50/60 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-3">
          <span className="font-serif text-xs tracking-[0.3em] uppercase text-zinc-500 font-semibold">
            Writing &amp; Community
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 tracking-tight">
            Blogs
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto leading-relaxed">
            Create an account to write your own blog with a title, picture, and thoughts.
          </p>

          <div className="pt-3">
            <button
              onClick={handleOpenWrite}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>+ Write a Blog</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-6 lg:px-8 py-12 space-y-8 flex-1">
        
        {/* Search Bar */}
        {blogs.length > 0 && (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>
        )}

        {/* Blog Posts Grid / Empty state */}
        {blogs.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm my-8">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-zinc-900">
              No Blogs Published Yet
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Create an account with your email, name, surname, and preferred profile picture to be the first to publish a blog here.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenWrite}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Write the First Blog
              </button>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center space-y-3 max-w-md mx-auto shadow-sm">
            <p className="text-sm text-zinc-700">No blogs match &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-zinc-900 font-semibold underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setSelectedPost(blog)}
                className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md"
              >
                {blog.imageUrl && (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>{blog.publishedDate}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span>{blog.readTime}</span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-zinc-900 group-hover:text-black transition-colors leading-snug">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      {blog.authorAvatar ? (
                        <img 
                          src={blog.authorAvatar} 
                          alt={blog.author} 
                          className="w-6 h-6 rounded-full object-cover border border-zinc-200"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold">
                          {blog.author[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="font-medium text-zinc-800">{blog.author}</span>
                    </div>

                    <span className="text-zinc-900 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsWriteModalOpen(true);
        }}
        initialMode={authMode}
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
            history.pushState(null, '', window.location.pathname);
          }
        }}
        onOpenWriteBlog={handleOpenWrite}
        onPostDeleted={() => setBlogs(getStoredBlogs())}
        currentUser={currentUser}
      />

    </div>
  );
};
