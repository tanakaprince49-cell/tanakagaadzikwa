/**
 * /sitemap-blogs.xml  ->  every blog story + every blog image.
 *
 * Blog posts are created at runtime, so this sitemap is generated on demand
 * from Firestore. It includes the `<image:image>` extension for all three
 * generated crops of each cover (16:9, 4:3, 1:1) so Google Images can find and
 * index the artwork too.
 */

import { fetchPosts, escapeHtml, SITE_ORIGIN } from './_lib/firestore.js';

function isoDate(value) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export default async function handler(req, res) {
  const posts = await fetchPosts();

  // Stories are created at runtime, so this list can come back empty when the
  // database is not readable from the server. Always return a valid document
  // (with the hub) rather than an error, and let the hub page's rendered links
  // carry crawlers to the individual stories.
  const fallbackUrls = posts.length
    ? ''
    : `  <url>
    <loc>${SITE_ORIGIN}/blogs</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;

  const urls = posts
    .map((post) => {
      const loc = `${SITE_ORIGIN}/blogs/${encodeURIComponent(post.slug || post.id)}`;
      const lastmod = isoDate(post.publishedDate);
      const images = [
        post.imageVariants?.wide,
        post.imageVariants?.standard,
        post.imageVariants?.square,
        post.imageUrl,
      ].filter(Boolean);

      const imageTags = [
        ...new Set(images),
      ]
        .map(
          (src, index) => `    <image:image>
      <image:loc>${escapeHtml(src)}</image:loc>
      <image:title>${escapeHtml(post.title)}${index > 0 ? ` (${index === 1 ? '4:3' : index === 2 ? '1:1' : 'cover'})` : ''}</image:title>
      <image:caption>${escapeHtml(post.excerpt || post.title)}</image:caption>
    </image:image>`
        )
        .join('\n');

      return `  <url>
    <loc>${escapeHtml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${imageTags}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${fallbackUrls}${urls}
</urlset>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  res.end(xml);
}
