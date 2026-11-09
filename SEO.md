# SEO & Entity Setup — tanakagaadzikwa.com

This document explains what the site now does automatically and the short list of
things that must be done outside the code (Google Search Console, external
profiles) to get the whole site indexed and to earn a knowledge panel.

---

## 1. What is automated

### Prerendered HTML for every route
The app is a React SPA. On every `npm run build` the script
`scripts/prerender.mjs` runs after `vite build` and writes a **fully populated
HTML file per route**:

| URL | File |
| --- | --- |
| `/` | `dist/index.html` |
| `/about` | `dist/about/index.html` |
| `/projects` | `dist/projects/index.html` |
| `/now` | `dist/now/index.html` |
| `/blogs` | `dist/blogs/index.html` |
| `/contact` | `dist/contact/index.html` |
| `/privacy` | `dist/privacy/index.html` |
| `/terms` | `dist/terms/index.html` |

Each file contains its own `<title>`, meta description, keywords, canonical,
robots directives, OpenGraph + Twitter cards, a self-contained schema.org
`@graph` **and real readable content with internal links** — so Google, Bing and
every non-JS crawler can index the page without executing JavaScript. React
still boots and replaces the content for human visitors.

`dist/sitemap.xml` and `dist/robots.txt` are regenerated from the same route
list, so they can never drift out of sync again.

### Structured data (schema.org)
One shared entity definition lives in `src/data/siteConfig.js` and is reused by
both the runtime (`src/utils/seo.ts`) and the prerenderer:

- `Person` — `#person`: name + given/additional/family name, all alternate
  names (Startup Cupid, The Minister of AI, Gahadzikwa spelling), birth date,
  nationality, home location, job title, `hasOccupation`, 8 photos, 9
  `knowsAbout` topics, email and **8 `sameAs` profile links**.
- `Organization` + `SoftwareApplication` — `#linkup`: URL, logo, `founder` →
  `#person`, features, Google Play listing.
- `NewsMediaOrganization` — `#organization`: the site as a publisher entity.
- `WebSite` — `#website`: with a `SearchAction` pointing at `/blogs?q={query}`
  (the blogs page reads that parameter).
- `ProfilePage` on `/` and `/about`, `CollectionPage` + `ItemList` on
  `/projects`, `Blog` on `/blogs`, `ContactPage` on `/contact`.
- `BreadcrumbList` on every route.
- `FAQPage` (7 questions) on `/` and `/about`.
- Per blog story: `NewsArticle` + `BlogPosting`, images, author `Person`,
  publisher, `articleBody`, `wordCount`, speakable spec.
- Per author profile: `ProfilePage` + `Person` with the bio as `description`
  and an `ItemList` of that author's stories.

### Crawlable internal linking
- The footer links to `/`, `/about`, `/projects`, `/now`, `/blogs`, `/contact`,
  `/privacy`, `/terms` with real `<a href>` tags on every page.
- Author names in blog cards, article pages and author banners are real links
  to `/blogs?author=…`.
- The SPA intercepts clicks for instant navigation but the HTML keeps true
  hrefs, so crawlers can follow them.

### Image SEO
- Every cover is auto-cropped to 16:9, `og:image` + `twitter:image` are set per
  page, and the home URL lists 5 portraits in the image sitemap.

---

## 2. Do these once in Google Search Console

1. **Verify the domain** at <https://search.google.com/search-console> (Domain
   property → DNS TXT record, or URL-prefix property → HTML tag).
   If you use the HTML tag method, paste the token into
   `index.html` → `<meta name="google-site-verification" content="…" />`
   (it is currently empty).
2. **Submit the sitemap**: `https://www.tanakagaadzikwa.com/sitemap.xml`.
3. **Request indexing** for `/`, `/about`, `/projects`, `/now`, `/blogs`,
   `/contact` (URL Inspection → Request Indexing). Do this for each URL once
   after deploying.
4. **Bing Webmaster Tools** → import from Google Search Console, submit the same
   sitemap.

---

## 3. What earns a knowledge panel (and what code cannot do alone)

> **The full, current, step-by-step version of this lives in
> [`entity/KNOWLEDGE-PANEL-PLAYBOOK.md`](entity/KNOWLEDGE-PANEL-PLAYBOOK.md).**
> It includes the two blocking problems found on the live Google Play listing
> (a conflicting developer name and a published home address), a verified
> Wikidata `QuickStatements` file, the canonical boilerplate bios and a press
> pitch kit. Start there.

A knowledge panel is Google's *entity* result, not a ranking result. Google
builds it when it is confident about **who the entity is**, based on:

1. **Corroboration from independent sources** — press coverage, interviews,
   podcast appearances, startup directories, event pages. Links from sites
   Google already trusts matter far more than anything on your own domain.
   Aim for 5–10 independent mentions that all spell the name the same way:
   *Tanaka Gaadzikwa*.
