/**
 * Build-time prerenderer.
 *
 * The app is a React SPA, so the raw HTML shipped to crawlers used to be an
 * empty <div id="root"></div>. This script runs after `vite build` and writes a
 * real, fully-populated HTML file for every public route:
 *
 *   dist/index.html              -> /
 *   dist/about/index.html        -> /about
 *   dist/projects/index.html     -> /projects
 *   ...
 *
 * Each file gets its own <title>, description, canonical, OpenGraph/Twitter
 * tags, a self-contained schema.org @graph (Person, WebSite, Organization,
 * LINKUP, FAQ, breadcrumbs, page type) and readable HTML content with real
 * internal links - so Google (and every other crawler) can index the site
 * without executing JavaScript. React still boots and takes over the page.
 *
 * It also regenerates sitemap.xml + robots.txt from the same route list.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ROUTES,
  SITE,
  PERSON,
  HOME_PORTRAITS,
  FAQ_ITEMS,
  PHOTO_URLS,
  buildPageGraph,
} from '../src/data/siteConfig.js';
import { PHOTOS, PHOTO_LICENSE } from '../src/data/photoGallery.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender] dist/index.html not found - run `vite build` first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const today = new Date().toISOString().slice(0, 10);

const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ */
/* Head                                                               */
/* ------------------------------------------------------------------ */

const stripManagedHead = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta[^>]+name="(description|keywords|author|robots|googlebot|googlebot-news|news_keywords|twitter:[^"]+)"[^>]*>/gi, '')
    .replace(/<meta[^>]+property="(og:[^"]+|profile:[^"]+|article:[^"]+)"[^>]*>/gi, '')
    .replace(/<link[^>]+rel="canonical"[^>]*>/gi, '')
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');

const buildHead = (route) => {
  const url = route.path === '/' ? `${SITE.origin}/` : `${SITE.origin}${route.path}`;
  const image = route.image || SITE.portrait;
  return `
    <title>${esc(route.title)}</title>
    <meta name="description" content="${esc(route.description)}" />
    <meta name="author" content="${esc(SITE.name)}" />
    <meta name="keywords" content="${esc(route.keywords || '')}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot-news" content="index, follow" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="${route.schema === 'home' || route.schema === 'about' ? 'profile' : 'website'}" />
    <meta property="og:site_name" content="${esc(SITE.siteName)}" />
    <meta property="og:locale" content="${SITE.locale}" />
    <meta property="og:title" content="${esc(route.title)}" />
    <meta property="og:description" content="${esc(route.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${esc(`${SITE.name} - ${route.title}`)}" />
    <meta property="profile:first_name" content="${esc(PERSON.givenName)}" />
    <meta property="profile:last_name" content="${esc(PERSON.familyName)}" />
    <meta property="profile:username" content="tanakaprince49" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${SITE.twitter}" />
    <meta name="twitter:creator" content="${SITE.twitter}" />
    <meta name="twitter:title" content="${esc(route.title)}" />
    <meta name="twitter:description" content="${esc(route.description)}" />
    <meta name="twitter:image" content="${image}" />

    <script type="application/ld+json" id="static-site-ldjson">
${JSON.stringify(buildPageGraph(route.path), null, 2)}
    </script>`;
};

/* ------------------------------------------------------------------ */
/* Crawlable body content per route                                   */
/* ------------------------------------------------------------------ */

const NAV = `
  <nav aria-label="Primary">
    <a href="/">Home</a> ·
    <a href="/about">About Tanaka Gaadzikwa</a> ·
    <a href="/projects">Projects</a> ·
    <a href="/now">Now</a> ·
    <a href="/blogs">Blogs</a> ·
    <a href="/contact">Contact</a>
  </nav>`;

const SOCIAL_LINKS = PERSON.sameAs
  .filter((url) => !url.includes('tanakagaadzikwa.com'))
  .map((url) => `<a href="${esc(url)}" rel="me noopener" target="_blank">${esc(new URL(url).hostname.replace('www.', ''))}</a>`)
  .join(' · ');

const faqMarkup = () =>
  FAQ_ITEMS.map(
    (item) => `<h3>${esc(item.q)}</h3>\n      <p>${esc(item.a)}</p>`
  ).join('\n      ');

