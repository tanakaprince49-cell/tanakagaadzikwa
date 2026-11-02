import { BlogPost } from '../types';

function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
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

/**
 * Super SEO for an Individual Blog Post
 * Optimized specifically so that when someone Googles either the post title OR the author's name,
 * Google immediately indexes and ranks the author and article!
 */
export function setSingleBlogSeo(post: BlogPost) {
  const origin = window.location.origin || 'https://www.tanakagaadzikwa.com';
  const canonicalUrl = `${origin}/blogs#${post.slug || post.id}`;
  const authorUrl = `${origin}/blogs?author=${encodeURIComponent(post.author)}`;
  
  // Clean excerpt for meta description (Google snippet optimal length: 140-160 chars)
  const cleanExcerpt = post.excerpt 
    ? post.excerpt.slice(0, 150).replace(/\s+/g, ' ').trim() 
    : post.body.slice(0, 150).replace(/\s+/g, ' ').trim();

  // Author-first high-ranking Google title format
  const pageTitle = `${post.title} by ${post.author} | Tanaka Gaadzikwa`;
  const metaDescription = `Read "${post.title}" by ${post.author} in ${post.category}. ${cleanExcerpt}`;

  // 1. Google Page Title & Dynamic Meta
  document.title = pageTitle;
  updateMetaTag('name', 'description', metaDescription);
  updateMetaTag('name', 'author', post.author);
  
  // Author-focused keywords so queries like "{Author Name} blogs" or "{Author Name} {Category}" rank #1
  const authorKeywords = `${post.author}, ${post.author} blogs, ${post.author} articles, ${post.author} portfolio, ${post.category}, ${post.title}, Tanaka Gaadzikwa, startup blog, tech Zimbabwe, software engineering`;
  updateMetaTag('name', 'keywords', authorKeywords);
  updateCanonicalUrl(canonicalUrl);

  // 2. OpenGraph Meta Tags (Facebook, LinkedIn, Discord, Slack, iMessage)
  updateMetaTag('property', 'og:type', 'article');
  updateMetaTag('property', 'og:title', `${post.title} – by ${post.author}`);
  updateMetaTag('property', 'og:description', metaDescription);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('property', 'og:site_name', 'Tanaka Gaadzikwa Blogs');
  
  if (post.imageUrl) {
    updateMetaTag('property', 'og:image', post.imageUrl);
    updateMetaTag('property', 'og:image:secure_url', post.imageUrl);
    updateMetaTag('property', 'og:image:alt', `${post.title} - Cover photo by ${post.author}`);
    updateMetaTag('property', 'og:image:type', 'image/jpeg');
  }

  updateMetaTag('property', 'article:published_time', post.publishedDate);
  updateMetaTag('property', 'article:author', post.author);
  updateMetaTag('property', 'article:section', post.category);
  updateMetaTag('property', 'article:tag', post.category);

  // 3. Twitter / X Card Tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:site', '@TGaadzikwa');
  updateMetaTag('name', 'twitter:creator', post.author);
  updateMetaTag('name', 'twitter:title', `${post.title} – by ${post.author}`);
  updateMetaTag('name', 'twitter:description', metaDescription);
  if (post.imageUrl) {
    updateMetaTag('name', 'twitter:image', post.imageUrl);
    updateMetaTag('name', 'twitter:image:alt', post.title);
  }

  // 4. Schema.org JSON-LD Structured Data: Author Entity & BlogPosting
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    'headline': post.title,
    'description': metaDescription,
    'image': post.imageUrl ? [post.imageUrl] : ['https://i.ibb.co/pvvN63sV/20260526-181511.webp'],
    'datePublished': post.publishedDate,
    'dateModified': post.publishedDate,
    'inLanguage': 'en-US',
    // Comprehensive Author Schema so Google recognizes the person and associates their profile
    'author': {
      '@type': 'Person',
      '@id': `${authorUrl}#author`,
      'name': post.author,
      'image': post.authorAvatar || undefined,
      'url': authorUrl,
      'jobTitle': 'Author & Creator',
      'knowsAbout': [post.category, 'Technology', 'Software Development']
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Tanaka Gaadzikwa',
      'url': 'https://www.tanakagaadzikwa.com/',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://i.ibb.co/pvvN63sV/20260526-181511.webp'
      }
    },
    // Category Recognition
    'articleSection': post.category,
    'about': {
      '@type': 'Thing',
      'name': post.category
    },
    'genre': post.category,
    'wordCount': post.body.trim().split(/\s+/).length,
    'articleBody': post.body
  };

  updateJsonLd('dynamic-blog-seo-ldjson', schemaData);
}

