import { BlogPost } from '../types';
import { countWords, toPlainText } from './richText';
import {
  SITE,
  IDS,
  PERSON,
  PUBLISHER_ORG,
  ROUTES,
  FAQ_ITEMS,
  buildPageGraph,
  breadcrumbList,
  absoluteUrl,
} from '../data/siteConfig';

/* ------------------------------------------------------------------ */
/* <head> helpers                                                      */
/* ------------------------------------------------------------------ */

function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
  if (content === undefined || content === null) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function updateJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

function removeJsonLd(id: string) {
  const element = document.getElementById(id);
  if (element) element.remove();
}

function normalizeDateToIso(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  } catch {
    // fall back to now
  }
  return new Date().toISOString();
}

/** Writes the canonical, social + robots tags shared by every page. */
function applyBaseMeta(options: {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  ogType?: string;
  jsonLdId?: string;
  jsonLd?: object;
}) {
  const { path, title, description, keywords, ogType = 'website' } = options;
  const url = absoluteUrl(path);
  const image = options.image || SITE.portrait;

  document.title = title;

  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'author', SITE.name);
  if (keywords) updateMetaTag('name', 'keywords', keywords);
  updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'googlebot-news', 'index, follow');
  updateLinkTag('canonical', url);

  updateMetaTag('property', 'og:type', ogType);
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'og:site_name', SITE.siteName);
  updateMetaTag('property', 'og:locale', SITE.locale);
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('property', 'og:image:alt', `${SITE.name} - ${title}`);

  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:site', SITE.twitter);
  updateMetaTag('name', 'twitter:creator', SITE.twitter);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', image);

  if (options.jsonLd && options.jsonLdId) {
    updateJsonLd(options.jsonLdId, options.jsonLd);
  }
}

/* ------------------------------------------------------------------ */
/* Static routes                                                       */
/* ------------------------------------------------------------------ */

/** Applies the SEO for any of the static ROUTES (home, about, projects, now, blogs, contact, legal). */
export function applyPageSeo(path: string) {
  const route = ROUTES.find((r) => r.path === path) || ROUTES[0];
  removeJsonLd('dynamic-author-bio-ldjson');
  removeJsonLd('dynamic-blog-seo-ldjson');
  // The prerendered/static graph is replaced by the route-specific one below
  removeJsonLd('static-site-ldjson');

  applyBaseMeta({
    path: route.path,
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    ogType: route.schema === 'home' || route.schema === 'about' ? 'profile' : 'website',
    jsonLdId: 'dynamic-page-ldjson',
    jsonLd: buildPageGraph(route.path),
  });

  if (route.schema === 'home' || route.schema === 'about') {
    updateMetaTag('property', 'profile:first_name', PERSON.givenName);
    updateMetaTag('property', 'profile:last_name', PERSON.familyName);
    updateMetaTag('property', 'profile:username', 'tanakaprime49');
  }
}

/** Home page SEO (kept for backwards compatibility). */
export function resetHomeSeo() {
  applyPageSeo('/');
}

export const setHomeSeo = resetHomeSeo;
export const setAboutSeo = () => applyPageSeo('/about');
export const setProjectsSeo = () => applyPageSeo('/projects');
export const setNowSeo = () => applyPageSeo('/now');
export const setContactSeo = () => applyPageSeo('/contact');
export const setPrivacySeo = () => applyPageSeo('/privacy');
export const setTermsSeo = () => applyPageSeo('/terms');