const STATIC_BODY = {
  home: `
    <header>
      <h1>Tanaka Gaadzikwa — Young Entrepreneur, Startup Cupid &amp; Minister of AI</h1>
      <p>${esc(SITE.description)}</p>
    </header>
    <section>
      <h2>Who is Tanaka Gaadzikwa?</h2>
      <p>${esc(PERSON.description)}</p>
      <p>Tanaka Prince Gaadzikwa (born 20 November 2010, Harare, Zimbabwe) is a software builder and the founder and CEO of LINKUP, an AI-powered co-founder matchmaking platform. He is known publicly as the <strong>Startup Cupid</strong> and <strong>The Minister of AI</strong>, and writes about artificial intelligence, software engineering and building startups from Zimbabwe.</p>
      <ul>
        <li><strong>Full name:</strong> Tanaka Prince Gaadzikwa</li>
        <li><strong>Role:</strong> Founder &amp; CEO of LINKUP</li>
        <li><strong>Based in:</strong> Harare, Zimbabwe</li>
        <li><strong>Known as:</strong> Startup Cupid · The Minister of AI</li>
        <li><strong>Focus:</strong> Artificial intelligence, software engineering, entrepreneurship</li>
      </ul>
    </section>
    <section>
      <h2>Explore</h2>
      <ul>
        <li><a href="/about">Read the full biography of Tanaka Gaadzikwa</a></li>
        <li><a href="/projects">See the projects and products he has built</a></li>
        <li><a href="/now">What he is working on right now</a></li>
        <li><a href="/blogs">Essays and stories on AI, software and startups</a></li>
        <li><a href="/contact">Contact and collaboration details</a></li>
      </ul>
    </section>
    <section>
      <h2>Frequently asked questions</h2>
      ${faqMarkup()}
    </section>
    <footer><p>Official profiles: ${SOCIAL_LINKS}</p></footer>`,

  about: `
    <header>
      <h1>About Tanaka Gaadzikwa</h1>
      <p>Software builder, entrepreneur and founder. Passionate about artificial intelligence, startup collaboration, and proving that transformative technology can be built from anywhere.</p>
    </header>
    <section>
      <h2>Building from Harare, Zimbabwe</h2>
      <p>I'm <strong>Tanaka Gaadzikwa</strong> (born November 20, 2010), a young entrepreneur and software builder based in Harare, Zimbabwe. I'm interested in technology, artificial intelligence and entrepreneurship — particularly how software can solve real problems and help people access opportunities they might otherwise struggle to find.</p>
      <p>My journey began with curiosity about what technology makes possible. That curiosity grew into a desire to build things myself: not just explore existing products, but develop my own ideas, experiment with emerging technologies and turn concepts into working software.</p>
    </section>
    <section>
      <h2>LINKUP and the Startup Cupid mission</h2>
      <p>Today my primary venture is <strong>LINKUP</strong>, an AI-powered networking and matchmaking platform designed to help founders, developers, designers and other ambitious people discover potential collaborators. LINKUP's conversational assistant, <em>Linky</em>, understands what someone is building and pairs them with complementary talent — the reason people call me the <strong>Startup Cupid</strong>.</p>
      <p>Building a startup while continuing my education has taught me that entrepreneurship involves much more than writing code. It requires understanding people, questioning assumptions, communicating ideas, learning from feedback and staying committed when progress is slower than expected.</p>
    </section>
    <section>
      <h2>The Minister of AI</h2>
      <p>I'm particularly interested in the intersection of AI and human collaboration: how intelligent systems can help people discover the right connections, find complementary skills and turn ambitious ideas into meaningful projects. That focus is why the community nicknamed me <strong>The Minister of AI</strong>.</p>
      <p>I believe meaningful technology can be built from anywhere. Being based in Zimbabwe is part of my story, not a boundary on what I can explore or create.</p>
    </section>
    <section>
      <h2>Frequently asked questions</h2>
      ${faqMarkup()}
    </section>
    <footer>
      <p>Continue reading: <a href="/projects">Projects</a> · <a href="/blogs">Blogs</a> · <a href="/now">Now</a> · <a href="/contact">Contact</a></p>
      <p>Verified profiles: ${SOCIAL_LINKS}</p>
    </footer>`,

  projects: `
    <header>
      <h1>Projects &amp; Ventures by Tanaka Gaadzikwa</h1>
      <p>Software built to solve real-world friction.</p>
    </header>
    <article>
      <h2>LINKUP — AI co-founder matchmaking platform</h2>
      <p>LINKUP is an AI-driven matchmaking platform created by Tanaka Gaadzikwa. Featuring an intelligent conversational assistant named <strong>Linky</strong>, it connects ambitious developers, designers, founders and students so they can build startups and high-impact projects together.</p>
      <ul>
        <li><strong>Problem:</strong> early-stage founders and builders waste months on cold outreach across scattered social platforms, and traditional networks reward resumes instead of shipping velocity and complementary skills.</li>
        <li><strong>Solution:</strong> intent-driven matchmaking — Linky converses in natural language to understand a startup idea, technical capability and working rhythm, then introduces complementary creators.</li>
        <li><strong>Features:</strong> Linky AI assistant, the Startup Cupid match engine, proof-of-work profiles, Android + web access.</li>
        <li><strong>Stack:</strong> Android (Google Play), TypeScript, React, Tailwind CSS, Node.js REST engine, vector semantic matching.</li>
        <li><strong>Status:</strong> Live beta on <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" rel="noopener" target="_blank">Google Play</a> and at <a href="https://linkupbuild.com/" rel="noopener" target="_blank">linkupbuild.com</a>.</li>
      </ul>
    </article>
    <section>
      <h2>Other work</h2>
      <ul>
        <li><strong>Tanaka Gaadzikwa Blogs &amp; News</strong> — an open publishing platform for essays on AI, software engineering and building startups from Zimbabwe. <a href="/blogs">Read the blogs</a>.</li>
        <li><strong>Harare builder meetups</strong> — informal weekend sessions helping students and independent creators ship public GitHub repos and live products. <a href="/now">See what's happening now</a>.</li>
      </ul>
    </section>`,

  now: `
    <header>
      <h1>Now — what Tanaka Gaadzikwa is working on</h1>
      <p>Last updated October 2026 · Harare, Zimbabwe (CAT, UTC+2)</p>
    </header>
    <section>
      <h2>What I'm building</h2>
      <ul>
        <li><strong>LINKUP cohort beta &amp; matchmaking engine (active beta, Q4 2026)</strong> — refining matching algorithms and onboarding for LINKUP so solo founders and engineers can find complementary collaborators through natural-language intent parsing. Includes a 7-day micro-sprint trial framework for prospective co-founders.</li>
        <li><strong>This platform (live production)</strong> — expanding tanakagaadzikwa.com as a verified credibility hub, portfolio and publishing archive, with Schema.org JSON-LD entity validation and weekly engineering essays.</li>
        <li><strong>Harare builder &amp; student developer meetups (ongoing)</strong> — weekend working sessions encouraging peers to ship public repositories and live URLs.</li>
      </ul>
    </section>
    <section>
      <h2>What I'm learning</h2>
      <ul>
        <li>Distributed retrieval architectures and vector databases for semantic matching.</li>
        <li>Applied AI product design: conversational onboarding, evaluation and guardrails.</li>
        <li>Early-stage startup finance, equity conversations between co-founders and honest progress reporting.</li>
      </ul>
    </section>
    <section>
      <h2>Work with me</h2>
      <p>Looking for a technical co-founder, a design partner, or someone to jam on an AI product? <a href="/contact">Get in touch</a> or read the <a href="/about">biography</a>.</p>
    </section>`,

  blogs: `
    <header>
      <h1>Blogs &amp; Stories — Tanaka Gaadzikwa</h1>
      <p>Essays and stories on software engineering, artificial intelligence and entrepreneurship, published by Tanaka Gaadzikwa and guest builders.</p>
    </header>
    <section>
      <h2>Read</h2>
      <ul>
        <li><a href="/blogs?author=Tanaka%20Gaadzikwa">All stories by Tanaka Gaadzikwa</a> — his author bio, profile and published articles.</li>
        <li><a href="/about">About the publisher, Tanaka Gaadzikwa</a>.</li>
        <li><a href="/projects">Projects mentioned in the stories</a>.</li>
      </ul>
      <p>The live list of articles, categories, search and the story reader are rendered by JavaScript. Every story is published with full Google News structured data (NewsArticle, BlogPosting, author Person, images).</p>
    </section>
    <section>
      <h2>Publish</h2>
      <p>Anyone can publish a story with a photo, a category and their own author profile. Sign in with Google to write your first post.</p>
    </section>`,

  contact: `
    <header>
      <h1>Contact Tanaka Gaadzikwa</h1>
      <p>For collaborations, press, speaking or LINKUP partnerships.</p>
    </header>
    <ul>
      <li><strong>Email:</strong> <a href="mailto:${SITE.email}">${SITE.email}</a></li>
      <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/" rel="me noopener" target="_blank">tanaka-gaadzikwa-linkup</a></li>
      <li><strong>X (Twitter):</strong> <a href="https://x.com/TGaadzikwa" rel="me noopener" target="_blank">@TGaadzikwa</a></li>
      <li><strong>Telegram:</strong> <a href="https://t.me/tanaka_93" rel="me noopener" target="_blank">@tanaka_93</a></li>
      <li><strong>WhatsApp:</strong> <a href="https://wa.me/263780011810" rel="noopener" target="_blank">+263 78 001 1810</a></li>
      <li><strong>Location:</strong> Harare, Zimbabwe (CAT, UTC+2)</li>
      <li><strong>LINKUP:</strong> <a href="https://linkupbuild.com/" rel="noopener" target="_blank">linkupbuild.com</a> · <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" rel="noopener" target="_blank">Google Play</a></li>
    </ul>
    <p>Prefer reading first? Start with the <a href="/about">biography</a> or the <a href="/blogs">blog</a>.</p>`,

  privacy: `
    <header><h1>Privacy Policy — Tanaka Gaadzikwa</h1></header>
    <p>This policy explains how <strong>tanakagaadzikwa.com</strong> collects, uses and protects information when you visit the site, read stories or publish a blog post.</p>
    <h2>What we collect</h2>
    <ul>
      <li><strong>Analytics:</strong> anonymised page views and performance metrics (Vercel Analytics &amp; Speed Insights).</li>
      <li><strong>Account data:</strong> if you sign in with Google to publish a story we store your name, email, profile photo and the bio you provide.</li>
      <li><strong>Content:</strong> the blog posts, photos, likes and comments you choose to publish.</li>
    </ul>
    <h2>How it is used</h2>
    <p>To display your author profile, attribute your stories, keep the platform secure, and understand which content is useful. We never sell personal data.</p>
    <h2>Your choices</h2>
    <p>You can request deletion of your account, stories and profile photo at any time by emailing <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
    <p>Contact: <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="/terms">Terms of Service</a></p>`,

  terms: `
    <header><h1>Terms of Service — Tanaka Gaadzikwa</h1></header>
    <p>By using <strong>tanakagaadzikwa.com</strong> you agree to these terms.</p>
    <h2>Publishing</h2>
    <ul>
      <li>You keep ownership of the stories and photos you publish, and you confirm you have the right to share them.</li>
      <li>Content that is unlawful, hateful, plagiarised, spam or misleading may be removed.</li>
      <li>You are responsible for the accuracy of what you publish under your name.</li>
    </ul>
    <h2>Use of the site</h2>
    <p>The site, its design and original content are the property of Tanaka Gaadzikwa unless stated otherwise. You may quote and link to stories with attribution.</p>
    <h2>Availability</h2>
    <p>The platform is provided "as is" while under active development; features may change or be interrupted.</p>
    <p>Questions: <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="/privacy">Privacy Policy</a></p>`,

  press: `
    <header>
      <h1>Tanaka Gaadzikwa Photos &amp; Press Kit</h1>
      <p>The official photo library of <strong>Tanaka Gaadzikwa</strong> — young entrepreneur, software builder, founder and CEO of LINKUP, known as the <em>Startup Cupid</em> and <em>The Minister of AI</em> — photographed in Harare and rural Zimbabwe. ${PHOTOS.length} high-resolution press photos, free to publish with a credit.</p>
    </header>
    <section>
      <h2>Every official photo of Tanaka Gaadzikwa</h2>
      ${PHOTOS.map((photo, index) => `<figure id="${photo.id}">
        <img src="${SITE.origin}${photo.src}" alt="${esc(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async" />
        <figcaption>
          <h3>${esc(photo.title)}</h3>
          <p>${esc(photo.caption)}</p>
          <p>${esc(photo.description)}</p>
          <p><small>${esc(photo.category)} · ${photo.width}×${photo.height} · Credit: ${esc(photo.creditText)} · ${esc(photo.datePublished)}</small></p>
        </figcaption>
      </figure>`).join('\n      ')}
    </section>
    <section>
      <h2>Using these photos</h2>
      <p>Every image on this page is an official photograph of Tanaka Gaadzikwa, released for editorial and press use. Credit “Tanaka Gaadzikwa” and, where the shot is watermarked, “Photography by TAKEPHOTOS”. Images may not be used to advertise a product or imply an endorsement.</p>
      <p>Licence: <a href="${PHOTO_LICENSE.url}">${esc(PHOTO_LICENSE.name)}</a>. For originals or an interview, email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
    </section>
    <footer>
      <p>More about Tanaka Gaadzikwa: <a href="/about">full biography</a> · <a href="/projects">LINKUP and projects</a> · <a href="/blogs">stories and essays</a> · <a href="/contact">press enquiries</a></p>
    </footer>`,
};