2. **Consistent identity everywhere** — the same name, role ("Founder & CEO of
   LINKUP"), photo and links on: X, LinkedIn, Instagram, YouTube, Telegram,
   Google Play developer page, Crunchbase, Product Hunt, GitHub, Linktree,
   Medium/Substack, and any news articles.
3. **A `sameAs` chain** — implemented (8 live profiles). Every one of those
   profiles should link back to `https://www.tanakagaadzikwa.com/`. Wikidata and
   Crunchbase slots are stubbed in `EXTRA_PROFILES` in `src/data/siteConfig.js` —
   fill them in the day those profiles are created and rebuild.
4. **A well-structured About page** — done (`/about` is a `ProfilePage` with the
   biography as visible text and as `Person.description`).
5. **An Organization entity** — LINKUP is modelled as its own entity with
   `founder` → the Person node, and its own `sameAs` (website + Google Play).

Practical next steps outside the code:

- Add the site to **Crunchbase** and **Product Hunt** for LINKUP, with Tanaka as
  founder and this website as the organisation URL.
- Make sure the Google Play developer page and the LINKUP site link to
  `tanakagaadzikwa.com`.
- Publish the same short bio (2–3 sentences) on every profile — identical
  wording helps entity consolidation.
- Keep publishing blog posts (fresh, indexable content strengthens the entity).

Knowledge panels can take weeks to months after the signals are in place; there
is no API to request one.

---

## 4. Blog stories: per-post SEO, image SEO, Google News & author analytics

### Story URLs

Every story now has a real, crawlable URL: `https://www.tanakagaadzikwa.com/blogs/<slug>`.
The Blogs hub links to them with plain `<a href>` tags, so Google discovers the
stories by following links (no JavaScript clicks needed), and the reader overlay
keeps the address bar on that URL.

### Server-rendered story pages

`api/post.js` is a serverless function (Vercel) mapped in `vercel.json`:

| URL | Rendered by |
| --- | --- |
| `/blogs/:slug` | `api/post.js` (article HTML + metadata), falls back to the app shell |
| `/sitemap-blogs.xml` | `api/blogs-sitemap.js` (all stories + `image:image` entries) |
| `/sitemap-news.xml` | `api/news-sitemap.js` (Google News, only the last 2 days) |

For a story it emits:

- `<title>`, `meta description`, `canonical`, `robots` (max-image-preview:large),
  `googlebot-news`, `news_keywords`;
- Open Graph `article` tags, `og:image` at **1600×900** with width/height/alt,
  `twitter:image` (square crop);
- JSON-LD `NewsArticle` + `BlogPosting` with an `image` array of the 16:9, 4:3 and
  1:1 crops (`ImageObject`s with width/height/caption/credit/license), byline,
  `publisher` (`NewsMediaOrganization`), `wordCount`, `articleBody`,
  `BreadcrumbList` and the `Person` author node;
- the full article text, hero image and author bio as plain HTML, so a crawler
  that does not run JavaScript still sees the story.

If the function cannot read the database at request time it serves the normal app
shell **with the story's canonical URL and a 200 status** instead of a redirect,
so the client-rendered article is still indexable.

### Static story pages (what actually runs today)

The production host publishes only the prebuilt `dist/` folder — no rewrites, no
functions — so `api/*` never runs there and a story URL would 404. To make the
stories genuinely indexable without a backend, they are snapshotted into the repo
and prerendered at build time:

```bash
npm run snapshot:blogs   # capture stories from the live site into src/data/blogSnapshot.json
npm run build            # prerender dist/blogs/<slug>/index.html + sitemaps
```

- `scripts/snapshot-blogs.mjs` opens the live site in a real browser (where
  Firestore works), captures each story's body, author, date and cover, decodes
  the base64 cover/avatar into real files under `public/blogs/`, and writes
  `src/data/blogSnapshot.json`.
- `scripts/prerender.mjs` then writes `dist/blogs/<slug>/index.html` for every
  story: full article text, hero image, byline, author bio, canonical, OG/Twitter
  tags and `NewsArticle`/`BlogPosting` JSON-LD. Verified with JavaScript disabled:
  200 status, correct `<h1>`, ~840 words of body text.

**This now happens automatically.** `.github/workflows/refresh-blog-snapshot.yml`
runs every 30 minutes (and on demand from the Actions tab): it captures the live
stories with Playwright, runs the build, and pushes the refreshed snapshot. That
push triggers the normal deploy, so a story published in the app gets its own
indexable page, sitemap entry and news entry within ~30 minutes — no manual step.

- Manual run: Actions → *Refresh blog snapshot* → **Run workflow**.
- Local run: `npm run deploy:refresh` (= `npm run snapshot:blogs && npm run build`).
- The job is safe: an empty capture never overwrites a good snapshot, unchanged
  stories produce no diff (so no pointless deploys), and the build must pass
  before anything is committed.

**One-time manual step:** the Firestore database used by the site
(`tanakagaadzikwa-ba02c`, named database `ai-studio-…`) currently rejects
server-side reads — the REST API answers `403 PERMISSION_DENIED` even though the
browser app can read it (the project enforces App Check for direct API calls).
Publish the `firestore.rules` in this repo to that database and, if you want the
serverless function to render the stories itself, disable App Check enforcement
for Cloud Firestore: Firebase Console → App Check → Cloud Firestore → *unenforce*.
Until then the story pages are rendered client-side (Google's renderer executes
the app) and everything works, just without the server-side bonus.

### What the author sees

Signed-in authors get a **My Stats** button on `/blogs`, plus view/click badges on
their own cards. The dashboard (`src/components/BlogStatsPanel.tsx`) shows total
views, clicks, shares, likes and click-through rate per story.

Counting rules (`src/data/statsData.ts`):

- a **view** = one story opened per browser session (never inflated by reloads);
- a **click** = a link clicked inside a story;
- a **share** = the share/copy-link action;
- numbers are mirrored to `localStorage` instantly and pushed to the Firestore
  `blogStats/{postId}` document as increments; the dashboard shows
  `max(local, remote)` so the author never sees numbers go backwards.

Deploy `firestore.rules` (included in this repo) so the counters can be written:
it allows public read, create/update limited to the counter fields, increases only,
and no deletes.

### Sitemaps

- `/sitemap.xml` — static, generated at build time: 10 URLs (site pages, the
  author page and every snapshotted story) with `<image:image>` entries.
- `/sitemap-blogs.xml` — static, every story + its cover/avatar images.
- `/sitemap-news.xml` — static, Google News format, last 2 days only, max 1,000 URLs.

`robots.txt` lists all three. Submit them in Search Console → Sitemaps, and add
the site to the Google News Publisher Center.

---

## 5. Handy commands

```bash
npm run build     # vite build + prerender (writes dist/*.html, sitemap, robots)
npm run lint      # tsc --noEmit
```

Quick local check that a route is crawlable without JS:

```bash
curl -s https://www.tanakagaadzikwa.com/about | grep -o "<h1[^>]*>[^<]*</h1>"
```

---

## 5. The photo library: `/press` (Google Images)

18 official photos of Tanaka Gaadzikwa live at `https://www.tanakagaadzikwa.com/press`.

The page is **unlisted**: it is not in the header menu, the footer or any page
body, so a visitor browsing the site never lands on it. Crawlers reach it
through `sitemap.xml`, `sitemap-images.xml` and the `image` array on the
`Person` node. (It has to be a real, crawlable HTML page — Google only indexes
images it can find embedded on a page it is allowed to crawl. A page that is
"hidden from humans but visible to Google" is exactly this: unlinked, indexable.)

### What each photo carries

| Layer | Where | Why it matters |
| --- | --- | --- |
| Filename | `/images/tanaka/tanaka-gaadzikwa-beanie-field-smiling.jpg` | Google reads filename tokens; `tanaka-gaadzikwa` + subject/context |
| `alt` | `<img alt="...">` | The strongest signal for what is in the frame |
| `<figcaption>` | Visible caption | Text physically attached to the image |
| Description | Paragraph under each caption | Long-form context, matched to the query |
| `ImageObject` | JSON-LD `@graph` | `contentUrl`, `caption`, `description`, `width`, `height`, `creator`, `creditText`, `copyrightNotice`, `license`, `acquireLicensePage`, `datePublished`, `keywords`, `contentLocation` |
| Dimensions | `width`/`height` attributes | Zero layout shift → better Core Web Vitals |
| `max-image-preview:large` | `robots` meta + `X-Robots-Tag` | Lets Google show full-size previews |

### Two sitemaps

- `sitemap-images.xml` — the dedicated image sitemap: one `<url>` for `/press`
  listing all 18 `<image:image>` entries with title + caption, plus the 5 home
  portraits. Announced in `robots.txt`.
- `sitemap.xml` — `/press` also carries all 18 images inline, so the images are
  discovered even if only the main sitemap is submitted.

Both are generated by `scripts/prerender.mjs` from `src/data/photoGallery.js`,
which is the single place to edit titles, alt text, captions and descriptions.

### Adding a new photo

1. Drop the optimised JPEG in `public/images/tanaka/` with a descriptive,
   hyphenated filename that starts with `tanaka-gaadzikwa-`.
2. Add an entry to `PHOTOS` in `src/data/photoGallery.js` (`file`, `width`,
   `height`, `title`, `alt`, `caption`, `description`, `keywords`, `category`).
3. `npm run build` — the page, both sitemaps and the JSON-LD update themselves.

### Making image search actually rank

Code gets the images *eligible*; these get them *chosen*:

- Search Console → **Indexing → Sitemaps** → submit
  `https://www.tanakagaadzikwa.com/sitemap-images.xml` (in addition to
  `sitemap.xml`), then **URL Inspection** → `/press` → *Request indexing*.
- Wait 1–3 weeks, then check **Performance → Search type: Image** for the
  queries the photos are appearing on and rename/rewrite the captions for the
  ones that are close but not winning.
- Get the photos **used elsewhere on the web with a credit link back** — a photo
  republished by a news site or blog, credited to `tanakagaadzikwa.com`, is the
  single strongest thing for image ranking and for the knowledge panel.
- Upload the same portraits as the profile photo on **LinkedIn, X, Crunchbase,
  Google Play developer page and Wikipedia/Wikidata if eligible** — Google
  matches faces across the entity's profiles.
