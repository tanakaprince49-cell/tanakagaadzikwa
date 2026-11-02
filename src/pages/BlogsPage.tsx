import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Edit3, 
  Heart, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Filter, 
  BookOpen,
  Share2,
  TrendingUp,
  Layers,
  Users
} from 'lucide-react';
import { BlogPost } from '../types';
import { getStoredBlogs, toggleLikeBlog } from '../data/blogsData';
import { WriteBlogModal } from '../components/WriteBlogModal';
import { BlogReaderModal } from '../components/BlogReaderModal';

interface BlogsPageProps {
  onNavigateHome: () => void;
  initialPostSlug?: string | null;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ onNavigateHome, initialPostSlug }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Sync blogs on custom storage events
  useEffect(() => {
    const handleUpdate = () => {
      setBlogs(getStoredBlogs());
    };
    window.addEventListener('tg_blogs_updated', handleUpdate);
    return () => window.removeEventListener('tg_blogs_updated', handleUpdate);
  }, []);

  // Handle initial post slug if passed or via hash
  useEffect(() => {
    const checkSlug = initialPostSlug || (window.location.hash ? window.location.hash.replace('#', '') : null);
    if (checkSlug) {
      const match = blogs.find((b) => b.slug === checkSlug || b.id === checkSlug);
      if (match) {
        setSelectedPost(match);
      }
    }
  }, [initialPostSlug, blogs]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => set.add(b.category));
    return ['All', ...Array.from(set)];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.author.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  // Featured post
  const featuredPost = useMemo(() => {
    return blogs.find((b) => b.isFeatured) || blogs[0];
  }, [blogs]);

  const handleLikeCard = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const res = toggleLikeBlog(postId);
    setBlogs((prev) => 
      prev.map((b) => (b.id === postId ? { ...b, likes: res.likes } : b))
    );
  };

  const handlePostCreated = (newPost: BlogPost) => {
    setBlogs(getStoredBlogs());
    setSelectedPost(newPost);
  };

  const communityCount = useMemo(() => {
    return blogs.filter((b) => b.isCommunityPost).length;
  }, [blogs]);

  return (
    <div className="min-h-screen w-full bg-[#0B1120] text-white flex flex-col">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#0B1120]/90 backdrop-blur-md border-b border-[#1E293B] px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Back to Home + Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-xs font-serif tracking-[0.2em] uppercase text-zinc-300 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Portfolio</span>
            </button>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-serif text-sm tracking-[0.2em] uppercase text-white font-medium">
                TANAKA GAADZIKWA
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Blogs &amp; Stories
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write a Blog</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-12 px-6 lg:px-12 border-b border-[#1E293B]/70 overflow-hidden bg-gradient-to-b from-[#0D1527] to-[#0B1120]">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-sky-500/10 blur-[130px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Publishing Platform</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-[0.02em] leading-tight max-w-4xl mx-auto">
            The Open Builder&apos;s Log &amp; Community
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Unfiltered notes, engineering breakdowns, and startup stories by Tanaka Gaadzikwa and fellow ambitious creators worldwide. Anyone can write, share a picture, and publish.
          </p>

          {/* Quick Stats Banner */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span><strong className="text-white">{blogs.length}</strong> Stories Published</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white">{communityCount}</strong> Community Contributions</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span><strong className="text-white">100%</strong> Open &amp; Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-12 space-y-12 flex-1">
        
        {/* Controls: Search and Category Pills */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories by title, topic, or author..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#111A2E] border border-[#1E293B] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/70 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Write a Blog CTA (Secondary) */}
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#131D33] hover:bg-[#1A2744] border border-sky-500/30 text-sky-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Have an idea? Write your blog</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-sky-500 text-black font-semibold shadow-sm shadow-sky-500/20' 
                      : 'bg-[#111A2E] text-zinc-400 hover:text-white border border-[#1E293B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Story Banner (Shown when no search/filters active) */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <div 
            onClick={() => setSelectedPost(featuredPost)}
            className="group relative rounded-3xl overflow-hidden border border-[#1E293B] bg-[#0E1526] hover:border-sky-500/50 transition-all duration-300 shadow-2xl cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image side */}
              <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto overflow-hidden">
                <img 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold bg-sky-400 text-black shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Featured Story
                </span>
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                    <span>{featuredPost.category}</span>
                    <span>·</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight group-hover:text-sky-200 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {featuredPost.authorAvatar ? (
                      <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold text-black">
                        {featuredPost.author[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white">{featuredPost.author}</div>
                      <div className="text-[10px] text-zinc-400">{featuredPost.publishedDate}</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-white">
              {searchQuery ? `Search Results (${filteredBlogs.length})` : selectedCategory === 'All' ? 'All Stories & Articles' : `${selectedCategory} (${filteredBlogs.length})`}
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Showing {filteredBlogs.length} of {blogs.length}
            </span>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#1E293B] bg-[#0E1526]/50 p-12 text-center space-y-4">
              <BookOpen className="w-10 h-10 text-zinc-500 mx-auto" />
              <h4 className="font-serif text-xl text-white">No stories found</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No articles match &ldquo;{searchQuery}&rdquo;. Be the first one to write a blog post on this topic!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsWriteModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 text-black text-xs font-semibold uppercase tracking-wider"
              >
                Write a Story Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  onClick={() => setSelectedPost(blog)}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-[#1E293B] bg-[#0E1526] hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  {/* Card Cover Picture */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1526] via-transparent to-transparent opacity-80" />
                    
                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-sky-300 border border-white/10">
                      {blog.category}
                    </span>

                    {blog.isCommunityPost && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 backdrop-blur-md text-emerald-200 border border-emerald-400/40">
                        Community
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                        <Calendar className="w-3 h-3 text-sky-400" />
                        <span>{blog.publishedDate}</span>
                        <span>·</span>
                        <Clock className="w-3 h-3 text-sky-400" />
                        <span>{blog.readTime}</span>
                      </div>

                      <h4 className="font-serif text-lg font-normal text-white group-hover:text-sky-200 transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h4>

                      <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Author & Claps footer */}
                    <div className="pt-4 border-t border-[#1E293B]/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {blog.authorAvatar ? (
                          <img 
                            src={blog.authorAvatar} 
                            alt={blog.author} 
                            className="w-7 h-7 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                            {blog.author[0].toUpperCase()}
                          </div>
                        )}
                        <div className="text-xs">
                          <span className="font-medium text-white block line-clamp-1">
                            {blog.author}
                          </span>
                        </div>
                      </div>

                      {/* Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleLikeCard(e, blog.id)}
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors p-1"
                        title="Like this blog post"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-400/20 text-red-400" />
                        <span className="text-[11px] font-mono">{blog.likes}</span>
                      </button>
                    </div>

                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Callout Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-sky-950/40 via-[#0E1526] to-indigo-950/30 border border-sky-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl text-white">
              Got something to share with the builder community?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Write your story, upload your picture, and publish it on TanakaGaadzikwa.com in under two minutes. No login required.
            </p>
          </div>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 shrink-0 cursor-pointer"
          >
            Write a Blog Now →
          </button>
        </div>

      </main>

      {/* Creator Modal */}
      <WriteBlogModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onPublished={handlePostCreated}
      />

      {/* Reader Modal */}
      <BlogReaderModal
        post={selectedPost}
        onClose={() => {
          setSelectedPost(null);
          // Clean hash
          if (window.location.hash) {
            history.pushState(null, '', window.location.pathname);
          }
        }}
        onOpenWriteBlog={() => setIsWriteModalOpen(true)}
        onPostDeleted={() => setBlogs(getStoredBlogs())}
      />

    </div>
  );
};