function staticBody(route) {
  const content = STATIC_BODY[route.schema] || STATIC_BODY.legal;
  return `
  <div id="root">
    <div data-prerender style="max-width:56rem;margin:0 auto;padding:2rem 1.5rem;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#e5e7eb;background:#0B1120;line-height:1.7">
      <style>
        [data-prerender] h1{font-size:2rem;line-height:1.2;margin:0 0 .75rem;font-weight:800}
        [data-prerender] h2{font-size:1.3rem;margin:1.75rem 0 .5rem;font-weight:700}
        [data-prerender] h3{font-size:1.05rem;margin:1.25rem 0 .35rem;font-weight:600}
        [data-prerender] p{margin:0 0 .9rem}
        [data-prerender] ul{margin:0 0 1rem 1.25rem;list-style:disc}
        [data-prerender] li{margin:.25rem 0}
        [data-prerender] a{color:#38BDF8;text-decoration:underline}
        [data-prerender] nav{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem;font-size:.9rem}
      </style>
      ${NAV}
      ${content}
    </div>
  </div>
  <noscript>
    <div style="max-width:56rem;margin:0 auto;padding:2rem 1.5rem;color:#e5e7eb;background:#0B1120">
      <p><strong>Tanaka Gaadzikwa</strong> — young entrepreneur, founder &amp; CEO of LINKUP, known as the Startup Cupid and The Minister of AI, based in Harare, Zimbabwe.</p>
      ${NAV}
    </div>
  </noscript>`;
}

