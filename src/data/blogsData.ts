import { BlogPost } from '../types';

export const PRESET_COVER_IMAGES = [
  {
    label: 'Modern Code & Matrix',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Futuristic AI & Neural Network',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Late Night Builder Workspace',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Startup Strategy & Vision',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'African Urban Tech & Innovation',
    url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Clean Minimalist Terminal',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'building-linkup-from-zimbabwe',
    slug: 'building-linkup-from-zimbabwe',
    title: 'Building LINKUP from Zimbabwe: Notes on Finding Early Believers',
    excerpt: 'Operating outside established startup hubs forces an entrepreneur to replace proximity with pure execution. Here is what I learned pitching early users and shipping product from Harare.',
    category: 'Building in Public',
    publishedDate: 'October 2026',
    readTime: '6 min read',
    likes: 42,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    author: 'Tanaka Gaadzikwa',
    authorRole: 'Founder & CEO @ LINKUP',
    authorAvatar: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp',
    isFeatured: true,
    tags: ['Startups', 'LINKUP', 'Zimbabwe', 'Founders'],
    body: `When you are building software from Harare, Zimbabwe, you do not have the luxury of walking into a coffee shop in San Francisco and running into three venture scouts or two prospective technical co-founders before lunch. In an emerging ecosystem, proximity does not exist by default. You have to manufacture your own gravity through relentless output and undeniable work.

### 1. The Proximity Illusion vs. Global Internet Leverage
For years, the standard startup advice has been "move to where the density is." While density provides serendipity, the modern web has rewritten the physics of distribution. A codebase deployed to a global edge network runs just as fast for an engineer in Berlin or Nairobi as it does for someone three blocks from Sand Hill Road.

The barrier was never the technology; the barrier was discovery and credibility. If nobody knows who you are, they assume you do not exist. This is why I started building LINKUP: not as an abstract exercise in networking theory, but because I personally felt the friction of wanting to build alongside ambitious, talented peers without having an Ivy League or Y Combinator rolodex.

> "Lack of local startup density is a forcing function to build for the world from day one."

### 2. The Reality of the First 100 User Conversations
When I began onboarding the first builders to LINKUP, I avoided automated forms. I reached out directly, scheduled calls across multiple time zones, and listened to what people were actually struggling with.

What struck me was how universal the problem is: solo founders are exhausted by the superficial nature of LinkedIn. On corporate social networks, everyone is pretending to be a Director of Something, posting engagement-bait advice, and exchanging sterile greetings. But 0-to-1 builders need to know: Can you write clean code? Do you ship on weekends? How do you react when an edge case breaks production at 11 PM?

Early-stage matchmaking is about complementary work habits and velocity, not prestige resumes.

### 3. What Building in Public Actually Accomplished
Documenting my journey publicly—sharing both the small milestones and the technical dead ends—was the single highest-ROI decision I made. It turned cold outreach into warm conversations.

When prospective users can see your GitHub commits, your thought process, and your continuous dedication, trust is established before the first hello. Authenticity is an asymmetric weapon for young founders.

We are still in the early days of LINKUP, but the conviction has only deepened. Brilliant, high-agency talent is distributed evenly across the globe. Opportunity is what needs rewiring. And that is a problem worth dedicating every waking hour to solve.`,
  },
  {
    id: 'open-mic-for-builders',
    slug: 'open-mic-for-builders',
    title: 'Open Mic for Builders: Anyone Can Now Write and Share on This Platform',
    excerpt: 'We opened up the blogs page on tanakagaadzikwa.com so any builder, designer, engineer, or student around the world can publish their story, share their projects, and reach fellow founders.',
    category: 'Community Stories',
    publishedDate: 'November 2026',
    readTime: '3 min read',
    likes: 58,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    author: 'Tanaka Gaadzikwa',
    authorRole: 'Founder & CEO @ LINKUP',
    authorAvatar: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp',
    isFeatured: true,
    tags: ['Community', 'Open Web', 'Writing', 'Ideas'],
    body: `Technology is best when it is not a one-way broadcast, but a shared canvas for ambitious creators.

Today, I am opening up the writing platform on tanakagaadzikwa.com to anyone. Whether you are building an indie SaaS, experimenting with modern LLM workflows, learning frontend development, or navigating the realities of bootstrapping from outside the traditional tech hubs—your perspective matters.

### Why We Opened This Up
1. **Unfiltered Builder Perspectives:** Most tech platforms are overwhelmed by corporate PR or SEO-farmed articles. Here, we want raw reflections from people actually writing code and shipping software.
2. **Zero Gatekeeping:** You do not need a journalism degree or an invitation code. Enter your title, upload an image or select a cover, write your body, and hit publish.
3. **Global Collaboration:** Connect your ideas directly with other builders in the LINKUP ecosystem.

### What Should You Write About?
- A technical challenge you recently overcame.
- A product teardown or UI experiment you designed.
- What it is like building software from your hometown or university.
- A bold prediction about AI or software engineering in the coming years.

Click the **"+ Write a Blog"** button at the top of the page, tell your story, and inspire the next builder who reads it!`,
  },
  {
    id: 'why-we-need-better-tools-than-linkedin',
    slug: 'why-we-need-better-tools-than-linkedin',
    title: 'Why We Need Better Tools Than LinkedIn For Early-Stage Builders',
    excerpt: 'Traditional professional networks were architected for corporate recruiting, enterprise sales, and static resumes. Here is why the 0-to-1 builder economy demands an entirely different paradigm.',
    category: 'Product Development',
    publishedDate: 'September 2026',
    readTime: '5 min read',
    likes: 36,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    author: 'Tanaka Gaadzikwa',
    authorRole: 'Founder @ LINKUP',
    authorAvatar: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp',
    isFeatured: false,
    tags: ['Product', 'LinkedIn', 'Networking', 'UX'],
    body: `LinkedIn is one of the most successful enterprise platforms ever constructed. It is fantastic for Fortune 500 talent acquisition, B2B sales pipelines, and maintaining an online professional Rolodex. However, if you are a solo developer with a prototype looking for an exceptional frontend co-founder, LinkedIn is remarkably ill-suited for the task.

### 1. The Asymmetry of Corporate Titles vs. Builder Agency
On LinkedIn, value is signaled through institutional pedigree: university names, former employers, and seniority ranks. Yet in the world of early-stage software development, institutional credentials correlate surprisingly weakly with shipping speed and grit.

A 19-year-old self-taught engineer who has built three full-stack open-source tools often has 10x more relevant velocity for a seed-stage project than an associate product manager at a multinational bank. Existing platforms hide that reality beneath job history chronology. Proof of work—live apps, commits, and problem-solving logs—is the only honest currency in startup creation.

### 2. The Death Spiral of the Unsolicited Inbound DM
Because sending a message on traditional platforms is virtually free, anyone with an active inbox is bombarded with generic sales pitches, recruiters offering irrelevant lateral roles, and vague requests to "pick your brain."

As a result, high-value builders turn off notifications or ignore their messages entirely. The signal-to-noise ratio collapses to near zero. A new platform must introduce intentionality: structured mutual opt-in, clear context, and alignment on commitment levels before a channel is opened.

### 3. Designing for Complementarity Rather Than Similarity
Algorithms designed for content consumption optimize for echo chambers: showing you people who went to your school, work in your city, or post the same hashtags. But successful founder teams are rarely clones of each other.

Great partnerships require orthogonal skills: a relentless product designer paired with a backend systems builder; an aggressive go-to-market operator paired with an AI research enthusiast. Matchmaking systems must evaluate complementary capability gaps rather than mirror images.

The next generation of global companies will not be formed in corporate break rooms. They will be formed online by people who found each other through shared ambition and complementary execution. That is the infrastructure we are building.`,
  },
  {
    id: 'practical-ai-in-2026',
    slug: 'practical-ai-in-2026',
    title: 'Practical AI in 2026: Beyond the "Wrapper" Stigma',
    excerpt: 'The debate between "foundation models" and "thin wrappers" misses the point. The real value lies in domain ergonomics, context grounding, and turning raw intelligence into reliable user workflows.',
    category: 'AI & Software',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    likes: 49,
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    author: 'Tanaka Gaadzikwa',
    authorRole: 'Founder @ LINKUP',
    authorAvatar: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp',
    isFeatured: false,
    tags: ['AI', 'LLM', 'Engineering', 'Architecture'],
    body: `Over the past two years, the term "wrapper" has been hurled as an insult across Tech Twitter and Reddit. The argument goes: if your application uses an LLM API from Google or OpenAI, you have no moat, and the next foundation model release will vaporize your business overnight. As someone writing code and shipping software with modern AI tooling in 2026, I believe this criticism is fundamentally misguided.

### 1. Electricity Was Once a "Wrapper" Too
When electric grids were first standardized, companies that built electric washing machines, sewing appliances, or refrigerators were technically just "wrapping" grid electricity in steel and motors. Did the power plants make those appliances obsolete? No. The value was in the mechanical enclosure, the specialized user interface, and the exact task execution.

Large language models are cognitive electricity. They provide raw semantic reasoning, transformation, and probabilistic inference. But a raw model cannot understand your localized user permissions, your multi-step verification pipeline, or your team’s delicate interpersonal dynamics without bespoke software scaffolding.

Intelligence is a utility. Value accrues to whoever translates that utility into high-fidelity human outcomes.

### 2. The Art of Vector Grounding and Intent Extraction
In LINKUP, we use AI not to write generic marketing copy, but to parse complex, unstructured human intent. When a founder describes: "I am building a decentralized payment gateway for informal traders and I need someone who understands offline cryptography and high-throughput databases," no simple keyword search matches that effectively.

By generating vector embeddings, validating constraints with structured JSON schemas, and applying deterministic heuristics, we transform fuzzy human descriptions into accurate, high-probability matches. The moat is in the orchestration, the proprietary data schemas, and the feedback loop of accepted introductions.

### 3. Speed of Execution as an Engineering Moat
The models will get faster, cheaper, and more capable every quarter. Instead of fighting that tide, builders should design architectures that gracefully absorb foundation model upgrades as free performance boosts.

If you focus on user delight, pristine UI responsiveness, and real problem-solving, your app becomes more valuable as the underlying intelligence evolves, not less. Build modular abstractions so foundation model advancements accelerate your product roadmap.`,
  },
  {
    id: 'building-outside-the-silicon-valley-gravity-well',
    slug: 'building-outside-the-silicon-valley-gravity-well',
    title: 'Building Outside the Silicon Valley Gravity Well: The Zimbabwean Perspective',
    excerpt: 'Operating from Harare presents distinct infrastructural and economic challenges, but it also instills a level of resourcefulness, resilience, and capital efficiency that comfortable ecosystems cannot teach.',
    category: 'Building from Zimbabwe',
    publishedDate: 'July 2026',
    readTime: '6 min read',
    likes: 64,
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    author: 'Tanaka Gaadzikwa',
    authorRole: 'Founder @ LINKUP',
    authorAvatar: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp',
    isFeatured: false,
    tags: ['Harare', 'Africa', 'Resilience', 'Bootstrapping'],
    body: `There is a romanticized idea of the Silicon Valley founder: working in an air-conditioned loft, pitching angel investors over artisan matcha, and receiving six-figure pre-seed checks on an unvalidated napkin idea. That is not our reality in Harare. And honestly, I wouldn’t trade our constraints for their comforts.

### 1. The Discipline of Real Constraints
Building technology from Zimbabwe means navigating power fluctuations, variable internet connectivity, and currency volatility. When you write code under these conditions, you build software that is inherently resilient.

You learn to write offline-first architectures, optimize every kilobyte of payload, cache aggressively, and build payment flows that can handle intermittent gateways. The software that survives in emerging markets is built like an off-road vehicle, not a fragile sports car.

### 2. Capital Efficiency as a Superpower
When capital is scarce, you do not hire 15 people to do the work of 2. You learn full-stack development, server operations, database indexing, UI design, copywriting, and customer support yourself.

This forced generalism teaches you how every piece of the startup puzzle connects. When you eventually recruit partners or expand, you have personal empathy for every role because you have done it with your own hands. Low burn rate and high individual agency create staying power when others run out of runway.

### 3. A Vision for What African Builders Can Achieve
Africa is the youngest continent on earth. The sheer volume of raw mathematical, creative, and entrepreneurial energy here is staggering. What has been missing is access to capital, global networks, and the belief that world-class software can originate from our cities.

Every line of code I write, every project I ship, and every lesson I share is dedicated to proving that geographic location is no longer an insurmountable destiny. We are building the future right here.

To every young builder working late into the night across Harare, Bulawayo, Lagos, Nairobi, and beyond: keep shipping. The world is much larger than the traditional gatekeepers, and the internet rewards those who persist.`,
  },
];

