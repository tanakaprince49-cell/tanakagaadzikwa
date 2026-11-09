/**
 * Single source of truth for site identity, the Tanaka Gaadzikwa entity graph
 * and every public route.
 *
 * Imported by:
 *  - src/utils/seo.ts        (runtime <head> / JSON-LD updates in the SPA)
 *  - scripts/prerender.mjs   (build-time static HTML for crawlers)
 *
 * Keep it dependency-free plain JS so both TypeScript and Node can read it.
 */

import { PHOTOS, PHOTO_LICENSE } from './photoGallery.js';

export const SITE = {
  origin: 'https://www.tanakagaadzikwa.com',
  name: 'Tanaka Gaadzikwa',
  legalName: 'Tanaka Prince Gaadzikwa',
  siteName: 'Tanaka Gaadzikwa Official Website',
  title: 'Tanaka Gaadzikwa | Young Entrepreneur, Startup Cupid & Minister of AI',
  shortTitle: 'Tanaka Gaadzikwa',
  description:
    "Tanaka Gaadzikwa is a young entrepreneur, software builder and founder & CEO of LINKUP from Harare, Zimbabwe. Widely known as the 'Startup Cupid' and 'The Minister of AI'.",
  logo: 'https://www.tanakagaadzikwa.com/favicon-512x512.png',
  logoWidth: 512,
  logoHeight: 512,
  portrait: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp',
  email: 'tanakaprince49@gmail.com',
  phone: '+263780011810',
  twitter: '@TGaadzikwa',
  locale: 'en_US',
  language: 'en',
  country: 'ZW',
  foundingLocation: 'Harare, Zimbabwe',
  foundingDate: '2024-01-01',
};

/** Absolute URL for every on-domain press photo (used by Person.image + sitemaps). */
export const PHOTO_URLS = PHOTOS.map((photo) => `${SITE.origin}${photo.src}`);

/** Stable node identifiers - referenced across every page so Google merges the entity. */
export const IDS = {
  person: `${SITE.origin}/#person`,
  website: `${SITE.origin}/#website`,
  profilePage: `${SITE.origin}/#profilepage`,
  organization: `${SITE.origin}/#organization`,
  linkup: `${SITE.origin}/#linkup`,
  faq: `${SITE.origin}/#faq`,
  image: `${SITE.origin}/#primaryimage`,
};

/**
 * The portraits that were already live on the home page. Kept as their own
 * export because the image sitemap may only list images that actually appear on
 * the URL it declares - these five do, the /press library does not.
 */
export const HOME_PORTRAITS = [
  'https://i.ibb.co/pvvN63sV/20260526-181511.webp',
  'https://i.ibb.co/sdcn3p4x/IMG-20260930-WA0001.webp',
  'https://i.ibb.co/WNGVKXg6/IMG-20260930-WA0000.webp',
  'https://i.ibb.co/DHnTYFLF/IMG-20260730-114833.webp',
  'https://i.ibb.co/BHN84Z9M/20260526-181536.webp',
  'https://i.ibb.co/DHnKZWtw/20250411-090522.webp',
  'https://i.ibb.co/Q7ww6xBh/20250411-090743.webp',
  'https://i.ibb.co/szxQw83/20250411-090734.webp',
];

/**
 * Profiles that already exist and are live. Every one of these should link back to
 * https://www.tanakagaadzikwa.com/ - that reciprocal link is what closes the loop
 * and lets Google merge them into a single person.
 */
export const BASE_SAMEAS = [
  'https://www.tanakagaadzikwa.com/',
  'https://linkupbuild.com/',
  'https://x.com/TGaadzikwa',
  'https://instagram.com/talala2694',
  'https://youtube.com/@neverletbrocook0',
  'https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/',
  'https://t.me/tanaka_93',
  'https://play.google.com/store/apps/details?id=com.tana.linkup',
];

