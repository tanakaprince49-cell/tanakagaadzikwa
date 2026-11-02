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

export function setSingleBlogSeo(post: BlogPost) {
  const origin = window.location.origin || 'https://www.tanakagaadzikwa.com';
  const canonicalUrl = `${origin}/blogs#${post.slug || post.id}`;
  
  // Clean excerpt for meta description (Google snippet optimal length: 140-160 chars)
  const description = post.excerpt 
    ? post.excerpt.slice(0, 160).replace(/\s+/g, ' ').trim() 
    : post.body.slice(0, 160).replace(/\s+/g, ' ').trim();

  const pageTitle = `${post.title} | Tanaka Gaadzikwa Blogs`;

  // 1. Page Title & Meta Description
  document.title = pageTitle;
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'author', post.author);
  updateMetaTag('name', 'keywords', `${post.title}, ${post.author}, ${post.category}, Tanaka Gaadzikwa, startup blog, tech Zimbabwe, software engineering`);
  updateCanonicalUrl(canonicalUrl);

  // 2. OpenGraph Meta Tags (Facebook, LinkedIn, Discord, Slack, iMessage)
  updateMetaTag('property', 'og:type', 'article');
  updateMetaTag('property', 'og:title', post.title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('property', 'og:site_name', 'Tanaka Gaadzikwa Blogs');
  
  if (post.imageUrl) {
    updateMetaTag('property', 'og:image', post.imageUrl);
    updateMetaTag('property', 'og:image:secure_url', post.imageUrl);
    updateMetaTag('property', 'og:image:alt', `${post.title} - Cover picture by ${post.author}`);
    updateMetaTag('property', 'og:image:type', 'image/jpeg');
  }

  updateMetaTag('property', 'article:published_time', post.publishedDate);
  updateMetaTag('property', 'article:author', post.author);
  updateMetaTag('property', 'article:section', post.category);

  // 3. Twitter / X Card Tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:site', '@TGaadzikwa');
  updateMetaTag('name', 'twitter:creator', '@TGaadzikwa');
  updateMetaTag('name', 'twitter:title', post.title);
  updateMetaTag('name', 'twitter:description', description);
  if (post.imageUrl) {
    updateMetaTag('name', 'twitter:image', post.imageUrl);
    updateMetaTag('name', 'twitter:image:alt', post.title);
  }

  // 4. Schema.org JSON-LD Structured Data for Google Rich Snippets & Discover
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    'headline': post.title,
    'description': description,
    'image': post.imageUrl ? [post.imageUrl] : ['https://i.ibb.co/pvvN63sV/20260526-181511.webp'],
    'datePublished': post.publishedDate,
    'dateModified': post.publishedDate,
    'inLanguage': 'en-US',
    'author': {
      '@type': 'Person',
      'name': post.author,
      'image': post.authorAvatar || undefined,
      'url': origin
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
    'articleSection': post.category,
    'wordCount': post.body.trim().split(/\s+/).length,
    'articleBody': post.body
  };

  updateJsonLd('dynamic-blog-seo-ldjson', schemaData);
}

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
