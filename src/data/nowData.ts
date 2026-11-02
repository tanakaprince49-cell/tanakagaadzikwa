export interface BuildingItem {
  title: string;
  stage: string;
  description: string;
  highlights: string[];
}

export interface LearningItem {
  topic: string;
  focus: string;
  description: string;
  resources?: string[];
}

export interface InterestArea {
  title: string;
  summary: string;
  keyQuestions: string[];
}

export const nowData = {
  lastUpdated: 'October 14, 2026',
  location: 'Harare, Zimbabwe (CAT · UTC+2)',
  statusSummary: 'Currently iterating on LINKUP beta cohort feedback, studying distributed retrieval architectures, and documenting lessons on building technology from Zimbabwe.',
  
  // Section 1: What I'm Building
  whatImBuilding: [
    {
      title: 'LINKUP Cohort Beta & Matchmaking Engine',
      stage: 'Active Beta · Q4 2026',
      description: 'Iterating on the matching algorithms and onboarding flow for LINKUP, helping ambitious solo founders and software engineers find complementary collaborators through natural-language intent parsing.',
      highlights: [
        'Refining vector semantic similarity to pair complementary skill sets (e.g. backend engineers with GTM operators)',
        'Building a 7-day micro-sprint trial framework so prospective co-founders can test communication cadence before formal equity commitments',
        'Gathering qualitative feedback from our initial cohort of builders across Southern Africa and remote tech communities'
      ]
    },
    {
      title: 'Personal Brand Platform & Technical SEO Foundation',
      stage: 'Live Production',
      description: 'Architecting and expanding this official digital home to serve as a verified credibility hub, project portfolio, and publishing archive for essays on startups and engineering.',
      highlights: [
        'Structured Schema.org JSON-LD entity validation for Google and Bing webmaster recognition',
        'Writing weekly reflections on practical software development and early-stage startup hurdles',
        'Connecting LinkedIn community discussions with canonical in-depth essays'
      ]
    },
    {
      title: 'Harare Builder & Student Developer Meetups',
      stage: 'Ongoing Community Initiative',
      description: 'Facilitating informal weekend working sessions with aspiring software developers, university students, and independent creators in Harare.',
      highlights: [
        'Encouraging peers to build public GitHub repositories and ship live URLs rather than keeping ideas on paper',
        'Sharing resources on modern TypeScript, full-stack web architectures, and cloud deployments'
      ]
    }
  ] as BuildingItem[],

  // Section 2: What I'm Learning
  whatImLearning: [
    {
      topic: 'Vector Databases & Distributed Semantic Search',
      focus: 'System Architecture & AI Retrieval',
      description: 'Exploring hybrid dense and lexical search techniques to improve intent matching accuracy while minimizing edge query latency.',
      resources: ['Vector index optimization papers', 'Cosine and inner product indexing benchmarks', 'Practical embeddings orchestration']
    },
    {
      topic: 'Resilient & Offline-First Software Architecture',
      focus: 'Full-Stack Engineering',
      description: 'Studying how to engineer high-performance web applications that gracefully handle intermittent connectivity and bandwidth constraints common in emerging markets.',
      resources: ['Local-first software patterns', 'Optimistic UI state management', 'Edge caching and payload budget controls']
    },
    {
      topic: 'Startup Finance, SAFEs & Venture Mechanics',
      focus: 'Business & Entrepreneurship',
      description: 'Deepening my understanding of company formation, cap tables, pre-seed instruments (Y Combinator Post-Money SAFEs), and unit economics to build enduring financial acumen.',
      resources: ['Venture Deals by Brad Feld & Jason Mendelson', 'Startup finance models', 'Cap table structuring guides']
    },
    {
      topic: 'Foundational Entrepreneurship Literature',
      focus: 'Books & Essays on My Desk',
      description: 'Re-reading timeless essays and books on execution velocity, managerial leverage, and creating unique competitive moats.',
      resources: [
        'Zero to One by Peter Thiel with Blake Masters (Focusing on proprietary tech & non-consensus bets)',
        'High Output Management by Andrew S. Grove (Production leverage & managerial outputs)',
        'Paul Graham Essay Archive ("Do Things That Don\'t Scale" & "Relentlessly Resourceful")'
      ]
    }
  ] as LearningItem[],

  // Section 3: Current Areas of Interest
  currentAreasOfInterest: [
    {
      title: 'Applied AI Beyond the Novelty Phase',
      summary: 'Moving beyond conversational chatbots into specialized, domain-ergonomic software tools that automate high-friction operational workflows and parse unstructured human intent.',
      keyQuestions: [
        'How can AI solve genuine human coordination bottlenecks rather than just generating filler text?',
        'Where do software builders create defensible moats when base intelligence becomes a commodity utility?'
      ]
    },
    {
      title: 'Decentralized Tech Innovation & African Builder Moats',
      summary: 'How founders operating outside Tier-1 tech hubs can transform infrastructural constraints into software resilience, extreme capital efficiency, and global internet leverage.',
      keyQuestions: [
        'How do we build sustainable global companies from Harare without relying on local venture density?',
        'What unique product advantages emerge from building in resource-constrained environments?'
      ]
    },
    {
      title: 'Proof-of-Work vs. Credential-Based Networking',
      summary: 'The transition from traditional resume networks (which reward institutional pedigrees) to verifiable builder networks (which reward shipped code, public repositories, and execution velocity).',
      keyQuestions: [
        'How can we evaluate prospective co-founders on execution grit and communication reliability before equity splits?',
        'What incentives reduce cold inbound spam while facilitating high-signal, double-opt-in collaborations?'
      ]
    }
  ] as InterestArea[],

  // Collaboration / Connection Section
  openToConnectWith: [
    'Technical co-founders, frontend engineers, and product designers interested in testing or contributing to LINKUP.',
    'Early-stage mentors and operators with experience in developer platforms, network effects, and two-sided discovery systems.',
    'Angel investors and ecosystem supporters who share conviction in the potential of African software builders.',
    'Independent builders and founders worldwide who want to exchange notes on shipping in public and capital efficiency.'
  ]
};
