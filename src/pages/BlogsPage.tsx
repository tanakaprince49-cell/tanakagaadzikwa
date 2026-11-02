import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Edit3, 
  ArrowLeft,
  Calendar, 
  Clock, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { BlogPost } from '../types';
import { getStoredBlogs } from '../data/blogsData';
import { WriteBlogModal } from '../components/WriteBlogModal';
import { BlogReaderModal } from '../components/BlogReaderModal';

interface BlogsPageProps {
  onNavigateHome: () => void;
  initialPostSlug?: string | null;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ onNavigateHome, initialPostSlug }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Sync on blog creation / updates
  useEffect(() => {
    const handleUpdate = () => {
      setBlogs(getStoredBlogs());
    };
    window.addEventListener('tg_blogs_updated', handleUpdate);
    return () => window.removeEventListener('tg_blogs_updated', handleUpdate);
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

  return (
    <div className="min-h-screen w-full bg-[#0B1120] text-white flex flex-col font-sans">
      
      {/* Top Normal Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#0B1120]/95 backdrop-blur-md border-b border-[#1E293B]/60 px-6 lg:px-12 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 font-serif text-xs tracking-[0.25em] uppercase text-zinc-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Tanaka Gaadzikwa</span>
          </button>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="liquid-glass-button px-4 py-2 font-serif text-xs tracking-[0.2em] uppercase text-white rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write a Blog</span>
          </button>

        </div>
      </header>

      {/* Hero Section - Clean and matching website */}
      <section className="relative w-full py-16 sm:py-24 border-b border-[#1E293B]/60 bg-gradient-to-b from-[#0B1120] to-[#0D1527] px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
            Writing &amp; Community
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
            Blogs
          </h1>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Read stories or write your own. Anyone can publish a blog with a title, cover picture, and body.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-lg"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>+ Write a Blog</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-6 lg:px-8 py-12 space-y-8 flex-1">
        
        {/* Search Bar (Only shown if there are blogs or searching) */}
        {blogs.length > 0 && (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="liquid-glass-input w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Blog Posts Grid / List */}
        {blogs.length === 0 ? (
          <div className="liquid-glass-card rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto border-[#1E293B]/80 my-8">
            <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
            <h2 className="font-serif text-xl text-white">No Blogs Published Yet</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Anyone can be the first to publish a blog here. Add your title, upload a picture, and write your story.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Write the First Blog
              </button>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="liquid-glass-card rounded-2xl p-10 text-center space-y-3 max-w-md mx-auto border-[#1E293B]/80">
            <p className="text-sm text-zinc-300">No blogs match &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-400 hover:text-sky-300 underline"
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
                className="liquid-glass-card rounded-2xl overflow-hidden border-[#1E293B]/80 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                {blog.imageUrl && (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-black/40">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    />
                  </div>
                )}

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <Calendar className="w-3 h-3 text-sky-400" />
                      <span>{blog.publishedDate}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3 text-sky-400" />
                      <span>{blog.readTime}</span>
                    </div>

                    <h3 className="font-serif text-xl text-white group-hover:text-sky-300 transition-colors leading-snug">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1E293B]/60 flex items-center justify-between text-xs text-zinc-400">
                    <span>By {blog.author}</span>
                    <span className="text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
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