/** Blogs hub - static route SEO plus the live list of published stories. */
export function setBlogsHubSeo(blogsCount: number, posts: BlogPost[] = []) {
  applyPageSeo('/blogs');

  const listNode = {
    '@type': 'ItemList',
    '@id': `${SITE.origin}/blogs#stories`,
    name: 'Latest stories on Tanaka Gaadzikwa Blogs',
    numberOfItems: blogsCount,
    itemListElement: posts.slice(0, 20).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE.origin}/blogs/${post.slug || post.id}`,
      name: post.title,
    })),
  };

  updateJsonLd('dynamic-blog-seo-ldjson', {
    '@context': 'https://schema.org',
    '@graph': [buildPageGraph('/blogs'), listNode],
  });
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                          */
/* ------------------------------------------------------------------ */

/**
 * Enhanced Google News, Google Images & Google Discover SEO for an individual blog post.
 */
export function setSingleBlogSeo(post: BlogPost) {
  const blogIdentifier = post.slug || post.id;
  const canonicalUrl = `${SITE.origin}/blogs/${blogIdentifier}`;
  const authorUrl = `${SITE.origin}/blogs?author=${encodeURIComponent(post.author)}`;

  const cleanExcerpt = post.excerpt
    ? post.excerpt.slice(0, 160).replace(/\s+/g, ' ').trim()
    : toPlainText(post.body, 160);

  const pageTitle = `${post.title} by ${post.author} | Tanaka Gaadzikwa`;
  const metaDescription = `Read "${post.title}" by ${post.author} in ${post.category || 'Technology'}. ${cleanExcerpt}`;
  const isoPublishedDate = normalizeDateToIso(post.publishedDate);
  const coverImageUrl = post.imageUrl || SITE.portrait;

  const variants = post.imageVariants || {};
  const primaryImage = variants.wide || coverImageUrl;

  applyBaseMeta({
    path: `/blogs/${blogIdentifier}`,
    title: pageTitle,
    description: metaDescription,
    keywords: `${post.title}, ${post.category}, ${(post.tags || []).join(', ')}, ${post.author}, ${post.author} blogs, Tanaka Gaadzikwa, tech news Zimbabwe, AI builder, startup stories, software engineering`,
    image: primaryImage,
    ogType: 'article',
  });

  // "Super" image SEO: explicit dimensions + every aspect ratio Google News
  // can use (16:9, 4:3, 1:1) so the story is eligible for rich image surfaces.
  updateMetaTag('property', 'og:image:secure_url', primaryImage);
  updateMetaTag('property', 'og:image:type', 'image/jpeg');
  updateMetaTag('property', 'og:image:width', '1600');
  updateMetaTag('property', 'og:image:height', '900');
  updateMetaTag('property', 'og:image:alt', `${post.title} - ${post.category} story by ${post.author}`);
  updateLinkTag('image_src', primaryImage);
  if (variants.square) updateMetaTag('name', 'twitter:image', variants.square);
  updateMetaTag('name', 'twitter:image:alt', `${post.title} - cover image`);
  updateMetaTag('itemprop', 'image', primaryImage);

  updateMetaTag('name', 'news_keywords', `${post.category}, ${post.author}, Tanaka Gaadzikwa, Technology, Startups, Zimbabwe`);
  updateMetaTag('property', 'article:published_time', isoPublishedDate);
  updateMetaTag('property', 'article:modified_time', isoPublishedDate);
  updateMetaTag('property', 'article:author', post.author);
  updateMetaTag('property', 'article:section', post.category || 'Technology');
  updateMetaTag('property', 'article:tag', post.category || 'General');

  const personNode = post.author.toLowerCase().includes('tanaka gaadzikwa')
    ? { '@id': IDS.person }
    : {
        '@type': 'Person',
        '@id': `${authorUrl}#person`,
        name: post.author,
        url: authorUrl,
        description: post.authorBio || `${post.author} is a published author on Tanaka Gaadzikwa Blogs.`,
        ...(post.authorAvatar ? { image: post.authorAvatar } : {}),
      };

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['NewsArticle', 'BlogPosting'],
        '@id': `${canonicalUrl}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        headline: post.title.slice(0, 110),
        description: metaDescription,
        image: [
          {
            '@type': 'ImageObject',
            '@id': `${canonicalUrl}#primaryimage`,
            url: primaryImage,
            contentUrl: primaryImage,
            thumbnailUrl: variants.square || primaryImage,
            width: 1600,
            height: 900,
            caption: `${post.title} — ${post.category} story by ${post.author}`,
            name: post.title,
            representativeOfPage: true,
            creditText: post.author,
            copyrightNotice: `© ${new Date().getFullYear()} Tanaka Gaadzikwa Blogs. Author: ${post.author}`,
            license: 'https://www.tanakagaadzikwa.com/terms',
            acquireLicensePage: 'https://www.tanakagaadzikwa.com/terms',
            creator: { '@id': post.author.toLowerCase().includes('tanaka gaadzikwa') ? IDS.person : IDS.organization },
          },
          ...(variants.standard
            ? [
                {
                  '@type': 'ImageObject',
                  url: variants.standard,
                  contentUrl: variants.standard,
                  width: 900,
                  height: 675,
                  caption: `${post.title} — 4:3 crop`,
                },
              ]
            : []),
          ...(variants.square
            ? [
                {
                  '@type': 'ImageObject',
                  url: variants.square,
                  contentUrl: variants.square,
                  width: 700,
                  height: 700,
                  caption: `${post.title} — 1:1 crop`,
                },
              ]
            : []),
          primaryImage,
        ],
        thumbnailUrl: variants.square || primaryImage,
        keywords: [post.category, ...(post.tags || []), 'Tanaka Gaadzikwa'].filter(Boolean).join(', '),
        datePublished: isoPublishedDate,
        dateModified: isoPublishedDate,
        inLanguage: 'en',
        isAccessibleForFree: 'True',
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'article'] },
        author: personNode,
        publisher: PUBLISHER_ORG,
        articleSection: post.category || 'Technology',
        about: [
          { '@type': 'Thing', name: post.category || 'Technology' },
          { '@id': IDS.linkup },
        ],
        mentions: [
          { '@id': IDS.person },
          { '@id': IDS.linkup },
          { '@type': 'Thing', name: 'Artificial Intelligence' },
          { '@type': 'Place', name: 'Zimbabwe' },
        ],
        genre: post.category || 'Technology',
        wordCount: countWords(post.body),
        articleBody: toPlainText(post.body),
        isPartOf: { '@id': `${SITE.origin}/blogs#blog` },
        breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
      },
      {
        ...breadcrumbList(`/blogs/${blogIdentifier}`, post.title),
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE.origin}/blogs` },
          { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
        ],
      },
      { '@id': IDS.person },
    ],
  };

  updateJsonLd('dynamic-blog-seo-ldjson', newsArticleSchema);
}

/* ------------------------------------------------------------------ */
/* Author profiles                                                     */
/* ------------------------------------------------------------------ */

/**
 * Author profile SEO - makes the author's name + bio indexable.
 */
export function setAuthorPageSeo(
  authorName: string,
  authorAvatar?: string,
  blogsCount: number = 0,
  authorBio?: string,
  posts: Array<{ title: string; url: string; datePublished?: string }> = [],
  knowsAbout: string[] = []
) {
  const canonicalUrl = `${SITE.origin}/blogs?author=${encodeURIComponent(authorName)}`;
  const cleanBio = (authorBio || '').replace(/\s+/g, ' ').trim();
  const bioSnippet = cleanBio
    ? `${cleanBio.slice(0, 155)}${cleanBio.length > 155 ? '...' : ''}`
    : `${authorName} is a published author on Tanaka Gaadzikwa Blogs with ${blogsCount} ${
        blogsCount === 1 ? 'story' : 'stories'
      } on software, AI and startups.`;

  const title = `${authorName} – Author Bio, Profile & Published Stories | Tanaka Gaadzikwa`;
  const description = cleanBio
    ? `${authorName}: ${bioSnippet} Read all ${blogsCount} ${blogsCount === 1 ? 'article' : 'articles'} by ${authorName}.`
    : bioSnippet;

  const nameParts = authorName.trim().split(/\s+/);
  const firstName = nameParts[0] || authorName;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
  const isOwner = authorName.toLowerCase().includes('tanaka gaadzikwa');

  applyBaseMeta({
    path: `/blogs?author=${encodeURIComponent(authorName)}`,
    title,
    description,
    keywords: `${authorName}, ${authorName} bio, ${authorName} biography, ${authorName} profile, ${authorName} blogs, ${authorName} author, Tanaka Gaadzikwa`,
    image: authorAvatar,
    ogType: 'profile',
  });

  updateMetaTag('property', 'profile:first_name', firstName);
  if (lastName) updateMetaTag('property', 'profile:last_name', lastName);
  updateMetaTag('property', 'profile:username', authorName);

  const personSchema = isOwner
    ? { '@id': IDS.person }
    : {
        '@type': 'Person',
        '@id': `${canonicalUrl}#person`,
        name: authorName,
        givenName: firstName,
        ...(lastName ? { familyName: lastName } : {}),
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        description: cleanBio || bioSnippet,
        ...(authorAvatar
          ? { image: { '@type': 'ImageObject', url: authorAvatar, caption: `${authorName} profile photo` } }
          : {}),
        jobTitle: 'Writer & Contributor',
        worksFor: { '@id': IDS.organization },
        knowsAbout: knowsAbout.length ? knowsAbout : PERSON.knowsAbout,
      };

  updateJsonLd('dynamic-blog-seo-ldjson', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${canonicalUrl}#profilepage`,
        url: canonicalUrl,
        name: `${authorName} – Author Profile, Bio & Published Stories`,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': IDS.website },
        mainEntity: personSchema,
        about: personSchema,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE.origin}/blogs` },
            { '@type': 'ListItem', position: 3, name: authorName, item: canonicalUrl },
          ],
        },
        ...(posts.length
          ? {
              hasPart: {
                '@type': 'ItemList',
                name: `Stories published by ${authorName}`,
                numberOfItems: posts.length,
                itemListElement: posts.slice(0, 25).map((post, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'BlogPosting',
                    '@id': post.url,
                    url: post.url,
                    headline: post.title,
                    author: { '@id': `${canonicalUrl}#person` },
                    ...(post.datePublished ? { datePublished: post.datePublished } : {}),
                  },
                })),
              },
            }
          : {}),
      },
      { '@id': IDS.person },
      { '@id': IDS.website },
      PUBLISHER_ORG,
    ],
  });
  updateJsonLd('dynamic-author-bio-ldjson', personSchema);
}

export { SITE, IDS, PERSON, FAQ_ITEMS };