/* ------------------------------------------------------------------ */
/* Write the files                                                    */
/* ------------------------------------------------------------------ */

const headlessTemplate = stripManagedHead(template)
  .replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<script)/, '<div id="root"></div>\n    ')
  .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');

let written = 0;

for (const route of ROUTES) {
  // NOTE: the hashed bundle <script> lives in <head> of the built template - we
  // only swap the body content, so the app boots exactly once.
  const html = headlessTemplate
    .replace('</head>', `${buildHead(route)}\n  </head>`)
    .replace(/<body([^>]*)>[\s\S]*<\/body>/i, (_match, attrs) => `<body${attrs}>\n${staticBody(route)}\n  </body>`);

  const outPath =
    route.path === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.path.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  written += 1;
  console.log(`[prerender] ${route.path.padEnd(12)} -> ${path.relative(rootDir, outPath)}`);
}

/* ------------------------------------------------------------------ */
/* Blog stories (from the committed snapshot)                          */
/* ------------------------------------------------------------------ */

const snapshotPath = path.join(rootDir, 'src/data/blogSnapshot.json');

const snapshot = fs.existsSync(snapshotPath)
  ? JSON.parse(fs.readFileSync(snapshotPath, 'utf8'))
  : { generatedAt: today, posts: [] };