const LOCAL_STORAGE_KEY = 'tg_community_blogs_v1';
const LIKES_STORAGE_KEY = 'tg_blog_liked_ids_v1';

export function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function getStoredBlogs(): BlogPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const userBlogs: BlogPost[] = raw ? JSON.parse(raw) : [];
    
    // Read persisted like counts from local storage
    const likesRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    const likesMap: Record<string, number> = likesRaw ? JSON.parse(likesRaw) : {};

    // Combine user blogs (at the top) with initial posts
    const combined = [...userBlogs, ...INITIAL_BLOG_POSTS];
    
    // Apply any updated like counts
    return combined.map((post) => {
      if (likesMap[post.id] !== undefined) {
        return { ...post, likes: post.likes + likesMap[post.id] };
      }
      return post;
    });
  } catch (err) {
    console.error('Failed to parse stored blogs', err);
    return INITIAL_BLOG_POSTS;
  }
}

export function saveNewBlog(input: {
  title: string;
  excerpt?: string;
  body: string;
  imageUrl?: string;
  author?: string;
  authorRole?: string;
  category?: string;
  tags?: string[];
}): BlogPost {
  const title = input.title.trim();
  const body = input.body.trim();
  const author = input.author?.trim() || 'Community Builder';
  const authorRole = input.authorRole?.trim() || 'Contributor';
  const category = input.category?.trim() || 'Community Stories';
  const imageUrl = input.imageUrl?.trim() || PRESET_COVER_IMAGES[0].url;
  
  // Extract or build excerpt
  const excerpt = input.excerpt?.trim() || (body.slice(0, 160) + (body.length > 160 ? '...' : ''));
  const id = `user-post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || id;

  const now = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const publishedDate = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const readTime = calculateReadTime(body);

  const newPost: BlogPost = {
    id,
    slug,
    title,
    excerpt,
    body,
    imageUrl,
    author,
    authorRole,
    category,
    publishedDate,
    readTime,
    likes: 1,
    tags: input.tags && input.tags.length > 0 ? input.tags : ['Community', category],
    isFeatured: false,
    isCommunityPost: true,
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: BlogPost[] = raw ? JSON.parse(raw) : [];
    const updated = [newPost, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('tg_blogs_updated', { detail: newPost }));
  } catch (err) {
    console.error('Failed to save community blog to localStorage', err);
  }

  return newPost;
}

export function toggleLikeBlog(id: string): { likes: number; hasLiked: boolean } {
  try {
    const userLikesKey = 'tg_user_has_liked_ids';
    const userLikesRaw = localStorage.getItem(userLikesKey);
    const hasLikedSet: string[] = userLikesRaw ? JSON.parse(userLikesRaw) : [];

    const likesRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    const likesMap: Record<string, number> = likesRaw ? JSON.parse(likesRaw) : {};

    const currentlyLiked = hasLikedSet.includes(id);

    if (currentlyLiked) {
      // Unlike
      const nextLiked = hasLikedSet.filter((item) => item !== id);
      localStorage.setItem(userLikesKey, JSON.stringify(nextLiked));
      likesMap[id] = Math.max(0, (likesMap[id] || 0) - 1);
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesMap));
      return { likes: likesMap[id] || 0, hasLiked: false };
    } else {
      // Like
      hasLikedSet.push(id);
      localStorage.setItem(userLikesKey, JSON.stringify(hasLikedSet));
      likesMap[id] = (likesMap[id] || 0) + 1;
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesMap));
      return { likes: likesMap[id] || 1, hasLiked: true };
    }
  } catch (err) {
    console.error('Failed to toggle like', err);
    return { likes: 0, hasLiked: false };
  }
}

export function hasUserLiked(id: string): boolean {
  try {
    const userLikesKey = 'tg_user_has_liked_ids';
    const userLikesRaw = localStorage.getItem(userLikesKey);
    const hasLikedSet: string[] = userLikesRaw ? JSON.parse(userLikesRaw) : [];
    return hasLikedSet.includes(id);
  } catch {
    return false;
  }
}

export function deleteCommunityBlog(id: string): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return false;
    const existing: BlogPost[] = JSON.parse(raw);
    const updated = existing.filter((post) => post.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('tg_blogs_updated'));
    return true;
  } catch (err) {
    console.error('Failed to delete blog post', err);
    return false;
  }
}
