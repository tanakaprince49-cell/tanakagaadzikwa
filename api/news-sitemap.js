/**
 * /sitemap-news.xml  ->  Google News sitemap.
 *
 * Google News only accepts articles published in the last two days, with a
 * maximum of 1,000 URLs per sitemap file. Anything older stays covered by
 * `/sitemap.xml` + `/sitemap-blogs.xml` for regular Search indexing.
 */

import { fetchPosts, escapeHtml, SITE_ORIGIN } from './_lib/firestore.js';

const WINDOW_MS = 48 * 60 * 60 * 1000; // Google News: last 2 days
const MAX_URLS = 1000;

function publishedTime(value) {
  const parsed = value ? new Date(value) : new Date();
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function handler(req, res) {
  const posts = await fetchPosts();
  const now = Date.now();

  const recent = posts
    .map((post) => ({ post, published: publishedTime(post.publishedDate) }))
    .filter(({ published }) => now - published.getTime() <= WINDOW_MS)
    .sort((a, b) => b.published.getTime() - a.published.getTime())
    .slice(0, MAX_URLS);

  const urls = recent
    .map(({ post, published }) => {
      const loc = `${SITE_ORIGIN}/blogs/${encodeURIComponent(post.slug || post.id)}`;
      const images = [post.imageVariants?.wide, post.imageUrl].filter(Boolean);
      const imageTags = [...new Set(images)]
        .map(
          (src) => `    <image:image>
      <image:loc>${escapeHtml(src)}</image:loc>
      <image:title>${escapeHtml(post.title)}</image:title>
      <image:caption>${escapeHtml(post.excerpt || post.title)}</image:caption>
    </image:image>`
        )
        .join('\n');

      return `  <url>
    <loc>${escapeHtml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>Tanaka Gaadzikwa Blogs</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${published.toISOString()}</news:publication_date>
      <news:title>${escapeHtml(post.title)}</news:title>
      <news:keywords>${escapeHtml(
        [post.category, 'Tanaka Gaadzikwa', 'LinkUp', 'Zimbabwe technology']
          .filter(Boolean)
          .join(', ')
      )}</news:keywords>
    </news:news>
${imageTags}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // Short cache: the two-day window moves constantly.
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
  res.end(xml);
}