const storyPosts = (snapshot.posts || []).filter((post) => post && post.slug && post.title);

const absolute = (url) => {
  if (!url) return `${SITE.origin}${SITE.portrait}`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE.origin}${url.startsWith('/') ? url : `/${url}`}`;
};

const plainText = (html = '') =>
  String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();

const storyUrl = (post) => `${SITE.origin}/blogs/${encodeURIComponent(post.slug)}`;

const storyDate = (post) => {
  const parsed = post.publishedDate ? new Date(post.publishedDate) : new Date(snapshot.generatedAt || today);
  return isNaN(parsed.getTime()) ? new Date(snapshot.generatedAt || today) : parsed;
};

const isOwnerAuthor = (post) => String(post.author || '').toLowerCase().includes('tanaka gaadzikwa');

const buildStoryHead = (post) => {
  const url = storyUrl(post);
  const image = absolute(post.imageUrl);
  const published = storyDate(post).toISOString();
  const description = (post.excerpt || plainText(post.body)).slice(0, 300);
  const words = plainText(post.body).split(/\s+/).filter(Boolean).length;

  const authorNode = isOwnerAuthor(post)
    ? { '@id': `${SITE.origin}/#person` }
    : {
        '@type': 'Person',
        '@id': `${url}#author`,
        name: post.author,
        description: post.authorBio || `${post.author} is a published author on Tanaka Gaadzikwa Blogs.`,
        ...(post.authorAvatar ? { image: absolute(post.authorAvatar) } : {}),
      };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['NewsArticle', 'BlogPosting'],
        '@id': `${url}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: String(post.title).slice(0, 110),
        description,
        image: [
          {
            '@type': 'ImageObject',
            '@id': `${url}#primaryimage`,
            url: image,
            contentUrl: image,
            width: 1600,
            height: 900,
            caption: `${post.title} — ${post.category || 'Story'} by ${post.author}`,
            representativeOfPage: true,
            creditText: post.author,
            copyrightNotice: `© ${new Date().getFullYear()} Tanaka Gaadzikwa Blogs`,
            license: `${SITE.origin}/terms`,
            acquireLicensePage: `${SITE.origin}/terms`,
            creator: isOwnerAuthor(post) ? { '@id': `${SITE.origin}/#person` } : { '@type': 'Person', name: post.author },
          },
          image,
        ],
        datePublished: published,
        dateModified: published,
        inLanguage: 'en',
        isAccessibleForFree: 'True',
        author: authorNode,
        publisher: {
          '@type': 'NewsMediaOrganization',
          '@id': `${SITE.origin}/#organization`,
          name: 'Tanaka Gaadzikwa Official Website',
          url: `${SITE.origin}/`,
          logo: { '@type': 'ImageObject', url: `${SITE.origin}/favicon-512x512.png`, width: 512, height: 512 },
        },
        articleSection: post.category || 'Technology',
        genre: post.category || 'Technology',
        keywords: [post.category, 'Tanaka Gaadzikwa', 'Zimbabwe', 'Artificial Intelligence'].filter(Boolean).join(', '),
        wordCount: words,
        articleBody: plainText(post.body).slice(0, 5000),
        about: [{ '@type': 'Thing', name: post.category || 'Technology' }, { '@id': `${SITE.origin}/#linkup` }],
        mentions: [{ '@id': `${SITE.origin}/#person` }, { '@id': `${SITE.origin}/#linkup` }],
        url,
        isPartOf: { '@id': `${SITE.origin}/blogs#blog` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE.origin}/blogs` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      { '@id': `${SITE.origin}/#person` },
    ],
  };

  return `
    <title>${esc(post.title)} by ${esc(post.author)} | Tanaka Gaadzikwa</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="author" content="${esc(post.author)}" />
    <meta name="keywords" content="${esc([post.title, post.category, post.author, 'Tanaka Gaadzikwa', 'Zimbabwe technology'].filter(Boolean).join(', '))}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="googlebot-news" content="index, follow" />
    <meta name="news_keywords" content="${esc([post.category, post.author, 'Tanaka Gaadzikwa', 'Technology', 'Zimbabwe'].filter(Boolean).join(', '))}" />
    <link rel="canonical" href="${url}" />
    <link rel="image_src" href="${esc(image)}" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${esc(SITE.siteName)}" />
    <meta property="og:title" content="${esc(post.title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:image:secure_url" content="${esc(image)}" />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />
    <meta property="og:image:alt" content="${esc(`${post.title} - ${post.category || 'Story'} cover image by ${post.author}`)}" />
    <meta property="article:published_time" content="${published}" />
    <meta property="article:modified_time" content="${published}" />
    <meta property="article:author" content="${esc(post.author)}" />
    <meta property="article:section" content="${esc(post.category || 'Technology')}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(post.title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <meta name="twitter:image:alt" content="${esc(post.title)}" />

    <script type="application/ld+json">${JSON.stringify(graph)}</script>
  `;
};

