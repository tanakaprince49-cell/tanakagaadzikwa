import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  Clock, 
  Calendar, 
  Check, 
  ArrowLeft, 
  Trash2, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { BlogPost } from '../types';
import { toggleLikeBlog, hasUserLiked, deleteCommunityBlog } from '../data/blogsData';

interface BlogReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onOpenWriteBlog: () => void;
  onPostDeleted?: (id: string) => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({ 
  post, 
  onClose, 
  onOpenWriteBlog,
  onPostDeleted 
}) => {
  if (!post) return null;

  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(() => hasUserLiked(post.id));
  const [copied, setCopied] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const handleLike = () => {
    const res = toggleLikeBlog(post.id);
    setLikes(res.likes);
    setIsLiked(res.hasLiked);
    if (res.hasLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.origin + '/blogs#' + post.slug;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this community blog post?')) {
      deleteCommunityBlog(post.id);
      if (onPostDeleted) onPostDeleted(post.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col bg-[#0B1120] border-0 sm:border border-[#1E293B] sm:rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0B1120]/90 backdrop-blur-md border-b border-[#1E293B]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Blogs</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Share story link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Like button */}
            <button
              onClick={handleLike}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isLiked 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Like this story"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400 text-red-400' : ''}`} />
              <span>{likes}</span>
              {showHeartBurst && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-400 font-bold animate-ping text-sm pointer-events-none">
                  +1
                </span>
              )}
            </button>

            {/* Delete button (only for community posts) */}
            {post.isCommunityPost && (
              <button
                onClick={handleDelete}
                className="p-2 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Delete this community post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Story Content */}
        <div className="flex-1 overflow-y-auto pb-16">
          
          {/* Hero Cover Picture */}
          <div className="relative w-full aspect-[21/10] sm:aspect-[24/9] overflow-hidden bg-black">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover filter brightness-[0.95]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/30 to-black/30 pointer-events-none" />
            
            {/* Category tag overlaid on bottom left of hero */}
            <div className="absolute bottom-6 left-6 sm:left-10 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-500/30 text-sky-200 border border-sky-400/40 backdrop-blur-md">
                {post.category}
              </span>
              {post.isCommunityPost && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  Community Post
                </span>
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-6 space-y-8">
            
            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 border-b border-[#1E293B] pb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {post.publishedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                {post.readTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-zinc-300">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                {likes} reader likes
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight tracking-[0.02em]">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-base sm:text-lg text-sky-200/90 font-serif italic border-l-2 border-sky-400 pl-4 py-1 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author Profile Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B]">
              <div className="flex items-center gap-3">
                {post.authorAvatar ? (
                  <img 
                    src={post.authorAvatar} 
                    alt={post.author} 
                    className="w-12 h-12 rounded-full object-cover border border-sky-400/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {post.author[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-white">
                    {post.author}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {post.authorRole || 'Community Contributor'}
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenWriteBlog}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Write Your Story</span>
              </button>
            </div>

            {/* Story Body Content */}
            <article className="pt-4 space-y-6 text-zinc-200 text-base sm:text-lg leading-relaxed font-sans">
              {post.body.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Subheadings
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="font-serif text-2xl text-white pt-4 pb-1 font-normal tracking-wide">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }

                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="font-serif text-2xl sm:text-3xl text-white pt-6 pb-2 font-normal">
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }

                // Blockquotes
                if (trimmed.startsWith('> ')) {
                  return (
                    <blockquote 
                      key={idx} 
                      className="border-l-4 border-sky-400 pl-5 py-2 my-4 italic text-sky-100 bg-sky-950/20 rounded-r-xl font-serif"
                    >
                      {trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, '')}
                    </blockquote>
                  );
                }

                // Bullet Lists
                if (trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n- ');
                  return (
                    <ul key={idx} className="space-y-2 pl-6 list-disc text-zinc-300 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item.replace(/^- /, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Standard Paragraph
                return (
                  <p key={idx} className="text-zinc-300 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </article>

            {/* Tags footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-[#1E293B] flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">Tags:</span>
                {post.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#111A2E] text-zinc-400 text-xs font-mono border border-[#1E293B]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Engagement Banner */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#111A2E] to-[#0A101D] border border-sky-500/20 space-y-4 text-center">
              <Sparkles className="w-8 h-8 text-sky-400 mx-auto" />
              <h3 className="font-serif text-2xl text-white font-normal">
                Have a perspective to share with Tanaka and fellow builders?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Publishing is open to all builders, developers, and founders. You can write your own story, attach your project cover image, and inspire creators worldwide.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenWriteBlog();
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Write &amp; Publish Your Story →
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
