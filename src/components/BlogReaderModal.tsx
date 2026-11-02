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
  User
} from 'lucide-react';
import { BlogPost, UserProfile } from '../types';
import { toggleLikeBlog, hasUserLiked, deleteCommunityBlog } from '../data/blogsData';
import { setSingleBlogSeo } from '../utils/seo';

interface BlogReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onOpenWriteBlog: () => void;
  onPostDeleted?: (id: string) => void;
  currentUser?: UserProfile | null;
  onSelectAuthor?: (authorName: string) => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({ 
  post, 
  onClose, 
  onOpenWriteBlog,
  onPostDeleted,
  currentUser,
  onSelectAuthor
}) => {
  if (!post) return null;

  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(() => hasUserLiked(post.id));
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setSingleBlogSeo(post);
  }, [post]);

  const handleLike = () => {
    const res = toggleLikeBlog(post.id);
    setLikes(res.likes);
    setIsLiked(res.hasLiked);
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
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteCommunityBlog(post.id);
      if (onPostDeleted) onPostDeleted(post.id);
      onClose();
    }
  };

  const canDelete = post.isCommunityPost && (
    !post.authorEmail || 
    (currentUser && currentUser.email === post.authorEmail)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col bg-white text-zinc-900 border-0 sm:border border-zinc-200 sm:rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-zinc-100">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blogs</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-all cursor-pointer"
              title="Share story link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied Link!</span>
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isLiked 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Like this blog"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likes}</span>
            </button>

            {/* Delete button */}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-2 text-zinc-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete this blog"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Content */}
        <div className="flex-1 overflow-y-auto pb-16">
          
          {/* Hero Cover Picture */}
          {post.imageUrl && (
            <div className="relative w-full aspect-[21/10] sm:aspect-[24/10] overflow-hidden bg-zinc-100">
              <img 
                src={post.imageUrl} 
                alt={`${post.title} - Cover Photo by ${post.author}`}
                itemProp="image"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="max-w-2xl mx-auto px-6 sm:px-8 pt-8 space-y-6">
            
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 border-b border-zinc-100 pb-4">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                {post.category}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {post.publishedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-4xl font-normal text-zinc-900 leading-tight">
              {post.title}
            </h1>

            {/* Author Profile Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div 
                className={`flex items-center gap-3 ${onSelectAuthor ? 'cursor-pointer group/author' : ''}`}
                onClick={() => {
                  if (onSelectAuthor) {
                    onSelectAuthor(post.author);
                  }
                }}
              >
                {post.authorAvatar ? (
                  <img 
                    src={post.authorAvatar} 
                    alt={post.author} 
                    className="w-11 h-11 rounded-full object-cover border border-zinc-300 shadow-sm group-hover/author:border-zinc-900 transition-colors"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                    {post.author[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover/author:text-black flex items-center gap-1.5">
                    <span>{post.author}</span>
                    {onSelectAuthor && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700 font-medium">
                        View all blogs
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Recognized Author Profile
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenWriteBlog}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:underline"
              >
                Write a Blog
              </button>
            </div>

            {/* Story Body Content */}
            <article className="pt-4 space-y-5 text-zinc-800 text-base sm:text-lg leading-relaxed font-sans">
              {post.body.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="font-serif text-xl sm:text-2xl text-zinc-900 pt-3 pb-1 font-semibold">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }

                if (trimmed.startsWith('> ')) {
                  return (
                    <blockquote 
                      key={idx} 
                      className="border-l-4 border-zinc-900 pl-4 py-1 italic text-zinc-700 bg-zinc-50 rounded-r-xl"
                    >
                      {trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, '')}
                    </blockquote>
                  );
                }

                if (trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n- ');
                  return (
                    <ul key={idx} className="space-y-1.5 pl-6 list-disc text-zinc-800 my-3">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={idx} className="leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </article>

            {/* Bottom Write CTA */}
            <div className="mt-12 p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-3">
              <h3 className="font-serif text-lg font-semibold text-zinc-900">
                Want to write your own blog?
              </h3>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                Create an account or sign in to publish with your title, picture, and thoughts.
              </p>
              <div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWriteBlog();
                  }}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Write a Blog
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
