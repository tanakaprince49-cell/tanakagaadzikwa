/**
 * Minimal dependency-free Firestore REST reader used by the Vercel functions.
 *
 * The blog posts live in Firestore and are written by the browser app, so the
 * serverless layer reads the same documents over the public REST API (rules:
 * `match /blogs/{blogId} { allow read: if true }`).
 *
 * If the request fails (rules not deployed, API key restricted, offline) every
 * helper returns null/[] and the caller falls back to the SPA, so the site never
 * breaks because of analytics/SEO plumbing.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function readFirebaseConfig() {
  // 1. Bundler-friendly static require (Vercel file tracing picks this up).
  try {
    return require('../../firebase-applet-config.json');
  } catch {
    // fall through to filesystem lookup
  }
  // 2. Filesystem lookup relative to the working directory.
  for (const candidate of [
    path.join(process.cwd(), 'firebase-applet-config.json'),
    path.join(process.cwd(), '..', 'firebase-applet-config.json'),
  ]) {
    try {
      if (fs.existsSync(candidate)) return JSON.parse(fs.readFileSync(candidate, 'utf8'));
    } catch {
      // try next candidate
    }
  }
  return {};
}

const fileConfig = readFirebaseConfig();

export const FIREBASE = {
  projectId: process.env.FIREBASE_PROJECT_ID || fileConfig.projectId || 'tanakagaadzikwa-ba02c',
  databaseId:
    process.env.FIREBASE_DATABASE_ID ||
    fileConfig.firestoreDatabaseId ||
    '(default)',
  apiKey: process.env.FIREBASE_API_KEY || fileConfig.apiKey || '',
};

export const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://www.tanakagaadzikwa.com';

/* ------------------------------------------------------------------ */
/* Firestore REST value decoding                                       */
/* ------------------------------------------------------------------ */

function parseValue(value) {
  if (!value || typeof value !== 'object') return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('mapValue' in value) return parseFields(value.mapValue?.fields || {});
  if ('arrayValue' in value) return (value.arrayValue?.values || []).map(parseValue);
  return null;
}

function parseFields(fields) {
  const out = {};
  Object.keys(fields || {}).forEach((key) => {
    out[key] = parseValue(fields[key]);
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

function documentsUrl() {
  const { projectId, databaseId, apiKey } = FIREBASE;
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${encodeURIComponent(
    databaseId
  )}/documents/blogs`;
  return apiKey ? `${base}?key=${apiKey}&pageSize=300` : base;
}

/**
 * Returns every published blog post as a plain object.
 * @returns {Promise<Array>} newest first, or [] when unavailable
 */
export async function fetchPosts() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(documentsUrl(), {
      signal: controller.signal,
      headers: {
        // Some Firebase API keys are restricted by referrer - present the site.
        Referer: `${SITE_ORIGIN}/`,
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn('[api] firestore read failed', res.status);
      return [];
    }

    const payload = await res.json();
    const documents = payload.documents || [];
    return documents
      .map((doc) => {
        const fields = parseFields(doc.fields || {});
        const id = (doc.name || '').split('/').pop();
        const slug =
          fields.slug ||
          (fields.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') ||
          id;
        return { ...fields, id, slug };
      })
      .filter((post) => post && post.title)
      .sort((a, b) => String(b.id).localeCompare(String(a.id)));
  } catch (error) {
    console.warn('[api] firestore read error', error?.message || error);
    return [];
  }
}

/** Finds one post by slug or id. */
export async function fetchPost(slug) {
  if (!slug) return null;
  const posts = await fetchPosts();
  const wanted = String(slug).toLowerCase();
  return (
    posts.find((post) => String(post.slug).toLowerCase() === wanted) ||
    posts.find((post) => String(post.id).toLowerCase() === wanted) ||
    null
  );
}

/* ------------------------------------------------------------------ */
/* Small helpers shared by the HTML renderers                          */
/* ------------------------------------------------------------------ */

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const BLOCKED_TAGS = /<\s*(script|style|iframe|object|embed|form|input|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;

/** Very small allow-list sanitizer for story bodies stored as HTML. */
export function sanitizeArticleHtml(html = '') {
  let output = String(html).replace(BLOCKED_TAGS, '');
  output = output.replace(/<\s*(script|style|iframe|object|embed|form|input|link|meta)[^>]*>/gi, '');
  output = output.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
  output = output.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
  output = output.replace(/javascript:/gi, '');
  return output;
}

/** Renders markdown-ish legacy bodies (bold/italic/links/lists) to HTML. */
export function markdownToHtml(text = '') {
  const looksLikeHtml = /<\/?(p|div|br|strong|em|h[1-6]|ul|ol|li|blockquote|a|code)\b/i.test(text);
  if (looksLikeHtml) return sanitizeArticleHtml(text);

  const inline = (value) =>
    escapeHtml(value)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');

  return text
    .split(/\n\s*\n/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('### ')) return `<h3>${inline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith('## ')) return `<h2>${inline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith('> ')) return `<blockquote>${inline(trimmed.slice(2))}</blockquote>`;
      if (trimmed.startsWith('- ')) {
        const items = trimmed
          .split('\n')
          .map((line) => `<li>${inline(line.replace(/^-\s*/, ''))}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${inline(trimmed).replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

export function articleBodyHtml(post) {
  return post.body ? markdownToHtml(post.body) : `<p>${escapeHtml(post.excerpt || '')}</p>`;
}

/** Plain-text version of a body (for descriptions / reading time). */
export function plainText(html = '') {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