/**
 * Identity databases that do NOT exist for Tanaka yet.
 *
 * Fill these in the moment each profile is created, then `npm run build`. Empty
 * strings are skipped by the `.filter(Boolean)` below, so the JSON-LD can never
 * point at a URL that 404s - a broken sameAs actively damages entity confidence.
 *
 * Full instructions: entity/KNOWLEDGE-PANEL-PLAYBOOK.md
 */
export const EXTRA_PROFILES = {
  // e.g. 'https://www.wikidata.org/wiki/Q123456789'
  wikidata: '',
  // e.g. 'https://www.crunchbase.com/person/tanaka-gaadzikwa'
  crunchbase: '',
  // Only when an independent editor creates a Wikipedia article - never before.
  wikipedia: '',
};

export const PERSON = {
  '@type': 'Person',
  '@id': IDS.person,
  name: 'Tanaka Gaadzikwa',
  givenName: 'Tanaka',
  additionalName: 'Prince',
  familyName: 'Gaadzikwa',
  alternateName: [
    'Tanaka Prince Gaadzikwa',
    'Prince Gaadzikwa',
    'Startup Cupid',
    'The Minister of AI',
    'Tanaka Gahadzikwa',
    'Gahadzikwa',
  ],
  disambiguatingDescription:
    'Tanaka Gaadzikwa (full name Tanaka Prince Gaadzikwa, family surname Gaadzikwa, often phonetically searched as Tanaka Gahadzikwa) is a living Zimbabwean young entrepreneur, software builder, founder and CEO of LINKUP, known as the Startup Cupid and The Minister of AI, distinct from other people named Tanaka in Zimbabwean news.',
  url: `${SITE.origin}/`,
  mainEntityOfPage: `${SITE.origin}/`,
  jobTitle: 'Young entrepreneur, Software builder & CEO of LINKUP',
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Entrepreneur & Software Developer',
    occupationLocation: { '@type': 'City', name: 'Harare' },
    skills: 'Software engineering, artificial intelligence, startup building, product design',
  },
  birthDate: '2010-11-20',
  description:
    "Tanaka Gaadzikwa (full name Tanaka Prince Gaadzikwa, born November 20, 2010) is a young entrepreneur, tech founder and CEO of LINKUP, building technology in Harare, Zimbabwe. Known globally as the 'Startup Cupid' and 'The Minister of AI'.",
  // 18 on-domain press photos first, then the original remote portraits. A full
  // image list on the Person node is one of the strongest signals Google uses to
  // attach faces to a name in image search and the knowledge panel.
  image: [...PHOTO_URLS, ...HOME_PORTRAITS],
  email: `mailto:${SITE.email}`,
  worksFor: { '@id': IDS.linkup },
  founderOf: { '@id': IDS.linkup },
  homeLocation: { '@type': 'Place', name: 'Harare, Zimbabwe' },
  address: { '@type': 'PostalAddress', addressLocality: 'Harare', addressCountry: 'ZW' },
  nationality: { '@type': 'Country', name: 'Zimbabwe' },
  knowsLanguage: ['en', 'sn'],
  knowsAbout: [
    'Entrepreneurship',
    'Artificial Intelligence',
    'Startup Cupid',
    'Minister of AI',
    'LINKUP Matchmaking',
    'Software Development',
    'Product Design',
    'African Startups',
    'Building in Zimbabwe',
  ],
  // sameAs is built from BASE_SAMEAS + EXTRA_PROFILES below so that the entity
  // graph never contains a dead link.
  sameAs: [...BASE_SAMEAS, ...Object.values(EXTRA_PROFILES).filter(Boolean)],
};

