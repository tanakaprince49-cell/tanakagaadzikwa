export type ProjectStatus = 'Live Beta' | 'Prototype' | 'Concept' | 'In Development';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  date: string;
  summary: string;
  problem: string;
  solution: string;
  targetUsers: string[];
  techStack: string[];
  role: string;
  keyFeatures: {
    title: string;
    description: string;
  }[];
  architectureNotes?: string[];
  lessonsLearned: string[];
  currentStatusNote: string;
  liveUrl?: string;
  playStoreUrl?: string;
  landingPageUrl?: string;
  repoUrl?: string;
  isFlagship?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Building in Public' | 'AI & Software' | 'Entrepreneurship' | 'Building from Zimbabwe' | 'Product Development';
  publishedDate: string;
  readTime: string;
  linkedInUrl?: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      body: string[];
      takeaway?: string;
    }[];
    conclusion: string;
  };
}

export interface BlogImageVariants {
  /** 16:9 cover - the primary image used for cards, OpenGraph and NewsArticle */
  wide?: string;
  /** 4:3 crop - Google News / Discover alternative */
  standard?: string;
  /** 1:1 crop - Google News / Discover alternative */
  square?: string;
}

export interface BlogStats {
  views: number;
  clicks: number;
  shares: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  imageVariants?: BlogImageVariants;
  stats?: BlogStats;
  author: string;
  authorSurname?: string;
  authorRole?: string;
  authorAvatar?: string;
  authorEmail?: string;
  authorBio?: string;
  authorUid?: string;
  category: string;
  publishedDate: string;
  readTime: string;
  likes: number;
  tags?: string[];
  isFeatured?: boolean;
  isCommunityPost?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  password?: string;
  createdAt: string;
}

export interface NowItem {
  category: string;
  title: string;
  description: string;
  timeframe: string;
}

