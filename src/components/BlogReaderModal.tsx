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
  User,
  Sparkles
} from 'lucide-react';
import { BlogPost, UserProfile } from '../types';
import { toggleLikeBlog, hasUserLiked, deleteCommunityBlog } from '../data/blogsData';
import { setSingleBlogSeo } from '../utils/seo';
import { renderFormattedBody } from './WriteBlogModal';

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your blog post?')) {
      await deleteCommunityBlog(post.id);
      if (onPostDeleted) onPostDeleted(post.id);
      onClose();
    }
  };

  const currentFullName = currentUser ? `${currentUser.name} ${currentUser.surname}`.trim() : '';
  const canDelete = post.isCommunityPost && (
    (currentUser && post.authorUid && currentUser.id === post.authorUid) ||
    (currentUser && currentUser.email === post.authorEmail) ||
    (currentUser && currentFullName.toLowerCase() === post.author.toLowerCase()) ||
    !post.authorEmail
  );

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-white text-zinc-900 overflow-y-auto flex flex-col animate-in fade-in duration-150">
      
      {/* Sticky Full-Width Top Action Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 lg:px-12 py-3.5 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 font-serif text-xs tracking-[0.15em] uppercase text-zinc-700 hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Blogs</span>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-all cursor-pointer"
              title="Share story link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Link Copied!</span>
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isLiked 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
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
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
                title="Delete this blog post"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer ml-1"
              aria-label="Close Fullscreen View"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Content Area */}
      <main itemScope itemType="https://schema.org/NewsArticle" className="flex-1 w-full max-w-4xl mx-auto px-6 sm:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Cover Photo - Full Bleed Banner */}
        {post.imageUrl && (
          <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm relative">
            <img 
              src={post.imageUrl} 
              alt={`${post.title} - Cover Photo by ${post.author}`}
              itemProp="image"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span itemProp="articleSection" className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
              {post.category || 'General'}
            </span>
            <span>·</span>
            <span itemProp="datePublished" className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              {post.publishedDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {post.readTime}
            </span>
          </div>

          <h1 itemProp="headline" className="font-serif text-3xl sm:text-5xl font-semibold text-zinc-900 leading-tight tracking-tight">
            {post.title}
          </h1>
        </div>

        {/* Author Card Component with Custom Profile Pic & Bio */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-zinc-50 border border-zinc-200 gap-4">
          <div
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
            className={`flex items-start sm:items-center gap-4 ${onSelectAuthor ? 'cursor-pointer group/author' : ''}`}
            onClick={() => {
              if (onSelectAuthor) {
                onSelectAuthor(post.author);
              }
            }}
          >
            {post.authorAvatar ? (
              <img 
                src={post.authorAvatar} 
                alt={`${post.author} profile photo`} 
                itemProp="image"
                className="w-14 h-14 rounded-full object-cover border-2 border-zinc-300 shadow-sm group-hover/author:border-zinc-900 transition-colors shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                {post.author[0]?.toUpperCase() || 'A'}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span itemProp="name" className="text-base font-bold text-zinc-900 group-hover/author:underline">
                  {post.author}
                </span>
                <span itemProp="jobTitle" className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Author
                </span>
              </div>

              {post.authorBio ? (
                <p itemProp="description" className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl">
                  {post.authorBio}
                </p>
              ) : (
                <p className="text-xs text-zinc-500">
                  Published author on TanakaGaadzikwa.com
                </p>
              )}

              <a
                href={`/blogs?author=${encodeURIComponent(post.author)}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectAuthor) onSelectAuthor(post.author);
                }}
                className="inline-block text-[11px] font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                Read {post.author.split(' ')[0]}&apos;s full bio &amp; articles →
              </a>
            </div>
          </div>

          {onSelectAuthor && (
            <a
              href={`/blogs?author=${encodeURIComponent(post.author)}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectAuthor(post.author);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-200/80 hover:bg-zinc-300 text-zinc-800 transition-colors self-start sm:self-center shrink-0 cursor-pointer"
            >
              View Author&apos;s Bio &amp; Blogs →
            </a>
          )}
        </div>

        {/* Article Body with Full Formatting & Bold Letters */}
        <article itemProp="articleBody" className="pt-2 space-y-6 text-zinc-900 text-base sm:text-xl leading-relaxed font-sans">
          {renderFormattedBody(post.body)}
        </article>

        {/* Bottom Call to Action */}
        <div className="pt-8 border-t border-zinc-200">
          <div className="p-8 rounded-3xl bg-zinc-900 text-white text-center space-y-4 shadow-lg">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold">
              Have something to share?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
              Create an account with your photo, name, and bio to publish your blogs and get indexed on Google &amp; Google News.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenWriteBlog();
                }}
                className="px-6 py-3 bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                + Write a Blog
              </button>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
};