const buildStoryBody = (post) => {
  // Visible assets stay relative so they resolve on whatever host serves them.
  const image = post.imageUrl || SITE.portrait;
  const published = storyDate(post).toISOString().slice(0, 10);
  const words = plainText(post.body).split(/\s+/).filter(Boolean).length;
  return `
  <div id="root">
    <div data-prerender style="max-width:56rem;margin:0 auto;padding:1.5rem 1.25rem 3rem;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#e5e7eb;background:#0B1120;line-height:1.75">
      <style>
        [data-prerender] nav{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.25rem;font-size:.9rem}
        [data-prerender] a{color:#38BDF8;text-decoration:underline}
        [data-prerender] .crumbs{font-size:.8rem;color:#94a3b8}
        [data-prerender] .paper{background:#ffffff;color:#18181b;border-radius:1.25rem;padding:1.75rem 1.5rem;box-shadow:0 20px 45px rgba(0,0,0,.35)}
        [data-prerender] .paper h1{font-size:2rem;line-height:1.2;margin:.35rem 0 .75rem;font-weight:800;color:#09090b;font-family:Georgia,'Times New Roman',serif}
        [data-prerender] .paper h2{font-size:1.35rem;margin:1.75rem 0 .5rem;font-weight:700;color:#09090b}
        [data-prerender] .paper h3{font-size:1.1rem;margin:1.35rem 0 .4rem;font-weight:700;color:#09090b}
        [data-prerender] .paper p{margin:0 0 .95rem;color:#27272a}
        [data-prerender] .paper ul,[data-prerender] .paper ol{margin:0 0 1rem 1.25rem;color:#27272a}
        [data-prerender] .paper li{margin:.3rem 0;color:#27272a}
        [data-prerender] .paper blockquote{border-left:3px solid #18181b;margin:1rem 0;padding:.3rem 0 .3rem .9rem;color:#3f3f46;font-style:italic}
        [data-prerender] .paper img{max-width:100%;height:auto;border-radius:.75rem}
        [data-prerender] .paper a{color:#0369a1}
        [data-prerender] .paper strong{color:#09090b}
        [data-prerender] .paper code{background:#f4f4f5;color:#be185d;padding:.1rem .35rem;border-radius:.3rem}
        [data-prerender] .byline{font-size:.85rem;color:#71717a;margin:0 0 1rem}
        [data-prerender] .paper .byline{color:#52525b}
        [data-prerender] .hero{width:100%;height:auto;border-radius:.9rem;margin:0 0 1.5rem;display:block}
        [data-prerender] .dek{font-size:1.05rem;color:#3f3f46;margin:0 0 1rem}
      </style>
      ${NAV}
      <p class="crumbs"><a href="/">Home</a> › <a href="/blogs">Blogs</a> › <span>${esc(post.title)}</span></p>
      <div class="paper">
        <article itemscope itemtype="https://schema.org/NewsArticle">
          <header>
            <p class="byline"><span itemprop="articleSection">${esc(post.category || 'General')}</span> · <time itemprop="datePublished" datetime="${published}">${esc(post.publishedDate || published)}</time> · ${esc(post.readTime || `${Math.max(1, Math.ceil(words / 200))} min read`)}</p>
            <h1 itemprop="headline">${esc(post.title)}</h1>
            ${post.excerpt ? `<p class="dek" itemprop="description">${esc(post.excerpt)}</p>` : ''}
            <p class="byline">By <a href="/blogs?author=${encodeURIComponent(post.author)}" rel="author" itemprop="author">${esc(post.author)}</a>${post.authorBio ? ` — ${esc(post.authorBio)}` : ''}</p>
          </header>
          <img class="hero" src="${esc(image)}" alt="${esc(`${post.title} - ${post.category || 'Story'} cover image by ${post.author}`)}" width="1600" height="900" itemprop="image" />
          <div itemprop="articleBody">${post.body || `<p>${esc(post.excerpt || '')}</p>`}</div>
          <footer>
            <p class="byline">More from Tanaka Gaadzikwa: <a href="/blogs">all stories</a> · <a href="/about">about</a> · <a href="/contact">contact</a></p>
          </footer>
        </article>
      </div>
    </div>
  </div>
  <noscript><p>Read ${esc(post.title)} on Tanaka Gaadzikwa Blogs.</p></noscript>`;
};

