/**
 * Per-post analytics for blog authors.
 *
 * Records how many times each story was viewed, how many outbound/link clicks it
 * earned and how many times it was shared.
 *
 * Storage strategy (offline-first, no backend needed):
 *   1. Always mirrored into localStorage so the author sees numbers instantly,
 *      even before Firestore catches up or when the visitor is offline.
 *   2. Pushed to Firestore `blogStats/{postId}` with field increments when the
 *      network + rules allow it (see firestore.rules -> blogStats collection).
 *      Anything that fails is silently ignored - analytics must never break a
 *      page for a reader.
 */

import { db } from '../lib/firebase';
import { doc, setDoc, increment, serverTimestamp, getDocs, collection } from 'firebase/firestore';

export type StatKind = 'views' | 'clicks' | 'shares';

export interface PostStats {
  views: number;
  clicks: number;
  shares: number;
}

const STATS_KEY = 'tg_blog_stats_v1';
const SESSION_KEY = 'tg_blog_session_v1';
const VIEWED_KEY = 'tg_blog_viewed_ids_v1';

const EMPTY: PostStats = { views: 0, clicks: 0, shares: 0 };

type StatsMap = Record<string, PostStats>;

function readMap(): StatsMap {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? (JSON.parse(raw) as StatsMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: StatsMap) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(map));
  } catch {
    // storage full / disabled - ignore
  }
}

/** One session id so a reload doesn't inflate view counts. */
export function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function hasViewedThisSession(postId: string): boolean {
  try {
    const raw = sessionStorage.getItem(VIEWED_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (ids.includes(postId)) return true;
    ids.push(postId);
    sessionStorage.setItem(VIEWED_KEY, JSON.stringify(ids.slice(-100)));
    return false;
  } catch {
    return false;
  }
}

export function getLocalStats(postId: string): PostStats {
  return readMap()[postId] || EMPTY;
}

/** All locally recorded stats, keyed by post id. */
export function getAllLocalStats(): StatsMap {
  return readMap();
}

function bumpLocally(postId: string, kind: StatKind): PostStats {
  const map = readMap();
  const current = map[postId] || { ...EMPTY };
  current[kind] = (current[kind] || 0) + 1;
  map[postId] = current;
  writeMap(map);
  try {
    window.dispatchEvent(new CustomEvent('tg_blog_stats_updated', { detail: { postId, stats: current } }));
  } catch {
    // ignore
  }
  return current;
}

async function pushToFirestore(postId: string, kind: StatKind) {
  try {
    await setDoc(
      doc(db, 'blogStats', postId),
      {
        postId,
        [kind]: increment(1),
        lastAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // Rules not deployed, offline, or blocked - local stats still work.
  }
}

/** Registers one view per browser session per story. */
export function trackPostView(postId: string): void {
  if (!postId) return;
  if (hasViewedThisSession(postId)) return;
  bumpLocally(postId, 'views');
  void pushToFirestore(postId, 'views');
}

/** Registers a click (outbound link inside the story, or an explicit CTA). */
export function trackPostClick(postId: string, count = 1): void {
  if (!postId) return;
  for (let i = 0; i < count; i += 1) bumpLocally(postId, 'clicks');
  void pushToFirestore(postId, 'clicks');
}

/** Registers a share/copy-link action. */
export function trackPostShare(postId: string): void {
  if (!postId) return;
  bumpLocally(postId, 'shares');
  void pushToFirestore(postId, 'shares');
}

/**
 * Reads the aggregated stats for a set of posts: Firestore values merged with
 * the local mirror (whichever number is higher wins).
 */
export async function fetchStatsForPosts(postIds: string[]): Promise<Record<string, PostStats>> {
  const local = readMap();
  const merged: Record<string, PostStats> = {};
  postIds.forEach((id) => {
    merged[id] = { ...(local[id] || EMPTY) };
  });

  try {
    const snapshot = await getDocs(collection(db, 'blogStats'));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      const id = docSnap.id;
      if (!postIds.includes(id)) return;
      const remote: PostStats = {
        views: typeof data.views === 'number' ? data.views : 0,
        clicks: typeof data.clicks === 'number' ? data.clicks : 0,
        shares: typeof data.shares === 'number' ? data.shares : 0,
      };
      const existing = merged[id] || EMPTY;
      merged[id] = {
        views: Math.max(existing.views, remote.views),
        clicks: Math.max(existing.clicks, remote.clicks),
        shares: Math.max(existing.shares, remote.shares),
      };
    });
  } catch {
    // Fall back to local numbers only
  }

  return merged;
}

export function formatCount(value: number): string {
  if (!value || value < 0) return '0';
  if (value < 1000) return String(value);
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}
