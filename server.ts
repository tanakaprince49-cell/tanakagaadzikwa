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

  // Vite development middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
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
