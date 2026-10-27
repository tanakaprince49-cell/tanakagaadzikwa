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

export interface NowItem {
  category: string;
  title: string;
  description: string;
  timeframe: string;
}
