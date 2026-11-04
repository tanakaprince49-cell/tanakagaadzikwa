import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Eye,
  MousePointerClick,
  Share2,
  Heart,
  TrendingUp,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { BlogPost, UserProfile } from '../types';
import { PostStats, fetchStatsForPosts, formatCount } from '../data/statsData';

interface BlogStatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  blogs: BlogPost[];
  currentUser: UserProfile | null;
  onOpenPost?: (post: BlogPost) => void;
}

const EMPTY: PostStats = { views: 0, clicks: 0, shares: 0 };

/**
 * Author dashboard: views, clicks and shares for every story the signed-in
 * author has published (plus totals and a click-through rate).
 */
export const BlogStatsPanel: React.FC<BlogStatsPanelProps> = ({
  isOpen,
  onClose,
  blogs,
  currentUser,
  onOpenPost,
}) => {
  const [stats, setStats] = useState<Record<string, PostStats>>({});
  const [isLoading, setIsLoading] = useState(false);

  const myPosts = useMemo(() => {
    if (!currentUser) return [];
    const fullName = `${currentUser.name || ''} ${currentUser.surname || ''}`.trim().toLowerCase();
    return blogs.filter((post) => {
      if (post.authorUid && currentUser.id && post.authorUid === currentUser.id) return true;
      if (post.authorEmail && currentUser.email && post.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
      return post.author?.toLowerCase() === fullName;
    });
  }, [blogs, currentUser]);

  const loadStats = React.useCallback(async () => {
    if (!myPosts.length) {
      setStats({});
      return;
    }
    setIsLoading(true);
    const result = await fetchStatsForPosts(myPosts.map((p) => p.id));
    setStats(result);
    setIsLoading(false);
  }, [myPosts]);

  useEffect(() => {
    if (isOpen) void loadStats();
  }, [isOpen, loadStats]);

  useEffect(() => {
    const handler = () => {
      if (isOpen) void loadStats();
    };
    window.addEventListener('tg_blog_stats_updated', handler);
    return () => window.removeEventListener('tg_blog_stats_updated', handler);
  }, [isOpen, loadStats]);

  if (!isOpen) return null;

  const totals = myPosts.reduce(
    (acc, post) => {
      const s = stats[post.id] || EMPTY;
      acc.views += s.views;
      acc.clicks += s.clicks;
      acc.shares += s.shares;
      acc.likes += post.likes || 0;
      return acc;
    },
    { views: 0, clicks: 0, shares: 0, likes: 0 }
  );

  const ctr = totals.views > 0 ? Math.round((totals.clicks / totals.views) * 1000) / 10 : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6">
      <div
        className="w-full sm:max-w-3xl max-h-[92vh] bg-white text-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-200 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-semibold leading-tight">Story Performance</h2>
              <p className="text-[11px] text-zinc-500">
                Views, clicks and shares across {myPosts.length} {myPosts.length === 1 ? 'story' : 'stories'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => void loadStats()}
              className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
              title="Refresh stats"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
              aria-label="Close stats"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="px-5 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-zinc-100 bg-zinc-50/60 shrink-0">
          {[
            { label: 'Views', value: totals.views, icon: Eye, tone: 'text-sky-600' },
            { label: 'Clicks', value: totals.clicks, icon: MousePointerClick, tone: 'text-emerald-600' },
            { label: 'Shares', value: totals.shares, icon: Share2, tone: 'text-violet-600' },
            { label: 'Likes', value: totals.likes, icon: Heart, tone: 'text-red-500' },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="bg-white border border-zinc-200 rounded-2xl px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <Icon className={`w-3 h-3 ${tone}`} />
                <span>{label}</span>
              </div>
              <div className="text-xl font-bold text-zinc-900 leading-tight">{formatCount(value)}</div>
            </div>
          ))}
        </div>

        {totals.views > 0 && (
          <div className="px-5 sm:px-6 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              Click-through rate: <strong>{ctr}%</strong> of readers click a link inside your stories
            </span>
          </div>
        )}

        {/* Per-story list */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {myPosts.length === 0 && (
            <div className="p-10 text-center text-sm text-zinc-500">
              Publish a story to start collecting views and clicks.
            </div>
          )}

          {[...myPosts]
            .sort((a, b) => (stats[b.id]?.views || 0) - (stats[a.id]?.views || 0))
            .map((post) => {
              const s = stats[post.id] || EMPTY;
              const postCtr = s.views > 0 ? Math.round((s.clicks / s.views) * 1000) / 10 : 0;
              return (
                <div key={post.id} className="flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-zinc-50 transition-colors">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="w-14 h-9 rounded-lg object-cover border border-zinc-200 shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onOpenPost?.(post)}
                      className="text-left text-xs sm:text-sm font-semibold text-zinc-900 hover:underline line-clamp-1 cursor-pointer"
                    >
                      {post.title}
                    </button>
                    <div className="text-[10px] sm:text-[11px] text-zinc-500 font-mono truncate">
                      {post.category} · {post.publishedDate} · {post.readTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-sky-700" title="Views">
                      <Eye className="w-3.5 h-3.5" />
                      {formatCount(s.views)}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700" title="Clicks">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      {formatCount(s.clicks)}
                    </span>
                    <span className="hidden sm:flex items-center gap-1 text-violet-700" title="Shares">
                      <Share2 className="w-3.5 h-3.5" />
                      {formatCount(s.shares)}
                    </span>
                    <span className="hidden sm:inline text-zinc-400 w-10 text-right">{postCtr}%</span>
                    <a
                      href={`/blogs/${post.slug || post.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenPost?.(post);
                      }}
                      className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                      title="Open story"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="px-5 sm:px-6 py-3 border-t border-zinc-200 bg-white text-[10px] text-zinc-500 shrink-0">
          Views are counted once per reader session. Clicks count link clicks inside your stories, shares count
          share/link-copy actions. Numbers sync to your account when you're online.
        </div>
      </div>
    </div>
  );
};

export default BlogStatsPanel;
