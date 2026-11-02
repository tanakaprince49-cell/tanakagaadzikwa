import { BlogPost } from '../types';

export const PRESET_COVER_IMAGES = [
  {
    label: 'Code & Screen',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Artificial Intelligence',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Workspace & Desk',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Harare & Innovation',
    url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [];

const LOCAL_STORAGE_KEY = 'tg_user_written_blogs_v2';
const LIKES_STORAGE_KEY = 'tg_blog_liked_ids_v2';

export function calculateReadTime(text: string): string {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Fetch from API and sync to local storage
let isFetchingServerBlogs = false;

export async function fetchServerBlogs(): Promise<BlogPost[]> {
  if (isFetchingServerBlogs) return getStoredBlogs();
  isFetchingServerBlogs = true;
  try {
    const res = await fetch('/api/blogs');
    if (res.ok) {
      const serverBlogs: BlogPost[] = await res.json();
      if (Array.isArray(serverBlogs)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverBlogs));
        window.dispatchEvent(new CustomEvent('tg_blogs_updated'));
        isFetchingServerBlogs = false;
        return serverBlogs;
      }
    }
  } catch (err) {
    console.warn('Server fetch not available or failed, using cached storage', err);
  }
  isFetchingServerBlogs = false;
  return getStoredBlogs();
}

// Trigger initial server sync once loaded
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetchServerBlogs();
  }, 100);
}

export function getStoredBlogs(): BlogPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const userBlogs: BlogPost[] = raw ? JSON.parse(raw) : [];

    const likesRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    const likesMap: Record<string, number> = likesRaw ? JSON.parse(likesRaw) : {};

    return userBlogs.map((post) => {
      if (likesMap[post.id] !== undefined) {
        return { ...post, likes: Math.max(post.likes || 0, likesMap[post.id]) };
      }
      return post;
    });
  } catch (err) {
    console.error('Failed to parse stored blogs', err);
    return [];
  }
}

export function saveNewBlog(input: {
  title: string;
  excerpt?: string;
  body: string;
  imageUrl?: string;
  author?: string;
  authorSurname?: string;
  authorRole?: string;
  authorAvatar?: string;
  authorEmail?: string;
  authorBio?: string;
  category?: string;
  readTime?: string;
  tags?: string[];
}): BlogPost {
  const title = input.title.trim();
  const body = input.body.trim();
  const author = input.author?.trim() || 'Anonymous Author';
  const authorRole = input.authorRole?.trim();
  const authorAvatar = input.authorAvatar?.trim();
  const authorEmail = input.authorEmail?.trim();
  const authorBio = input.authorBio?.trim();
  const category = input.category?.trim() || 'General';
  const imageUrl = input.imageUrl?.trim() || PRESET_COVER_IMAGES[0].url;
  
  const excerpt = input.excerpt?.trim() || (body.slice(0, 160) + (body.length > 160 ? '...' : ''));
  const id = `post-${Date.now()}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || id;

  const now = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const publishedDate = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const readTime = input.readTime?.trim() || calculateReadTime(body);

  const newPost: BlogPost = {
    id,
    slug,
    title,
    excerpt,
    body,
    imageUrl,
    author,
    authorSurname: input.authorSurname,
    authorRole,
    authorAvatar,
    authorEmail,
    authorBio,
    category,
    publishedDate,
    readTime,
    likes: 0,
    tags: input.tags,
    isCommunityPost: true,
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: BlogPost[] = raw ? JSON.parse(raw) : [];
    const updated = [newPost, ...existing];

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (storageErr) {
      console.warn('LocalStorage full, trimming older cached posts:', storageErr);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 15)));
      } catch {
        // Ignore local storage error if full, server API sync handles persistence
      }
    }

    window.dispatchEvent(new CustomEvent('tg_blogs_updated', { detail: newPost }));

    // Async sync to server API
    fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    }).catch((e) => console.warn('Server blog sync error:', e));

  } catch (err) {
    console.error('Failed to save blog to storage', err);
  }

  return newPost;
}

export function hasUserLiked(id: string): boolean {
  try {
    const userLikesKey = 'tg_has_liked_posts';
    const userLikesRaw = localStorage.getItem(userLikesKey);
    const hasLikedSet: string[] = userLikesRaw ? JSON.parse(userLikesRaw) : [];
    return hasLikedSet.includes(id);
  } catch {
    return false;
  }
}

export function toggleLikeBlog(id: string): { likes: number; hasLiked: boolean } {
  try {
    const userLikesKey = 'tg_has_liked_posts';
    const userLikesRaw = localStorage.getItem(userLikesKey);
    const hasLikedSet: string[] = userLikesRaw ? JSON.parse(userLikesRaw) : [];

    const likesRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    const likesMap: Record<string, number> = likesRaw ? JSON.parse(likesRaw) : {};

    const currentlyLiked = hasLikedSet.includes(id);
    const delta = currentlyLiked ? -1 : 1;

    if (currentlyLiked) {
      const nextLiked = hasLikedSet.filter((item) => item !== id);
      localStorage.setItem(userLikesKey, JSON.stringify(nextLiked));
      likesMap[id] = Math.max(0, (likesMap[id] || 0) - 1);
    } else {
      hasLikedSet.push(id);
      localStorage.setItem(userLikesKey, JSON.stringify(hasLikedSet));
      likesMap[id] = (likesMap[id] || 0) + 1;
    }
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesMap));

    // Update in local array
    const blogs = getStoredBlogs();
    const target = blogs.find((b) => b.id === id);
    if (target) {
      target.likes = Math.max(0, (target.likes || 0) + delta);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogs));
      window.dispatchEvent(new CustomEvent('tg_blogs_updated'));
    }

    // Sync to server
    fetch(`/api/blogs/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment: delta }),
    }).catch(() => {});

    return { likes: target?.likes || 0, hasLiked: !currentlyLiked };
  } catch (err) {
    console.error('Failed to toggle like', err);
    return { likes: 0, hasLiked: false };
  }
}

export function deleteCommunityBlog(id: string): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return false;
    const existing: BlogPost[] = JSON.parse(raw);
    const updated = existing.filter((post) => post.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('tg_blogs_updated'));

    // Sync to server API
    fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    return true;
  } catch (err) {
    console.error('Failed to delete blog post', err);
    return false;
  }
}
