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

function normalizeDateToIso(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  } catch {
    // fallback
  }
  return new Date().toISOString();
}

/**
 * Enhanced Google News, Google Images & Google Discover SEO for an Individual Blog Post
 * Formats Schema.org NewsArticle & BlogPosting with complete ImageObject metadata.
 */
export function setSingleBlogSeo(post: BlogPost) {
  const origin = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://www.tanakagaadzikwa.com';
    
  const blogIdentifier = post.slug || post.id;
  const canonicalUrl = `${origin}/blogs#${blogIdentifier}`;
  const directUrl = `${origin}/blogs/${blogIdentifier}`;
  const authorUrl = `${origin}/blogs?author=${encodeURIComponent(post.author)}`;
  
  // Clean excerpt for Google search snippets (140-160 chars)
  const cleanExcerpt = post.excerpt 
    ? post.excerpt.slice(0, 160).replace(/\s+/g, ' ').trim() 
    : post.body.slice(0, 160).replace(/\s+/g, ' ').trim();

  const pageTitle = `${post.title} by ${post.author} | Tanaka Gaadzikwa`;
  const metaDescription = `Read "${post.title}" by ${post.author} in ${post.category || 'Technology'}. ${cleanExcerpt}`;
  const isoPublishedDate = normalizeDateToIso(post.publishedDate);

  // 1. Core Document Meta Tags
  document.title = pageTitle;
  updateMetaTag('name', 'description', metaDescription);
  updateMetaTag('name', 'author', post.author);
  
  // Googlebot & Google News Directives for Maximum Image and Rich Snippet Visibility
  updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'googlebot-news', 'index, follow');
  
  // Google News Keywords & Article Tags
  const keywords = `${post.author}, ${post.author} blogs, ${post.category}, ${post.title}, Tanaka Gaadzikwa, tech news Zimbabwe, AI builder, startup stories, software engineering`;
  updateMetaTag('name', 'keywords', keywords);
  updateMetaTag('name', 'news_keywords', `${post.category}, ${post.author}, Tanaka Gaadzikwa, Technology, Startups, Zimbabwe`);

  updateLinkTag('canonical', directUrl);

  // 2. OpenGraph Meta Tags (with High-Res Image Tags for Google Images & Socials)
  updateMetaTag('property', 'og:type', 'article');
  updateMetaTag('property', 'og:title', `${post.title} – by ${post.author}`);
  updateMetaTag('property', 'og:description', metaDescription);
  updateMetaTag('property', 'og:url', directUrl);
  updateMetaTag('property', 'og:site_name', 'Tanaka Gaadzikwa Blogs & News');

  const coverImageUrl = post.imageUrl || 'https://i.ibb.co/pvvN63sV/20260526-181511.webp';
  
  updateMetaTag('property', 'og:image', coverImageUrl);
  updateMetaTag('property', 'og:image:secure_url', coverImageUrl);
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '675');
  updateMetaTag('property', 'og:image:type', 'image/jpeg');
  updateMetaTag('property', 'og:image:alt', `${post.title} - Cover image by ${post.author}`);
  updateLinkTag('image_src', coverImageUrl);

  // Article Publishing Times for Google News
  updateMetaTag('property', 'article:published_time', isoPublishedDate);
  updateMetaTag('property', 'article:modified_time', isoPublishedDate);
  updateMetaTag('property', 'article:author', post.author);
  updateMetaTag('property', 'article:section', post.category || 'Technology');
  updateMetaTag('property', 'article:tag', post.category || 'General');

  // 3. Twitter / X Card Tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:site', '@TGaadzikwa');
  updateMetaTag('name', 'twitter:creator', post.author);
  updateMetaTag('name', 'twitter:title', `${post.title} – by ${post.author}`);
  updateMetaTag('name', 'twitter:description', metaDescription);
  updateMetaTag('name', 'twitter:image', coverImageUrl);
  updateMetaTag('name', 'twitter:image:alt', post.title);

  // 4. Schema.org JSON-LD Structured Data: NewsArticle + BlogPosting + ImageObject
  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': ['NewsArticle', 'BlogPosting'],
    '@id': `${directUrl}#article`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': directUrl
    },
    'headline': post.title.slice(0, 110),
    'description': metaDescription,
    'image': [
      {
        '@type': 'ImageObject',
        'url': coverImageUrl,
        'contentUrl': coverImageUrl,
        'width': 1200,
        'height': 675,
        'caption': post.title,
        'representativeOfPage': true,
        'creditText': post.author,
        'copyrightNotice': `© ${new Date().getFullYear()} Tanaka Gaadzikwa Blogs. Author: ${post.author}`,
        'license': 'https://www.tanakagaadzikwa.com/terms',
        'acquireLicensePage': 'https://www.tanakagaadzikwa.com/terms'
      },
      coverImageUrl
    ],
    'datePublished': isoPublishedDate,
    'dateModified': isoPublishedDate,
    'inLanguage': 'en-US',
    'isAccessibleForFree': 'True',
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['h1', 'article']
    },
    'author': {
      '@type': 'Person',
      '@id': `${authorUrl}#author`,
      'name': post.author,
      'image': post.authorAvatar ? {
        '@type': 'ImageObject',
        'url': post.authorAvatar,
        'caption': post.author
      } : undefined,
      'url': authorUrl,
      'jobTitle': 'Author & Contributor',
      'description': post.authorBio || `Author and creator publishing on Tanaka Gaadzikwa Blogs`,
      'worksFor': {
        '@type': 'Organization',
        'name': 'Tanaka Gaadzikwa Blogs',
        'url': 'https://www.tanakagaadzikwa.com/'
      },
      'knowsAbout': [post.category || 'Technology', 'Artificial Intelligence', 'Software Development', 'Entrepreneurship']
    },
    'publisher': {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://www.tanakagaadzikwa.com/#organization',
      'name': 'Tanaka Gaadzikwa News & Blogs',
      'url': 'https://www.tanakagaadzikwa.com/',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.tanakagaadzikwa.com/favicon-512x512.png',
        'width': 512,
        'height': 512
      },
      'publishingPrinciples': 'https://www.tanakagaadzikwa.com/terms'
    },
    'articleSection': post.category || 'Technology',
    'about': {
      '@type': 'Thing',
      'name': post.category || 'Technology'
    },
    'genre': post.category || 'Technology',
    'wordCount': post.body.trim().split(/\s+/).length,
    'articleBody': post.body
  };

  updateJsonLd('dynamic-blog-seo-ldjson', newsArticleSchema);
}