export const LINKUP_ORG = {
  '@type': ['Organization', 'SoftwareApplication'],
  '@id': IDS.linkup,
  name: 'LINKUP',
  alternateName: ['Startup Cupid', 'Linky AI', 'linkupbuild'],
  url: 'https://linkupbuild.com/',
  description:
    'LINKUP is an AI-powered networking and co-founder matchmaking platform built by Tanaka Gaadzikwa that helps founders, developers and designers discover collaborators, with the Linky AI matchmaking assistant.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android, Web',
  founder: { '@id': IDS.person },
  foundingDate: SITE.foundingDate,
  foundingLocation: { '@type': 'Place', name: 'Harare, Zimbabwe' },
  logo: {
    '@type': 'ImageObject',
    url: 'https://i.ibb.co/jvRj8cfY/logo-idea-r2-A.webp',
    caption: 'LINKUP logo',
  },
  sameAs: [
    'https://linkupbuild.com/',
    'https://play.google.com/store/apps/details?id=com.tana.linkup',
  ],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'AI co-founder matchmaking',
    'Founder, developer and designer networking',
    'Linky AI assistant',
    'Startup collaboration tools',
  ],
};

export const WEBSITE = {
  '@type': 'WebSite',
  '@id': IDS.website,
  url: `${SITE.origin}/`,
  name: SITE.siteName,
  alternateName: ['tanakagaadzikwa.com', 'Tanaka Gaadzikwa Blogs', 'Tanaka Gaadzikwa Official'],
  description:
    'Official website, biography, projects and blog of Tanaka Gaadzikwa - young entrepreneur, Startup Cupid, Minister of AI and founder of LINKUP from Harare, Zimbabwe.',
  publisher: { '@id': IDS.person },
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE.origin}/blogs?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const PUBLISHER_ORG = {
  '@type': 'NewsMediaOrganization',
  '@id': IDS.organization,
  name: 'Tanaka Gaadzikwa Official Website',
  url: `${SITE.origin}/`,
  logo: {
    '@type': 'ImageObject',
    url: SITE.logo,
    width: SITE.logoWidth,
    height: SITE.logoHeight,
  },
  founder: { '@id': IDS.person },
  sameAs: PERSON.sameAs,
  contactPoint: {
    '@type': 'ContactPoint',
    email: SITE.email,
    contactType: 'customer support',
    availableLanguage: ['English'],
  },
};

export const FAQ_ITEMS = [
  {
    q: 'Who is Tanaka Gaadzikwa?',
    a: "Tanaka Gaadzikwa is a young Zimbabwean entrepreneur, software developer and technology founder from Harare. He is the founder and CEO of LINKUP (an AI co-founder matchmaking platform) and is widely known as the 'Startup Cupid' and 'The Minister of AI'.",
  },
  {
    q: "What is Tanaka Gaadzikwa's current age and role?",
    a: 'Tanaka Gaadzikwa was born on November 20, 2010. He is a young entrepreneur, software builder and the CEO of LINKUP based in Harare, Zimbabwe.',
  },
  {
    q: 'What is Tanaka Gaadzikwa currently working on?',
    a: 'Tanaka Gaadzikwa is building and scaling LINKUP, an AI-powered co-founder and collaborator matchmaking platform available on Google Play and at linkupbuild.com, featuring the Linky AI matchmaking assistant.',
  },
  {
    q: 'Is Tanaka Gaadzikwa also spelled Tanaka Gahadzikwa?',
    a: "Automated search engines sometimes autocorrect or phonetically query 'Tanaka Gahadzikwa'. The official spelling of the LINKUP founder is Tanaka Gaadzikwa (tanakagaadzikwa.com).",
  },
  {
    q: 'What is LINKUP?',
    a: 'LINKUP is an AI-powered networking and co-founder matchmaking platform created by Tanaka Gaadzikwa, available on Google Play and at linkupbuild.com, featuring the Linky AI assistant.',
  },
  {
    q: 'Where is Tanaka Gaadzikwa based?',
    a: 'Tanaka Gaadzikwa is based in Harare, Zimbabwe, and builds technology for a global audience from there.',
  },
  {
    q: 'Does Tanaka Gaadzikwa write about AI and startups?',
    a: 'Yes. He publishes essays and stories about artificial intelligence, software engineering, entrepreneurship and building startups from Zimbabwe on tanakagaadzikwa.com/blogs.',
  },
];

