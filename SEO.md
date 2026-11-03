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
3. **A `sameAs` chain** — already implemented (8 profiles). Every one of those
   profiles should link back to `https://www.tanakagaadzikwa.com/`.
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

## 4. Handy commands

```bash
npm run build     # vite build + prerender (writes dist/*.html, sitemap, robots)
npm run lint      # tsc --noEmit
```

Quick local check that a route is crawlable without JS:

```bash
curl -s https://www.tanakagaadzikwa.com/about | grep -o "<h1[^>]*>[^<]*</h1>"
```