/**
 * Super SEO for Author Profile View
 * When someone filters blogs by an author or navigates to their author view
 */
export function setAuthorPageSeo(authorName: string, authorAvatar?: string, blogsCount: number = 0) {
  const origin = window.location.origin || 'https://www.tanakagaadzikwa.com';
  const canonicalUrl = `${origin}/blogs?author=${encodeURIComponent(authorName)}`;
  const title = `${authorName} – Blogs, Articles & Profile | Tanaka Gaadzikwa`;
  const description = `Read all ${blogsCount} blogs and articles published by ${authorName} on the Tanaka Gaadzikwa open platform.`;

  document.title = title;
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'author', authorName);
  updateMetaTag('name', 'keywords', `${authorName}, ${authorName} blogs, ${authorName} author, ${authorName} profile, Tanaka Gaadzikwa`);
  updateCanonicalUrl(canonicalUrl);

  updateMetaTag('property', 'og:type', 'profile');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  if (authorAvatar) {
    updateMetaTag('property', 'og:image', authorAvatar);
  }

  updateMetaTag('name', 'twitter:card', 'summary');
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);

  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${canonicalUrl}#profile`,
    'url': canonicalUrl,
    'name': `${authorName} Author Profile`,
    'mainEntity': {
      '@type': 'Person',
      'name': authorName,
      'image': authorAvatar || undefined,
      'url': canonicalUrl,
      'description': `Author with ${blogsCount} published articles on Tanaka Gaadzikwa open platform.`
    }
  };

  updateJsonLd('dynamic-blog-seo-ldjson', authorSchema);
}

/**
 * Super SEO for the Blogs Hub Directory
 */
export function setBlogsHubSeo(blogsCount: number) {
  const origin = window.location.origin || 'https://www.tanakagaadzikwa.com';
  const canonicalUrl = `${origin}/blogs`;
  const title = 'Blogs & Open Community | Tanaka Gaadzikwa – Tech, AI & Startups';
  const description = 'Read and publish software development, AI, entrepreneurship, and startup stories on TanakaGaadzikwa.com. Open builder platform from Harare, Zimbabwe.';

  document.title = title;
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'keywords', 'Tanaka Gaadzikwa, Tanaka Gaadzikwa blogs, tech blogs Zimbabwe, African startups, AI builder Harare, LINKUP, open publishing');
  updateCanonicalUrl(canonicalUrl);

  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('property', 'og:site_name', 'Tanaka Gaadzikwa');
  updateMetaTag('property', 'og:image', 'https://i.ibb.co/pvvN63sV/20260526-181511.webp');

  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:site', '@TGaadzikwa');
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', 'https://i.ibb.co/pvvN63sV/20260526-181511.webp');

  const hubSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://www.tanakagaadzikwa.com/blogs#blog',
    'name': 'Tanaka Gaadzikwa Blogs & Community Log',
    'url': 'https://www.tanakagaadzikwa.com/blogs',
    'description': description,
    'publisher': {
      '@type': 'Person',
      'name': 'Tanaka Gaadzikwa',
      'jobTitle': 'Founder & CEO of LINKUP, The Minister of AI, Startup Cupid',
      'url': 'https://www.tanakagaadzikwa.com/'
    }
  };

  updateJsonLd('dynamic-blog-seo-ldjson', hubSchema);
}

export function resetHomeSeo() {
  document.title = 'Tanaka Gaadzikwa | Young Entrepreneur, Startup Cupid & Minister of AI';
  updateMetaTag('name', 'description', "Tanaka Gaadzikwa is a Young entrepreneur, tech founder & CEO of LINKUP from Harare, Zimbabwe. Widely known as the 'Startup Cupid' and 'The Minister of AI'.");
  updateCanonicalUrl('https://www.tanakagaadzikwa.com/');
  updateMetaTag('property', 'og:type', 'profile');
  updateMetaTag('property', 'og:title', 'Tanaka Gaadzikwa | Young Entrepreneur, Startup Cupid & Minister of AI');
  updateMetaTag('property', 'og:image', 'https://i.ibb.co/pvvN63sV/20260526-181511.webp');

  const existing = document.getElementById('dynamic-blog-seo-ldjson');
  if (existing) {
    existing.remove();
  }
}
