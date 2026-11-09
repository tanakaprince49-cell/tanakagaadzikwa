/**
 * Post-deploy verification for the image SEO work.
 *
 *   node scripts/verify-deploy.mjs
 *
 * Checks the LIVE site (not the local build) and prints PASS/FAIL per item.
 * Run it right after deploying, before you touch Search Console - it tells you
 * whether "Couldn't fetch" was a missing file or something else.
 */

const ORIGIN = process.env.SITE_ORIGIN || 'https://www.tanakagaadzikwa.com';

let passed = 0;
let failed = 0;

const ok = (label, detail = '') => {
  passed += 1;
  console.log(`  PASS  ${label}${detail ? ` — ${detail}` : ''}`);
};
const bad = (label, detail = '') => {
  failed += 1;
  console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
};

const get = async (path) => {
  try {
    const res = await fetch(`${ORIGIN}${path}`, {
      headers: { 'User-Agent': 'verify-deploy/1.0 (+tanakagaadzikwa.com)' },
      redirect: 'follow',
    });
    const body = res.ok ? await res.text() : '';
    return { status: res.status, body, type: res.headers.get('content-type') || '' };
  } catch (error) {
    return { status: 0, body: '', type: '', error: error.message };
  }
};

const photoFiles = [
  'tanaka-gaadzikwa-wetindey-tech-a16z-feature.jpg',
  'tanaka-gaadzikwa-building-the-future-poster.jpg',
  'tanaka-gaadzikwa-hoodie-portrait-looking-left.jpg',
  'tanaka-gaadzikwa-hoodie-front-portrait.jpg',
  'tanaka-gaadzikwa-hoodie-closeup-portrait.jpg',
  'tanaka-gaadzikwa-beanie-closeup-maize-field.jpg',
  'tanaka-gaadzikwa-fisheye-portrait-maize-field.jpg',
  'tanaka-gaadzikwa-fisheye-portrait-field.jpg',
  'tanaka-gaadzikwa-linkedin-2000-followers.jpg',
  'tanaka-gaadzikwa-beanie-field-looking-right.jpg',
  'tanaka-gaadzikwa-beanie-field-slight-smile.jpg',
  'tanaka-gaadzikwa-beanie-field-neutral.jpg',
  'tanaka-gaadzikwa-beanie-field-smiling.jpg',
  'tanaka-gaadzikwa-beanie-track-jacket-cornfield.jpg',
  'tanaka-gaadzikwa-beanie-closeup-cornfield.jpg',
  'tanaka-gaadzikwa-beanie-peace-sign-smile.jpg',
  'tanaka-gaadzikwa-beanie-moody-portrait.jpg',
  'tanaka-gaadzikwa-beanie-closeup-bright.jpg',
];

console.log(`\nVerifying ${ORIGIN}\n`);

/* 1. The sitemap Search Console could not fetch ---------------------- */
console.log('Image sitemap');
{
  const r = await get('/sitemap-images.xml');
  if (r.status !== 200) {
    bad('/sitemap-images.xml', `HTTP ${r.status || r.error} — this is what "Couldn't fetch" means`);
  } else if (!r.body.includes('image:image')) {
    bad('/sitemap-images.xml', 'returned 200 but has no <image:image> entries');
  } else {
    const n = (r.body.match(/<image:image>/g) || []).length;
    ok('/sitemap-images.xml', `${n} image entries, content-type ${r.type}`);
  }
}

/* 2. Main sitemap must also carry /press and the photos -------------- */
console.log('Main sitemap');
{
  const r = await get('/sitemap.xml');
  if (r.status !== 200) bad('/sitemap.xml', `HTTP ${r.status}`);
  else {
    const urls = (r.body.match(/<url>/g) || []).length;
    r.body.includes('/press')
      ? ok('/sitemap.xml lists /press', `${urls} URLs total`)
      : bad('/sitemap.xml missing /press', `still ${urls} URLs — old build deployed?`);
    const imgs = (r.body.match(/images\/tanaka/g) || []).length;
    imgs > 0 ? ok('/sitemap.xml carries photos', `${imgs} image refs`) : bad('/sitemap.xml has no photos');
  }
}

/* 3. robots.txt must advertise it ------------------------------------ */
console.log('robots.txt');
{
  const r = await get('/robots.txt');
  r.body.includes('sitemap-images.xml')
    ? ok('robots.txt announces sitemap-images.xml')
    : bad('robots.txt does not list sitemap-images.xml', 'old build deployed?');
}

/* 4. The gallery page ------------------------------------------------ */
console.log('Gallery page');
{
  const r = await get('/press');
  if (r.status !== 200) bad('/press', `HTTP ${r.status}`);
  else {
    const imgs = (r.body.match(/<img /g) || []).length;
    imgs >= 18 ? ok('/press', `${imgs} <img> tags server-rendered`) : bad('/press', `only ${imgs} images found`);
    r.body.includes('ImageGallery') ? ok('/press has ImageGallery schema') : bad('/press missing ImageGallery schema');
  }
}

/* 5. Every photo actually returns a JPEG ----------------------------- */
console.log(`Photo files (${photoFiles.length})`);
{
  const results = await Promise.all(
    photoFiles.map(async (file) => {
      const res = await fetch(`${ORIGIN}/images/tanaka/${file}`, { method: 'HEAD' }).catch(() => null);
      return { file, status: res ? res.status : 0, type: res ? res.headers.get('content-type') : '' };
    })
  );
  const broken = results.filter((r) => r.status !== 200);
  const wrongType = results.filter((r) => r.status === 200 && !r.type.includes('image/jpeg'));
  broken.length
    ? bad(`${broken.length} photo(s) not reachable`, broken.map((b) => `${b.file} (${b.status})`).join(', '))
    : ok('all 18 photos return 200');
  if (wrongType.length) bad('wrong content-type', wrongType.map((w) => `${w.file} (${w.type})`).join(', '));
}

/* Summary ------------------------------------------------------------ */
console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) {
  console.log('If anything above failed, the new build has not been deployed yet.');
  console.log('Run:  git push origin main   (or redeploy in Vercel), then run this again.\n');
  process.exit(1);
}
console.log('Everything is live. Now go to Search Console -> Sitemaps and re-submit');
console.log(`${ORIGIN}/sitemap-images.xml\n`);
