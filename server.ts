import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BLOGS_FILE)) {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
}

function readJsonFile<T>(filePath: string): T {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [] as unknown as T;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDataFiles();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
  }
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '15mb' }));

  // API Endpoints for cross-device persistence

  // GET /api/blogs
  app.get('/api/blogs', (_req, res) => {
    const blogs = readJsonFile(BLOGS_FILE);
    res.json(blogs);
  });

  // POST /api/blogs
  app.post('/api/blogs', (req, res) => {
    const newPost = req.body;
    if (!newPost || !newPost.id || !newPost.title || !newPost.body) {
      return res.status(400).json({ error: 'Invalid blog data' });
    }

    const blogs: any[] = readJsonFile(BLOGS_FILE);
    const existingIndex = blogs.findIndex((b) => b.id === newPost.id);
    if (existingIndex >= 0) {
      blogs[existingIndex] = newPost;
    } else {
      blogs.unshift(newPost);
    }

    writeJsonFile(BLOGS_FILE, blogs);
    return res.status(201).json(newPost);
  });

  // DELETE /api/blogs/:id
  app.delete('/api/blogs/:id', (req, res) => {
    const { id } = req.params;
    let blogs: any[] = readJsonFile(BLOGS_FILE);
    const initialLength = blogs.length;
    blogs = blogs.filter((b) => b.id !== id);

    if (blogs.length === initialLength) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    writeJsonFile(BLOGS_FILE, blogs);
    return res.json({ success: true, id });
  });

  // POST /api/blogs/:id/like
  app.post('/api/blogs/:id/like', (req, res) => {
    const { id } = req.params;
    const { increment } = req.body; // +1 or -1
    const blogs: any[] = readJsonFile(BLOGS_FILE);
    const post = blogs.find((b) => b.id === id);

    if (post) {
      const delta = increment === -1 ? -1 : 1;
      post.likes = Math.max(0, (post.likes || 0) + delta);
      writeJsonFile(BLOGS_FILE, blogs);
      return res.json({ likes: post.likes });
    }

    return res.status(404).json({ error: 'Blog not found' });
  });

  // POST /api/auth/signup
  app.post('/api/auth/signup', (req, res) => {
    const { name, surname, email, password, avatarUrl, bio } = req.body;
    if (!name || !surname || !email || !password || !avatarUrl) {
      return res.status(400).json({ error: 'Missing required signup fields' });
    }

    const users: any[] = readJsonFile(USERS_FILE);
    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      surname: surname.trim(),
      email: normalizedEmail,
      avatarUrl: avatarUrl.trim(),
      bio: bio ? bio.trim() : '',
      passwordHash: password.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    users.push(newUser);
    writeJsonFile(USERS_FILE, users);

    const { passwordHash, ...userProfile } = newUser;
    return res.status(201).json({ user: userProfile });
  });

  // POST /api/auth/signin
  app.post('/api/auth/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users: any[] = readJsonFile(USERS_FILE);
    const normalizedEmail = email.trim().toLowerCase();
    const matched = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!matched) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    if (matched.passwordHash !== password.trim()) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const { passwordHash, ...userProfile } = matched;
    return res.json({ user: userProfile });
  });

  // GET /api/users
  app.get('/api/users', (_req, res) => {
    const users: any[] = readJsonFile(USERS_FILE);
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
    res.json(safeUsers);
  });

  // Dynamic Google Image & Web Sitemap endpoint
  app.get(['/sitemap.xml', '/api/sitemap.xml'], (_req, res) => {
    const blogs: any[] = readJsonFile(BLOGS_FILE);
    const today = new Date().toISOString().split('T')[0];

    const staticRoutes = [
      { loc: 'https://www.tanakagaadzikwa.com/', priority: '1.0', changefreq: 'daily', lastmod: today },
      { loc: 'https://www.tanakagaadzikwa.com/about', priority: '0.9', changefreq: 'weekly', lastmod: today },
      { loc: 'https://www.tanakagaadzikwa.com/projects', priority: '0.9', changefreq: 'weekly', lastmod: today },
      { loc: 'https://www.tanakagaadzikwa.com/now', priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: 'https://www.tanakagaadzikwa.com/blogs', priority: '1.0', changefreq: 'daily', lastmod: today },
      { loc: 'https://www.tanakagaadzikwa.com/contact', priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: 'https://www.tanakagaadzikwa.com/privacy', priority: '0.7', changefreq: 'monthly', lastmod: today },
      { loc: 'https://www.tanakagaadzikwa.com/terms', priority: '0.7', changefreq: 'monthly', lastmod: today },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${route.loc}</loc>\n`;
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      if (route.loc === 'https://www.tanakagaadzikwa.com/' || route.loc === 'https://www.tanakagaadzikwa.com/blogs') {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>https://i.ibb.co/pvvN63sV/20260526-181511.webp</image:loc>\n`;
        xml += `      <image:title>Tanaka Gaadzikwa - Young Entrepreneur, Startup Cupid &amp; Minister of AI</image:title>\n`;
        xml += `      <image:caption>Official portrait of Tanaka Gaadzikwa from Harare, Zimbabwe.</image:caption>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    // Dynamic blog articles & pictures
    for (const post of blogs) {
      const slug = post.slug || post.id;
      const postUrl = `https://www.tanakagaadzikwa.com/blogs/${encodeURIComponent(slug)}`;
      xml += `  <url>\n`;
      xml += `    <loc>${postUrl}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      if (post.imageUrl) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(post.imageUrl)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(post.title)} - Cover Photo</image:title>\n`;
        xml += `      <image:caption>${escapeXml(post.excerpt || post.title)} - Published by ${escapeXml(post.author)}</image:caption>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // Dedicated Google News Sitemap endpoint
  app.get(['/sitemap-news.xml', '/api/sitemap-news.xml'], (_req, res) => {
    const blogs: any[] = readJsonFile(BLOGS_FILE);
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Always include blogs hub in news sitemap
    xml += `  <url>\n`;
    xml += `    <loc>https://www.tanakagaadzikwa.com/blogs</loc>\n`;
    xml += `    <news:news>\n`;
    xml += `      <news:publication>\n`;
    xml += `        <news:name>Tanaka Gaadzikwa News &amp; Blogs</news:name>\n`;
    xml += `        <news:language>en</news:language>\n`;
    xml += `      </news:publication>\n`;
    xml += `      <news:publication_date>${today}</news:publication_date>\n`;
    xml += `      <news:title>Tanaka Gaadzikwa Blogs &amp; Technology Perspectives</news:title>\n`;
    xml += `    </news:news>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>https://i.ibb.co/pvvN63sV/20260526-181511.webp</image:loc>\n`;
    xml += `      <image:title>Tanaka Gaadzikwa Blogs &amp; News</image:title>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;

    // Include blog articles
    for (const post of blogs) {
      const slug = post.slug || post.id;
      const postUrl = `https://www.tanakagaadzikwa.com/blogs/${encodeURIComponent(slug)}`;
      xml += `  <url>\n`;
      xml += `    <loc>${postUrl}</loc>\n`;
      xml += `    <news:news>\n`;
      xml += `      <news:publication>\n`;
      xml += `        <news:name>Tanaka Gaadzikwa News &amp; Blogs</news:name>\n`;
      xml += `        <news:language>en</news:language>\n`;
      xml += `      </news:publication>\n`;
      xml += `      <news:publication_date>${today}</news:publication_date>\n`;
      xml += `      <news:title>${escapeXml(post.title)}</news:title>\n`;
      xml += `    </news:news>\n`;
      if (post.imageUrl) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(post.imageUrl)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(post.title)}</image:title>\n`;
        xml += `      <image:caption>${escapeXml(post.excerpt || post.title)}</image:caption>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // Vite development middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  // SSR / HTML template renderer with Pre-rendered Google News & SEO tags for crawlers
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);

      // Pre-render blog metadata when viewing a blog or blogs directory
      const blogs: any[] = readJsonFile(BLOGS_FILE);
      let matchedPost: any = null;

      if (url.startsWith('/blogs/')) {
        const slug = decodeURIComponent(url.replace('/blogs/', '').split('?')[0].split('#')[0]);
        matchedPost = blogs.find((b) => b.slug === slug || b.id === slug);
      }

      if (matchedPost) {
        const cleanExcerpt = escapeHtml(matchedPost.excerpt || matchedPost.body.slice(0, 160));
        const postTitle = escapeHtml(matchedPost.title);
        const authorName = escapeHtml(matchedPost.author);
        const coverImage = matchedPost.imageUrl || 'https://i.ibb.co/pvvN63sV/20260526-181511.webp';
        const directUrl = `https://www.tanakagaadzikwa.com/blogs/${matchedPost.slug || matchedPost.id}`;

        // Inject dynamic Title
        template = template.replace(
          /<title>.*?<\/title>/,
          `<title>${postTitle} by ${authorName} | Tanaka Gaadzikwa</title>`
        );

        // Inject OpenGraph, Twitter & Google News pre-rendered meta tags
        const dynamicMetaTags = `
    <!-- Google News & Discover Pre-rendered Meta Tags -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot-news" content="index, follow" />
    <meta name="news_keywords" content="${escapeHtml(matchedPost.category || 'Technology')}, ${authorName}, Tanaka Gaadzikwa, Technology, Startups" />
    <meta property="article:published_time" content="${new Date().toISOString()}" />
    <meta property="article:section" content="${escapeHtml(matchedPost.category || 'Technology')}" />
    <meta property="article:author" content="${authorName}" />
    
    <!-- OpenGraph Image & Preview Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${postTitle} – by ${authorName}" />
    <meta property="og:description" content="${cleanExcerpt}" />
    <meta property="og:url" content="${directUrl}" />
    <meta property="og:image" content="${coverImage}" />
    <meta property="og:image:secure_url" content="${coverImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="675" />
    <meta property="og:image:alt" content="${postTitle} - Cover image" />
    <link rel="image_src" href="${coverImage}" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${postTitle} – by ${authorName}" />
    <meta name="twitter:description" content="${cleanExcerpt}" />
    <meta name="twitter:image" content="${coverImage}" />
        `;

        template = template.replace('</head>', `${dynamicMetaTags}\n  </head>`);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