/**
 * Author Profile SEO
 * High-ranking Google Person Profile markup for any registered writer.
 */
export function setAuthorPageSeo(authorName: string, authorAvatar?: string, blogsCount: number = 0) {
  const origin = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://www.tanakagaadzikwa.com';
    
  const canonicalUrl = `${origin}/blogs?author=${encodeURIComponent(authorName)}`;
  const title = `${authorName} – Author Profile & Published Stories | Tanaka Gaadzikwa`;
  const description = `Read all ${blogsCount} articles and stories published by ${authorName} on the Tanaka Gaadzikwa open platform.`;

  document.title = title;
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'author', authorName);
  updateMetaTag('name', 'keywords', `${authorName}, ${authorName} blogs, ${authorName} author, ${authorName} profile, Tanaka Gaadzikwa, tech writing`);
  updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large');
  updateMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large');
  updateLinkTag('canonical', canonicalUrl);

  updateMetaTag('property', 'og:type', 'profile');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  if (authorAvatar) {
    updateMetaTag('property', 'og:image', authorAvatar);
    updateLinkTag('image_src', authorAvatar);
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
      'image': authorAvatar ? {
        '@type': 'ImageObject',
        'url': authorAvatar,
        'caption': authorName
      } : undefined,
      'url': canonicalUrl,
      'description': `Author with ${blogsCount} published articles on Tanaka Gaadzikwa open platform.`
    }
  };

  updateJsonLd('dynamic-blog-seo-ldjson', authorSchema);
}

/**
 * Blogs Hub & Directory SEO
 */
export function setBlogsHubSeo(blogsCount: number) {
  const origin = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://www.tanakagaadzikwa.com';
    
  const canonicalUrl = `${origin}/blogs`;
  const title = 'Blogs & News | Tanaka Gaadzikwa – Tech, AI & Startups';
  const description = `Explore stories, insights, and perspectives from Tanaka Gaadzikwa and independent builders. Software engineering, artificial intelligence, and startup essays.`;

  document.title = title;
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'keywords', 'Tanaka Gaadzikwa, Tanaka Gaadzikwa blogs, tech blogs Zimbabwe, African startups, AI builder Harare, LINKUP, open publishing, Google News tech');
  updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'googlebot-news', 'index, follow');
  updateLinkTag('canonical', canonicalUrl);

  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('property', 'og:site_name', 'Tanaka Gaadzikwa Blogs & News');
  updateMetaTag('property', 'og:image', 'https://i.ibb.co/pvvN63sV/20260526-181511.webp');
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '675');
  updateLinkTag('image_src', 'https://i.ibb.co/pvvN63sV/20260526-181511.webp');

  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:site', '@TGaadzikwa');
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', 'https://i.ibb.co/pvvN63sV/20260526-181511.webp');

  const hubSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://www.tanakagaadzikwa.com/blogs#blog',
    'name': 'Tanaka Gaadzikwa Blogs & News Hub',
    'url': 'https://www.tanakagaadzikwa.com/blogs',
    'description': description,
    'publisher': {
      '@type': 'NewsMediaOrganization',
      'name': 'Tanaka Gaadzikwa Blogs & News',
      'url': 'https://www.tanakagaadzikwa.com/',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.tanakagaadzikwa.com/favicon-512x512.png',
        'width': 512,
        'height': 512
      }
    }
  };

  updateJsonLd('dynamic-blog-seo-ldjson', hubSchema);
}

export function resetHomeSeo() {
  document.title = 'Tanaka Gaadzikwa | Young Entrepreneur, Startup Cupid & Minister of AI';
  updateMetaTag('name', 'description', "Tanaka Gaadzikwa is a Young entrepreneur, tech founder & CEO of LINKUP from Harare, Zimbabwe. Widely known as the 'Startup Cupid' and 'The Minister of AI'.");
  updateLinkTag('canonical', 'https://www.tanakagaadzikwa.com/');
  updateMetaTag('property', 'og:type', 'profile');
  updateMetaTag('property', 'og:title', 'Tanaka Gaadzikwa | Young Entrepreneur, Startup Cupid & Minister of AI');
  updateMetaTag('property', 'og:image', 'https://i.ibb.co/pvvN63sV/20260526-181511.webp');

  const existing = document.getElementById('dynamic-blog-seo-ldjson');
  if (existing) {
    existing.remove();
  }
}