/**
 * Every public route: used for the sitemap, prerendering and per-page metadata.
 * `body` is the crawlable fallback content injected into the prerendered HTML.
 */
export const ROUTES = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'weekly',
    title: SITE.title,
    description: SITE.description,
    keywords:
      'Tanaka Gaadzikwa, Tanaka Prince Gaadzikwa, Prince Gaadzikwa, Tanaka Gahadzikwa, Startup Cupid, Minister of AI, LINKUP, LINKUP Zimbabwe, young entrepreneur Zimbabwe, AI founder Harare',
    schema: 'home',
  },
  {
    path: '/about',
    priority: 0.9,
    changefreq: 'monthly',
    title: 'About Tanaka Gaadzikwa | Biography, Story & Mission',
    description:
      'The full biography of Tanaka Gaadzikwa: a young entrepreneur and software builder from Harare, Zimbabwe, founder and CEO of LINKUP, known as the Startup Cupid and The Minister of AI.',
    keywords:
      'Tanaka Gaadzikwa biography, about Tanaka Gaadzikwa, Tanaka Gaadzikwa story, who is Tanaka Gaadzikwa, LINKUP founder, Zimbabwe entrepreneur',
    schema: 'about',
  },
  {
    path: '/projects',
    priority: 0.8,
    changefreq: 'monthly',
    title: 'Projects & Ventures by Tanaka Gaadzikwa | LINKUP and more',
    description:
      'Software and ventures built by Tanaka Gaadzikwa, including LINKUP - the AI co-founder matchmaking platform with the Linky AI assistant - and other experiments in AI and product design.',
    keywords:
      'Tanaka Gaadzikwa projects, LINKUP app, Linky AI, co-founder matchmaking platform, Zimbabwe startup, software built in Zimbabwe',
    schema: 'projects',
  },
  {
    path: '/now',
    priority: 0.7,
    changefreq: 'weekly',
    title: "Now | What Tanaka Gaadzikwa is working on right now",
    description:
      'A live snapshot of what Tanaka Gaadzikwa is focused on right now: building LINKUP, studying, learning AI, and collaborating with founders and builders.',
    keywords: 'Tanaka Gaadzikwa now, what is Tanaka Gaadzikwa doing, LINKUP progress, build in public Zimbabwe',
    schema: 'now',
  },
  {
    path: '/blogs',
    priority: 1.0,
    changefreq: 'daily',
    title: 'Blogs & News | Tanaka Gaadzikwa - Tech, AI & Startups',
    description:
      'Essays and stories on software engineering, artificial intelligence and entrepreneurship by Tanaka Gaadzikwa and guest builders. Read, publish and get indexed on Google News.',
    keywords:
      'Tanaka Gaadzikwa blogs, tech blogs Zimbabwe, AI articles Africa, startup essays, Google News tech Zimbabwe',
    schema: 'blogs',
  },
  {
    path: '/press',
    priority: 0.6,
    changefreq: 'monthly',
    title: 'Tanaka Gaadzikwa Photos & Press Kit | Official Photo Library',
    description:
      'The official photo library of Tanaka Gaadzikwa: 18 high-resolution press photos of the LINKUP founder, Startup Cupid and Zimbabwean tech entrepreneur, free to use with credit.',
    image: `${SITE.origin}/images/tanaka/tanaka-gaadzikwa-beanie-field-smiling.jpg`,
    keywords:
      'Tanaka Gaadzikwa photos, Tanaka Gaadzikwa press kit, Tanaka Gaadzikwa images, Tanaka Gaadzikwa headshot, Tanaka Gaadzikwa pictures, LINKUP founder photo, young Zimbabwean entrepreneur photos, Startup Cupid photo, Minister of AI portrait, Zimbabwe tech founder gallery',
    schema: 'press',
  },
  {
    path: '/contact',
    priority: 0.7,
    changefreq: 'monthly',
    title: 'Contact Tanaka Gaadzikwa | Collaborations, Press & Speaking',
    description:
      'Get in touch with Tanaka Gaadzikwa for collaborations, press, speaking or LINKUP partnerships. Email, LinkedIn, WhatsApp, Telegram and X contact details.',
    keywords: 'contact Tanaka Gaadzikwa, Tanaka Gaadzikwa email, LINKUP contact, press Zimbabwe founder',
    schema: 'contact',
  },
  {
    path: '/privacy',
    priority: 0.5,
    changefreq: 'yearly',
    title: 'Privacy Policy | Tanaka Gaadzikwa',
    description:
      'How tanakagaadzikwa.com collects, uses and protects your data, including analytics, cookies and publishing accounts.',
    keywords: 'Tanaka Gaadzikwa privacy policy, tanakagaadzikwa privacy, data protection Zimbabwe',
    schema: 'privacy',
  },
  {
    path: '/terms',
    priority: 0.5,
    changefreq: 'yearly',
    title: 'Terms of Service | Tanaka Gaadzikwa',
    description:
      'The terms that govern your use of tanakagaadzikwa.com, publishing on the blog, and community contributions.',
    keywords: 'Tanaka Gaadzikwa terms of service, tanakagaadzikwa terms',
    schema: 'terms',
  },
];

