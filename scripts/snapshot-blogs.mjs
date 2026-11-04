/**
 * Blog snapshot generator.
 *
 * Blog stories are stored in Firestore and created from the browser, so a
 * static production build has no way to read them: the Firestore project rejects
 * server-side reads (App Check), and the deployed site only serves prebuilt
 * files. Without a snapshot, a story's own URL (/blogs/<slug>) would 404 on the
 * host, which means it can never be indexed by Google or Google News.
 *
 * This script loads the live site in a real browser (where Firestore works),
 * captures every published story - including its rendered body, cover image and
 * author details - and writes it to `src/data/blogSnapshot.json`.
 *
 * `scripts/prerender.mjs` then renders one static, fully-populated HTML page per
 * story at build time, so the story URL serves the complete article to crawlers
 * with no JavaScript and no backend.
 *
 * Usage (needs Playwright + Chromium installed):
 *   node scripts/snapshot-blogs.mjs [--url https://www.tanakagaadzikwa.com/blogs]
 *
 * Re-run it whenever new stories are published, then rebuild + redeploy.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outFile = path.join(rootDir, 'src/data/blogSnapshot.json');
const publicBlogDir = path.join(rootDir, 'public', 'blogs');

/**
 * Cover images/avatars are stored in Firestore as base64 data URLs. Writing them
 * into JSON/HTML would bloat the pages and give Google nothing to index, so they
 * are decoded into real files under public/blogs/ and referenced by URL.
 */
function materialiseAsset(dataUrl, name) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl || '';
  const match = dataUrl.match(/^data:(image\/([a-z0-9.+-]+));base64,(.+)$/i);
  if (!match) return '';
  const ext = match[2] === 'jpeg' ? 'jpg' : match[2].replace('svg+xml', 'svg');
  fs.mkdirSync(publicBlogDir, { recursive: true });
  const fileName = `${name}.${ext}`;
  fs.writeFileSync(path.join(publicBlogDir, fileName), Buffer.from(match[3], 'base64'));
  return `/blogs/${fileName}`;
}

/** Plain text of an HTML string, trimmed to a sentence-ish length. */
function toExcerpt(html, max = 200) {
  const text = String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  return (lastStop > 80 ? cut.slice(0, lastStop + 1) : `${cut.trim()}…`).trim();
}

const argUrlIndex = process.argv.indexOf('--url');
const startUrl = argUrlIndex > -1 ? process.argv[argUrlIndex + 1] : 'https://www.tanakagaadzikwa.com/blogs';

