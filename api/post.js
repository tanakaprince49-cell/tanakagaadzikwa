/**
 * /blogs/:slug  ->  server-rendered story page.
 *
 * The blog posts live in Firestore and are created at runtime, so they cannot be
 * prerendered at build time. This function fetches the story, renders the full
 * article into the HTML (headline, byline, body, images, author bio) and adds
 * complete metadata + schema.org NewsArticle/BlogPosting markup, which is what
 * Google Search and Google News need to index and surface a story.
 *
 * If Firestore cannot be reached, or the story does not exist, the function
 * falls back to the normal SPA shell so the client-side app still works.
 */

import {
  fetchPost,
  fetchPosts,
  escapeHtml,
  articleBodyHtml,
  plainText,
  SITE_ORIGIN,
} from './_lib/firestore.js';

const PERSON_ID = `${SITE_ORIGIN}/#person`;
const ORG_ID = `${SITE_ORIGIN}/#organization`;
const LINKUP_ID = `${SITE_ORIGIN}/#linkup`;

function getSlug(req) {
  try {
    const url = new URL(req.url, SITE_ORIGIN);
    const fromQuery = url.searchParams.get('slug');
    if (fromQuery) return decodeURIComponent(fromQuery);
    const match = url.pathname.match(/\/blogs\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function normalizeDateForIso(value) {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value)) return value;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function buildJsonLd(post, canonicalUrl) {
  const authorSlug = encodeURIComponent(post.author || 'Tanaka Gaadzikwa');
  const authorUrl = `${SITE_ORIGIN}/blogs?author=${authorSlug}`;
  const images = [];
  const primary = post.imageVariants?.wide || post.imageUrl;

  if (primary) {
    images.push({
      '@type': 'ImageObject',
      '@id': `${canonicalUrl}#primaryimage`,
      url: primary,
      contentUrl: primary,
      thumbnailUrl: post.imageVariants?.square || primary,
      width: 1600,
      height: 900,
      caption: `${post.title} — ${post.category || 'Story'} by ${post.author}`,
      representativeOfPage: true,
      creditText: post.author,
      copyrightNotice: `© ${new Date().getFullYear()} Tanaka Gaadzikwa Blogs. Author: ${post.author}`,
    });
  }
  if (post.imageVariants?.standard) {
    images.push({ '@type': 'ImageObject', url: post.imageVariants.standard, width: 900, height: 675, caption: `${post.title} — 4:3 crop` });
  }
  if (post.imageVariants?.square) {
    images.push({ '@type': 'ImageObject', url: post.imageVariants.square, width: 700, height: 700, caption: `${post.title} — 1:1 crop` });
  }
  if (primary) images.push(primary);

  const isOwner = String(post.author || '').toLowerCase().includes('tanaka gaadzikwa');
  const authorNode = isOwner
    ? { '@id': PERSON_ID }
    : {
        '@type': 'Person',
        '@id': `${authorUrl}#person`,
        name: post.author,
        url: authorUrl,
        description: post.authorBio || `${post.author} is a published author on Tanaka Gaadzikwa Blogs.`,
        ...(post.authorAvatar ? { image: post.authorAvatar } : {}),
      };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['NewsArticle', 'BlogPosting'],
        '@id': `${canonicalUrl}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        headline: String(post.title).slice(0, 110),
        description: post.excerpt || plainText(articleBodyHtml(post)).slice(0, 160),
        image: images,
        datePublished: normalizeDateForIso(post.publishedDate),
        dateModified: normalizeDateForIso(post.publishedDate),
        inLanguage: 'en',
        isAccessibleForFree: 'True',
        author: authorNode,
        publisher: {
          '@type': 'NewsMediaOrganization',
          '@id': ORG_ID,
          name: 'Tanaka Gaadzikwa Official Website',
          url: `${SITE_ORIGIN}/`,
          logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/favicon-512x512.png`, width: 512, height: 512 },
        },
        articleSection: post.category || 'Technology',
        about: [{ '@type': 'Thing', name: post.category || 'Technology' }, { '@id': LINKUP_ID }],
        mentions: [{ '@id': PERSON_ID }, { '@id': LINKUP_ID }],
        wordCount: plainText(articleBodyHtml(post)).split(/\s+/).filter(Boolean).length,
        articleBody: plainText(articleBodyHtml(post)),
        url: canonicalUrl,
        isPartOf: { '@id': `${SITE_ORIGIN}/blogs#blog` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE_ORIGIN}/blogs` },
          { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
        ],
      },
      { '@id': PERSON_ID },
    ],
  };
}

function articleContent(post) {
  const published = escapeHtml(post.publishedDate || '');
  const category = escapeHtml(post.category || 'General');
  const readTime = escapeHtml(post.readTime || '');
  const cover = post.imageVariants?.wide || post.imageUrl;
  const authorBio = post.authorBio ? `<p class="bio">${escapeHtml(post.authorBio)}</p>` : '';

  return `
    <div class="article-wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> › <a href="/blogs">Blogs</a> › <span>${escapeHtml(post.title)}</span>
      </nav>
      <article>
        <header>
          <p class="meta"><span class="chip">${category}</span> · ${published} · ${readTime}</p>
          <h1>${escapeHtml(post.title)}</h1>
          ${post.excerpt ? `<p class="dek">${escapeHtml(post.excerpt)}</p>` : ''}
          <div class="byline">
            ${post.authorAvatar ? `<img src="${escapeHtml(post.authorAvatar)}" alt="${escapeHtml(post.author)}" width="44" height="44" />` : ''}
            <div>
              <a class="author" href="/blogs?author=${encodeURIComponent(post.author || '')}">${escapeHtml(post.author || 'Tanaka Gaadzikwa')}</a>
              ${authorBio}
            </div>
          </div>
        </header>
        ${
          cover
            ? `<figure class="hero">
                 <img src="${escapeHtml(cover)}" alt="${escapeHtml(`${post.title} — ${category} cover image`)}" width="1600" height="900" fetchpriority="high" />
                 <figcaption>${escapeHtml(post.title)} — ${category} story by ${escapeHtml(post.author || 'Tanaka Gaadzikwa')}</figcaption>
               </figure>`
            : ''
        }
        <div class="body">${articleBodyHtml(post)}</div>
      </article>
      <footer class="article-footer">
        <p><strong>Written by <a href="/blogs?author=${encodeURIComponent(post.author || '')}">${escapeHtml(post.author || 'Tanaka Gaadzikwa')}</a></strong> — ${escapeHtml(post.authorBio || 'published author on tanakagaadzikwa.com')}</p>
        <p><a href="/blogs">← More stories</a> · <a href="/about">About Tanaka Gaadzikwa</a> · <a href="/contact">Contact</a></p>
      </footer>
    </div>`;
}

const ARTICLE_CSS = `
  .article-wrap{max-width:46rem;margin:0 auto;padding:2rem 1.25rem 4rem;font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#18181b;line-height:1.7}
  .crumbs{font-size:.78rem;color:#71717a;margin-bottom:1.25rem}
  .crumbs a{color:#0369a1;text-decoration:none}
  h1{font-family:Georgia,'Times New Roman',serif;font-size:2.1rem;line-height:1.15;margin:.35rem 0 .75rem;letter-spacing:-.01em}
  .meta{font-size:.78rem;color:#52525b;font-family:ui-monospace,SFMono-Regular,monospace}
  .chip{background:#f4f4f5;border-radius:999px;padding:.15rem .6rem;font-weight:600}
  .dek{font-size:1.05rem;color:#3f3f46;margin:0 0 1rem}
  .byline{display:flex;gap:.75rem;align-items:center;border-top:1px solid #e4e4e7;border-bottom:1px solid #e4e4e7;padding:.85rem 0;margin:1rem 0 1.5rem}
  .byline img{border-radius:999px;object-fit:cover}
  .author{font-weight:700;color:#18181b;text-decoration:none}
  .bio{font-size:.82rem;color:#52525b;margin:.15rem 0 0;max-width:34rem}
  figure.hero{margin:0 0 1.75rem}
  figure.hero img{width:100%;height:auto;border-radius:1rem;display:block}
  figcaption{font-size:.72rem;color:#71717a;margin-top:.4rem}
  .body{font-size:1.06rem;color:#27272a}
  .body h2,.body h3{font-family:Georgia,serif;color:#09090b;line-height:1.25;margin:1.5rem 0 .6rem}
  .body p{margin:0 0 1rem}
  .body a{color:#0369a1}
  .body blockquote{border-left:3px solid #18181b;margin:1rem 0;padding:.25rem 0 .25rem .9rem;color:#3f3f46;font-style:italic;background:#fafafa}
  .body ul,.body ol{margin:0 0 1rem 1.35rem}
  .body img{max-width:100%;height:auto;border-radius:.75rem}
  .body code{background:#f4f4f5;padding:.1rem .35rem;border-radius:.3rem;font-size:.9em;color:#be185d}
  .article-footer{border-top:1px solid #e4e4e7;margin-top:2rem;padding-top:1rem;font-size:.82rem;color:#52525b}
  .article-footer a{color:#0369a1}
  @media (prefers-color-scheme: dark){body{background:#0b1120}.article-wrap{color:#e4e4e7}h1,.body h2,.body h3{color:#fff}.author{color:#fff}}
`;

function standalonePage(post, canonicalUrl) {
  const ld = buildJsonLd(post, canonicalUrl);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(post.title)} by ${escapeHtml(post.author || 'Tanaka Gaadzikwa')} | Tanaka Gaadzikwa</title>
<meta name="description" content="${escapeHtml(post.excerpt || plainText(articleBodyHtml(post)).slice(0, 160))}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="googlebot-news" content="index, follow" />
<link rel="canonical" href="${canonicalUrl}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${escapeHtml(post.title)}" />
<meta property="og:description" content="${escapeHtml(post.excerpt || '')}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${escapeHtml(post.imageVariants?.wide || post.imageUrl || '')}" />
<meta property="article:published_time" content="${normalizeDateForIso(post.publishedDate)}" />
<meta property="article:section" content="${escapeHtml(post.category || 'Technology')}" />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>body{margin:0;background:#fff}${ARTICLE_CSS}</style>
</head>
<body>
${articleContent(post)}
<script>setTimeout(function(){if(!document.getElementById('spa-boot')){var a=document.createElement('a');a.href='/blogs';a.textContent='Open interactive version →';a.style.cssText='position:fixed;bottom:16px;right:16px;background:#18181b;color:#fff;padding:10px 16px;border-radius:12px;text-decoration:none;font:600 12px system-ui';document.body.appendChild(a);}},1200);</script>
</body>
</html>`;
}

/** Removes the generic SEO tags from the shell head so ours are the only ones. */
function cleanHead(head) {
  return head
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta[^>]+(?:property|name)\s*=\s*["'](?:og:[^"']+|twitter:[^"']+|article:[^"']+|description|robots|googlebot[^"']*|news_keywords|keywords)["'][^>]*>/gi, '')
    .replace(/<link[^>]+rel\s*=\s*["'](?:canonical|image_src|alternate)["'][^>]*>/gi, '')
    .replace(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi, '');
}

/** Injects the article + metadata into the built SPA shell so React can hydrate. */
function injectIntoShell(shell, post, canonicalUrl) {
  const ld = buildJsonLd(post, canonicalUrl);
  const title = `${post.title} by ${post.author || 'Tanaka Gaadzikwa'} | Tanaka Gaadzikwa`;
  const description = post.excerpt || plainText(articleBodyHtml(post)).slice(0, 160);
  const image = post.imageVariants?.wide || post.imageUrl || '';
  const square = post.imageVariants?.square || image;

  const headTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot-news" content="index, follow" />
    <meta name="news_keywords" content="${escapeHtml(`${post.category || 'Technology'}, ${post.author}, Tanaka Gaadzikwa, Zimbabwe`)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:site_name" content="Tanaka Gaadzikwa" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />
    <meta property="og:image:alt" content="${escapeHtml(`${post.title} - ${post.category || 'Technology'} story by ${post.author}`)}" />` : ''}
    <meta property="article:published_time" content="${normalizeDateForIso(post.publishedDate)}" />
    <meta property="article:modified_time" content="${normalizeDateForIso(post.publishedDate)}" />
    <meta property="article:section" content="${escapeHtml(post.category || 'Technology')}" />
    <meta property="article:author" content="${escapeHtml(post.author || 'Tanaka Gaadzikwa')}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(post.title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${square ? `<meta name="twitter:image" content="${escapeHtml(square)}" />` : ''}
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
  </head>`;

  const headEnd = shell.search(/<\/head>/i);
  const head = headEnd >= 0 ? cleanHead(shell.slice(0, headEnd)) : shell;
  const rest = headEnd >= 0 ? shell.slice(headEnd) : '';
  let html = head + headTags + rest;

  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*(?=<noscript|<script)/i,
    `<div id="root"><style>${ARTICLE_CSS}</style>${articleContent(post)}</div>\n    `
  );
  return html;
}

async function fetchShell(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || new URL(SITE_ORIGIN).host;
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  // Prefer the prerendered blogs hub: it ships the same bundle/CSS but already
  // contains blog-page markup, so a JS-less crawler sees relevant content.
  for (const path of ['/blogs/index.html', '/index.html', '/blogs']) {
    try {
      const res = await fetch(`${proto}://${host}${path}`, { headers: { Accept: 'text/html' } });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.includes('<div id="root"')) return text;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

/** Shell page used when the story body could not be read (JS will render it). */
function shellForUnknownStory(shell, slug) {
  const canonicalUrl = `${SITE_ORIGIN}/blogs/${encodeURIComponent(slug)}`;
  const headTags = `
    <title>Story | Tanaka Gaadzikwa Blogs</title>
    <meta name="description" content="Read the latest stories, founder notes and technology analysis by Tanaka Gaadzikwa and guest authors on tanakagaadzikwa.com." />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Tanaka Gaadzikwa" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      url: canonicalUrl,
      headline: 'Story — Tanaka Gaadzikwa Blogs',
      author: { '@id': PERSON_ID },
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': `${SITE_ORIGIN}/blogs#blog` },
    })}</script>
  </head>`;

  const headEnd = shell.search(/<\/head>/i);
  return headEnd >= 0 ? cleanHead(shell.slice(0, headEnd)) + headTags + shell.slice(headEnd) : shell;
}

export default async function handler(req, res) {
  const slug = getSlug(req);

  if (!slug) {
    res.statusCode = 302;
    res.setHeader('Location', '/blogs');
    res.end();
    return;
  }

  const [post, shell] = await Promise.all([fetchPost(slug), fetchShell(req)]);
  const canonicalUrl = `${SITE_ORIGIN}/blogs/${encodeURIComponent(post ? post.slug || post.id : slug)}`;

  let html;
  if (post) {
    html = shell ? injectIntoShell(shell, post, canonicalUrl) : standalonePage(post, canonicalUrl);
  } else if (shell) {
    // Story not readable from the server (Firestore rules/App Check). Serve the
    // app shell with the right canonical so the client renders it and Google's
    // renderer can still index the story instead of hitting a redirect.
    html = shellForUnknownStory(shell, slug);
  } else {
    html = standalonePage(
      {
        title: 'Story',
        excerpt: 'Read the latest stories by Tanaka Gaadzikwa and guest authors.',
        publishedDate: new Date().toISOString(),
        slug,
      },
      canonicalUrl
    );
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
  res.setHeader('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1');
  res.end(html);
}