export default {
  SITE,
  IDS,
  PERSON,
  HOME_PORTRAITS,
  LINKUP_ORG,
  WEBSITE,
  PUBLISHER_ORG,
  FAQ_ITEMS,
  ROUTES,
  PHOTOS,
  PHOTO_URLS,
};

/* ------------------------------------------------------------------ */
/* Structured-data builders (shared by the runtime and the prerenderer) */
/* ------------------------------------------------------------------ */

export const absoluteUrl = (path) => `${SITE.origin}${path === '/' ? '/' : path}`;

export function breadcrumbList(path, label) {
  const items = [{ name: 'Home', url: `${SITE.origin}/` }];
  if (path !== '/') items.push({ name: label || path.replace('/', ''), url: absoluteUrl(path) });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function webPageNode(path, route) {
  return {
    '@type': path === '/' ? ['WebPage', 'ProfilePage'] : 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: route.title,
    description: route.description,
    isPartOf: { '@id': IDS.website },
    about: { '@id': IDS.person },
    primaryImageOfPage: { '@id': IDS.image },
    inLanguage: 'en',
    breadcrumb: { '@id': `${absoluteUrl(path)}#breadcrumb` },
  };
}

const PROJECT_ITEMS = [
  {
    name: 'LINKUP',
    url: 'https://linkupbuild.com/',
    description:
      'An AI-powered co-founder and collaborator matchmaking platform with the Linky AI assistant, available on Android and the web.',
  },
  {
    name: 'LINKUP on Google Play',
    url: 'https://play.google.com/store/apps/details?id=com.tana.linkup',
    description: 'Android release of the LINKUP matchmaking app built by Tanaka Gaadzikwa.',
  },
  {
    name: 'Tanaka Gaadzikwa Blogs & News',
    url: `${SITE.origin}/blogs`,
    description: 'An open publishing platform for essays on AI, software engineering and building startups from Zimbabwe.',
  },
];

/**
 * Returns the full JSON-LD graph for a static route.
 * `routeKey` is one of the `schema` values in ROUTES.
 */
export function buildPageGraph(path) {
  const route = ROUTES.find((r) => r.path === path) || ROUTES[0];
  const primaryImageUrl = route.image || SITE.portrait;
  const graph = [
    webPageNode(path, route),
    breadcrumbList(path, route.title.split('|')[0].trim()),
    // Defines the #primaryimage node that every WebPage above points at.
    {
      '@type': 'ImageObject',
      '@id': IDS.image,
      url: primaryImageUrl,
      contentUrl: primaryImageUrl,
      caption: `${PERSON.name} - ${route.title}`,
      representativeOfPage: true,
      creator: { '@id': IDS.person },
    },
    WEBSITE,
    // Full Person definition on every route so the entity is never a dangling @id
    {
      ...PERSON,
      subjectOf: {
        '@type': 'CreativeWork',
        name: 'Biography of Tanaka Gaadzikwa',
        url: absoluteUrl('/about'),
      },
    },
    PUBLISHER_ORG,
    LINKUP_ORG,
  ];

  if (route.schema === 'home' || route.schema === 'about') {
    graph.push({
      '@type': 'ProfilePage',
      '@id': path === '/' ? IDS.profilePage : `${absoluteUrl(path)}#profilepage`,
      url: absoluteUrl(path),
      name: route.title,
      description: route.description,
      mainEntity: { '@id': IDS.person },
      about: { '@id': IDS.person },
      inLanguage: 'en',
    });
    graph.push({
      '@type': 'FAQPage',
      '@id': IDS.faq,
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  if (route.schema === 'projects') {
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${absoluteUrl('/projects')}#collection`,
      name: 'Projects by Tanaka Gaadzikwa',
      url: absoluteUrl('/projects'),
      about: { '@id': IDS.person },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: PROJECT_ITEMS.length,
        itemListElement: PROJECT_ITEMS.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: project.name,
            url: project.url,
            description: project.description,
            author: { '@id': IDS.person },
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Android, Web',
          },
        })),
      },
    });
  }

  if (route.schema === 'blogs') {
    graph.push({
      '@type': 'Blog',
      '@id': `${SITE.origin}/blogs#blog`,
      url: `${SITE.origin}/blogs`,
      name: 'Tanaka Gaadzikwa Blogs & Open Community',
      description: route.description,
      publisher: { '@id': IDS.person },
      inLanguage: 'en',
    });
  }

  if (route.schema === 'contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${absoluteUrl('/contact')}#contactpage`,
      url: absoluteUrl('/contact'),
      name: route.title,
      about: { '@id': IDS.person },
      mainEntity: {
        '@type': 'Person',
        '@id': IDS.person,
        name: PERSON.name,
        email: PERSON.email,
        sameAs: PERSON.sameAs,
      },
    });
  }

  if (route.schema === 'press') {
    graph.push({
      '@type': ['CollectionPage', 'ImageGallery'],
      '@id': `${absoluteUrl('/press')}#gallery`,
      url: absoluteUrl('/press'),
      name: `Photo library of ${PERSON.name} (${PHOTOS.length} press photos)`,
      description: route.description,
      about: { '@id': IDS.person },
      author: { '@id': IDS.person },
      creator: { '@id': IDS.person },
      copyrightHolder: { '@id': IDS.person },
      license: PHOTO_LICENSE.url,
      isPartOf: { '@id': IDS.website },
      inLanguage: 'en',
      keywords: route.keywords,
      mainEntity: {
        '@type': 'ItemList',
        name: `Official photos of ${PERSON.name}`,
        numberOfItems: PHOTOS.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: PHOTOS.map((photo, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'ImageObject',
            '@id': `${SITE.origin}${photo.src}#image`,
            contentUrl: `${SITE.origin}${photo.src}`,
            url: `${SITE.origin}${photo.src}`,
            name: photo.title,
            caption: photo.caption,
            description: photo.description,
            width: { '@type': 'QuantitativeValue', value: photo.width, unitCode: 'E37' },
            height: { '@type': 'QuantitativeValue', value: photo.height, unitCode: 'E37' },
            encodingFormat: photo.mimeType,
            uploadDate: photo.datePublished,
            datePublished: photo.datePublished,
            representativeOfPage: false,
            creator: { '@id': IDS.person },
            creditText: photo.creditText,
            copyrightNotice: photo.copyrightNotice,
            license: PHOTO_LICENSE.url,
            acquireLicensePage: absoluteUrl('/press'),
            keywords: photo.keywords.join(', '),
            contentLocation: { '@type': 'Place', name: 'Zimbabwe' },
            about: {
              '@type': 'Person',
              '@id': IDS.person,
              name: PERSON.name,
              alternateName: PERSON.alternateName,
            },
          },
        })),
      },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