let storiesWritten = 0;
for (const post of storyPosts) {
  const html = headlessTemplate
    .replace('</head>', `${buildStoryHead(post)}\n  </head>`)
    .replace(/<body([^>]*)>[\s\S]*<\/body>/i, (_match, attrs) => `<body${attrs}>\n${buildStoryBody(post)}\n  </body>`);

  const outPath = path.join(distDir, 'blogs', post.slug, 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  storiesWritten += 1;
  written += 1;
  console.log(`[prerender] /blogs/${post.slug.slice(0, 28)}… -> ${path.relative(rootDir, outPath)}`);
}
console.log(`[prerender] ${storiesWritten} blog stories prerendered from snapshot`);

/* Sitemap ---------------------------------------------------------- */

const sitemapUrls = [
  ...ROUTES,
  {
    path: '/blogs?author=Tanaka%20Gaadzikwa',
    priority: 0.9,
    changefreq: 'weekly',
  },
  ...storyPosts.map((post) => ({
    path: `/blogs/${post.slug}`,
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: storyDate(post).toISOString().slice(0, 10),
    image: absolute(post.imageUrl),
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapUrls
  .map((route) => {
    const loc =
      route.path === '/'
        ? `${SITE.origin}/`
        : `${SITE.origin}${route.path.replace('/blogs?author=', '/blogs?author=')}`;
    const imageTag = (loc, title, caption) =>
      `    <image:image>\n      <image:loc>${esc(loc)}</image:loc>\n      <image:title>${esc(title)}</image:title>\n      <image:caption>${esc(caption)}</image:caption>\n    </image:image>`;

    const images =
      // Only list images that genuinely render on the URL - Google rejects the rest.
      route.path === '/'
        ? HOME_PORTRAITS.slice(0, 5)
            .map((url, index) => imageTag(url, `Tanaka Gaadzikwa portrait ${index + 1}`, 'Official portrait of Tanaka Gaadzikwa, founder and CEO of LINKUP'))
            .join('\n')
        : route.path === '/press'
          ? PHOTOS.map((photo) => imageTag(`${SITE.origin}${photo.src}`, photo.title, photo.caption)).join('\n')
          : route.image
            ? imageTag(esc(route.image), route.path.replace('/blogs/', '').replace(/-/g, ' '), route.title)
            : '';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
${images}
  </url>`;
  })
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('[prerender] sitemap.xml written');

/* Image sitemap ----------------------------------------------------- */

const imageEntry = (loc, title, caption) =>
  `    <image:image>\n      <image:loc>${esc(loc)}</image:loc>\n      <image:title>${esc(title)}</image:title>\n      <image:caption>${esc(caption)}</image:caption>\n    </image:image>`;

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE.origin}/press</loc>
    <lastmod>${today}</lastmod>
${PHOTOS.map((photo) => imageEntry(`${SITE.origin}${photo.src}`, photo.title, photo.caption)).join('\n')}
  </url>
  <url>
    <loc>${SITE.origin}/</loc>
    <lastmod>${today}</lastmod>
${HOME_PORTRAITS.slice(0, 5)
  .map((url, index) => imageEntry(url, `Tanaka Gaadzikwa portrait ${index + 1}`, 'Official portrait of Tanaka Gaadzikwa, young entrepreneur and CEO of LINKUP'))
  .join('\n')}
  </url>
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'sitemap-images.xml'), imageSitemap, 'utf8');
console.log(`[prerender] sitemap-images.xml written (${PHOTOS.length} press photos)`);

/* Story sitemap (blogs + their images) ------------------------------ */

const blogsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${storyPosts
  .map((post) => {
    const loc = storyUrl(post);
    const image = absolute(post.imageUrl);
    const avatar = post.authorAvatar ? absolute(post.authorAvatar) : '';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${storyDate(post).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${esc(image)}</image:loc>
      <image:title>${esc(post.title)}</image:title>
      <image:caption>${esc(post.excerpt || post.title)}</image:caption>
    </image:image>${avatar ? `\n    <image:image>\n      <image:loc>${esc(avatar)}</image:loc>\n      <image:title>${esc(`${post.author} profile photo`)}</image:title>\n    </image:image>` : ''}
  </url>`;
  })
  .join('\n')}
  <url>
    <loc>${SITE.origin}/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap-blogs.xml'), blogsSitemap, 'utf8');
console.log(`[prerender] sitemap-blogs.xml written (${storyPosts.length} stories)`);

/* Google News sitemap (last 2 days) --------------------------------- */

const NEWS_CUTOFF = 48 * 60 * 60 * 1000;
const recentStories = storyPosts
  .filter((post) => Date.now() - storyDate(post).getTime() <= NEWS_CUTOFF)
  .slice(0, 1000);

const newsEntries = recentStories
  .map((post) => {
    const loc = storyUrl(post);
    const image = absolute(post.imageUrl);
    return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Tanaka Gaadzikwa Blogs</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${storyDate(post).toISOString()}</news:publication_date>
      <news:title>${esc(post.title)}</news:title>
      <news:keywords>${esc([post.category, 'Tanaka Gaadzikwa', 'Zimbabwe technology'].filter(Boolean).join(', '))}</news:keywords>
    </news:news>
    <image:image>
      <image:loc>${esc(image)}</image:loc>
      <image:title>${esc(post.title)}</image:title>
      <image:caption>${esc(post.excerpt || post.title)}</image:caption>
    </image:image>
  </url>`;
  })
  .join('\n');

const hubNewsEntry = `  <url>
    <loc>${SITE.origin}/blogs</loc>
    <news:news>
      <news:publication>
        <news:name>Tanaka Gaadzikwa News &amp; Blogs</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${today}</news:publication_date>
      <news:title>Tanaka Gaadzikwa Blogs &amp; Technology Perspectives</news:title>
    </news:news>
    <image:image>
      <image:loc>${SITE.origin}${SITE.portrait}</image:loc>
      <image:title>Tanaka Gaadzikwa Blogs &amp; News</image:title>
      <image:caption>Tanaka Gaadzikwa open platform stories on software development, AI, and startups.</image:caption>
    </image:image>
  </url>`;

const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${newsEntries ? `${newsEntries}\n` : ''}${hubNewsEntry}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap-news.xml'), newsSitemap, 'utf8');
console.log(`[prerender] sitemap-news.xml written (${recentStories.length} stories in the last 48h)`);

/* robots.txt ------------------------------------------------------- */

const robots = `# ${SITE.siteName}
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
Sitemap: ${SITE.origin}/sitemap-blogs.xml
Sitemap: ${SITE.origin}/sitemap-news.xml
Sitemap: ${SITE.origin}/sitemap-images.xml
`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf8');
console.log('[prerender] robots.txt written');
console.log(`[prerender] done - ${written} routes prerendered`);