async function loadPlaywright() {
  const candidates = [
    'playwright',
    // Fallback for sandboxes where Playwright lives one level above the repo.
    path.join(rootDir, '..', 'node_modules', 'playwright', 'index.mjs'),
  ];
  for (const candidate of candidates) {
    try {
      return await import(candidate);
    } catch {
      // try the next candidate
    }
  }
  console.error('[snapshot] Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const { chromium } = await loadPlaywright();

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

console.log(`[snapshot] opening ${startUrl}`);
await page.goto(startUrl, { waitUntil: 'load', timeout: 90000 });
await page.waitForSelector('article', { timeout: 60000 });
await page.waitForTimeout(2500);

const cards = await page.locator('article').count();
console.log(`[snapshot] found ${cards} story cards`);

const posts = [];

for (let i = 0; i < cards; i += 1) {
  const card = page.locator('article').nth(i);

  const meta = await card.evaluate((el) => {
    const link = el.querySelector('h3 a');
    const img = el.querySelector('img');
    const text = (sel) => el.querySelector(sel)?.textContent?.trim() || '';
    const mono = Array.from(el.querySelectorAll('.font-mono')).map((n) => n.textContent.trim());
    return {
      href: link?.getAttribute('href') || '',
      title: (link?.textContent || '').trim(),
      excerpt: text('[itemprop="description"]'),
      cover: img?.getAttribute('src') || '',
      coverSrcSet: img?.getAttribute('srcset') || '',
      author: text('[itemscope][itemtype="https://schema.org/Person"] [itemprop="name"]'),
      authorAvatar: el.querySelector('[itemscope][itemtype="https://schema.org/Person"] img')?.getAttribute('src') || '',
      category: text('[itemprop="articleSection"]'),
      date: text('[itemprop="datePublished"]'),
      mono: mono.join(' | '),
    };
  });

  // Open the story in the reader to capture the body + author bio.
  let body = '';
  let authorBio = '';
  try {
    await card.locator('h3 a').first().click();
    await page.waitForSelector('article[itemprop="articleBody"]', { timeout: 20000 });
    await page.waitForTimeout(700);
    body = await page.locator('article[itemprop="articleBody"]').first().innerHTML();
    authorBio = await page
      .locator('article[itemprop="articleBody"]')
      .first()
      .evaluate((el) => {
        const scope = el.closest('main') || document.body;
        const bio = Array.from(scope.querySelectorAll('p, span'))
          .map((n) => n.textContent.trim())
          .filter((t) => t.length > 40 && /founder|building|engineer|writer|writes|ceo/i.test(t));
        return bio[0] || '';
      });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (error) {
    console.warn(`[snapshot] could not capture body for "${meta.title}": ${error.message}`);
    try {
      await page.keyboard.press('Escape');
    } catch {
      /* ignore */
    }
    // Reload the hub to recover a clean state.
    await page.goto(startUrl, { waitUntil: 'load', timeout: 90000 });
    await page.waitForSelector('article', { timeout: 60000 });
    await page.waitForTimeout(1500);
  }

  const slug =
    (meta.href.split('/blogs/')[1] || meta.href.split('#')[1] || '')
      .split(/[?#]/)[0]
      .trim() ||
    meta.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const readTime = (meta.mono.match(/\d+\s*min read/i) || [''])[0];

  // Strip the leading "<h1>By Author | Role</h1>" byline from the captured body:
  // the page adds a proper byline of its own.
  const cleanBody = body.replace(/^<div class="blog-rich-body">\s*<h1>[\s\S]*?<\/h1>/i, '<div class="blog-rich-body">');

  posts.push({
    slug,
    title: meta.title,
    excerpt: toExcerpt(cleanBody) || meta.excerpt,
    body: cleanBody,
    author: meta.author || 'Tanaka Gaadzikwa',
    authorBio: authorBio.replace(/^[\d\s|]+/, '').trim(),
    authorAvatar: materialiseAsset(meta.authorAvatar, `${slug}-avatar`),
    category: meta.category || 'General',
    publishedDate: meta.date,
    readTime: readTime || '3 min read',
    imageUrl: materialiseAsset(meta.cover, `${slug}-cover`),
    imageVariants: null,
    sourceUrl: new URL(meta.href || '/blogs', startUrl).toString(),
  });

  console.log(`[snapshot] ${slug} - ${body.length} bytes of body`);
}

await browser.close();

if (posts.length === 0) {
  console.error('[snapshot] captured 0 stories - keeping the existing snapshot untouched.');
  process.exit(1);
}

// Prune cover/avatar files that no longer belong to any story. Only safe when
// every captured story has its picture, otherwise a partial capture would delete
// images that are still referenced by the committed snapshot.
try {
  const complete = posts.every((post) => post.imageUrl);
  if (!complete) throw new Error('incomplete capture - skipping prune');
  const keep = new Set(
    posts
      .flatMap((post) => [post.imageUrl, post.authorAvatar])
      .filter((url) => url && url.startsWith('/blogs/'))
      .map((url) => path.basename(url))
  );
  for (const file of fs.existsSync(publicBlogDir) ? fs.readdirSync(publicBlogDir) : []) {
    if (!keep.has(file)) fs.rmSync(path.join(publicBlogDir, file), { force: true });
  }
} catch {
  // pruning is best-effort
}

// Compare only the stories themselves: an unchanged set must produce a
// byte-identical file, so the CI job can skip committing and avoid pointless
// deployments.
let existing = null;
try {
  existing = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : null;
} catch {
  existing = null;
}

const unchanged = existing && JSON.stringify(existing.posts) === JSON.stringify(posts);

if (unchanged) {
  console.log('[snapshot] no story changes - snapshot already up to date.');
} else {
  const payload = { generatedAt: new Date().toISOString(), source: startUrl, posts };
  fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`[snapshot] wrote ${posts.length} stories to ${path.relative(rootDir, outFile)}`);
}
