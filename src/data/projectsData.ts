import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'linkup',
    title: 'LINKUP',
    tagline: 'AI-powered networking & co-founder matchmaking platform for developers, designers, founders, and students.',
    category: 'AI & Founder Matchmaking Platform',
    status: 'Live Beta',
    date: '2026',
    isFlagship: true,
    summary: 'LINKUP is an AI-driven matchmaking platform created by founder Tanaka Gaadzikwa (born November 20, 2010, dubbed the "Startup Cupid" and "The Minister of AI"). Featuring an intelligent conversational assistant named Linky, it connects ambitious developers, designers, founders, and students to build startups and high-impact projects together.',
    problem: 'Early-stage founders, student builders, developers, and designers spend countless hours doing cold, low-response outreach across scattered social media. Traditional networks reward corporate resumes and vanity titles instead of actual shipping velocity, complementary skill sets, and vision alignment. For builders outside established global tech hubs, finding the right technical co-founder or design partner is the #1 hurdle.',
    solution: 'LINKUP replaces impersonal resume filtering with intelligent, intent-driven matchmaking powered by "Linky" — an AI matchmaking assistant. Linky converses with users in natural language to deeply understand their startup ideas, technical capabilities, working rhythm, and vision, then pairs complementary creators with verified intent and structured introductions.',
    targetUsers: [
      'Founders seeking technical or operational co-founders',
      'Developers looking for visionary founders or design partners',
      'Designers wanting to partner on high-conviction software products',
      'Student builders & young creators building their first startups',
      'Ambitious creators across Africa and worldwide'
    ],
    techStack: [
      'Android (Google Play)',
      'TypeScript & React',
      'AI Assistant (Linky)',
      'Vector Semantic Matchmaking',
      'Tailwind CSS',
      'Node.js REST Engine'
    ],
    role: '15-Year-Old Founder & Chief Executive Officer (CEO)',
    keyFeatures: [
      {
        title: 'Linky — AI Matchmaking Assistant',
        description: 'An AI assistant and chatbot that converses with developers, designers, founders, and students to understand what they are building and match them with ideal partners.'
      },
      {
        title: 'The "Startup Cupid" Match Engine',
        description: 'Intelligent intent and skill alignment algorithm that pairs complimentary talent (e.g., frontend developer + backend architect, or product designer + technical founder).'
      },
      {
        title: 'Proof-of-Work Profiles',
        description: 'Highlighting actual projects, GitHub repos, live demos, and execution pace instead of corporate resumes.'
      },
      {
        title: 'Google Play Mobile & Web Access',
        description: 'Available natively on Android via the Google Play Store and as a responsive web app with lightning-fast notifications.'
      }
    ],
    architectureNotes: [
      'AI assistant "Linky" orchestrating conversational onboarding and intent extraction',
      'Available natively on Google Play Store (com.tana.linkup) and on web at linkupbuild.com',
      'Real-time partner discovery with double-opt-in privacy controls',
      'Optimized for mobile-first young founders and builders in emerging ecosystems'
    ],
    lessonsLearned: [
      'Conversational onboarding through Linky creates 3x higher engagement than static questionnaires.',
      'Founders prioritize execution speed, complementary work ethics, and mutual trust above all else.',
      'Providing an Android app on Google Play was essential for builders across Africa where mobile is primary.'
    ],
    currentStatusNote: 'Live on the Google Play Store and Web. Actively matchmaking founders, developers, designers, and students globally.',
    liveUrl: 'https://www.linkupbuild.com/',
    landingPageUrl: 'https://www.linkupbuild.com/',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.tana.linkup',
    repoUrl: 'https://github.com/tanakagaadzikwa'
  },
  {
    id: 'nestly',
    title: 'Nestly',
    tagline: 'Maternal health guide and postpartum community companion built for African healthcare contexts.',
    category: 'Digital Health & Community',
    status: 'Prototype',
    date: '2025 – 2026',
    isFlagship: false,
    summary: 'A mobile-optimized maternal support application designed to provide localized prenatal advice, emergency triage guidance, and peer reassurance in regions with uneven clinic access.',
    problem: 'Expectant mothers in Southern African urban and peri-urban centers often navigate fragmented healthcare information, long clinic queues, and isolated postpartum experiences with limited culturally relevant digital guidance.',
    solution: 'Nestly combines an offline-first trimester tracker with localized nutritional advice (utilizing indigenous grains and staples), milestone reminders, and SMS-friendly emergency check-in prompts.',
    targetUsers: [
      'First-time expectant mothers in Zimbabwe and Southern Africa',
      'Community healthcare workers coordinating maternal visits',
      'Postpartum support groups and family caregivers'
    ],
    techStack: [
      'React Native / PWA',
      'TypeScript',
      'Tailwind CSS',
      'IndexedDB Offline Storage',
      'Node.js REST API'
    ],
    role: 'Concept Designer & Frontend Developer',
    keyFeatures: [
      {
        title: 'Offline-First Care Trackers',
        description: 'Critical vital signs, clinic appointment logs, and medication reminders accessible without an active internet connection.'
      },
      {
        title: 'Localized Nutrition & Wellness',
        description: 'Dietary guidance grounded in accessible Southern African groceries and traditional postpartum recovery practices.'
      },
      {
        title: 'Community Reassurance Circles',
        description: 'Moderated peer discussion spaces indexed by pregnancy stage and location.'
      }
    ],
    lessonsLearned: [
      'Digital health tools in emerging markets must prioritize low-bandwidth, offline resiliency, and high battery efficiency.',
      'Tone of voice matters immensely: clinical jargon creates distance, while empathetic, clear terminology builds deep adoption.'
    ],
    currentStatusNote: 'Functional prototype tested with a pilot group of 25 mothers in Harare; currently gathering qualitative user feedback on notification timing and localization.',
    liveUrl: undefined
  },
  {
    id: 'gdeck',
    title: 'GDECK',
    tagline: 'Streamlined operational command dashboard for solo builders using Google Workspace.',
    category: 'Developer & Operator Tools',
    status: 'Concept',
    date: '2026',
    isFlagship: false,
    summary: 'A unified single-screen dashboard uniting Google Drive, Docs, Calendar, and Mail into a keyboard-first command bar for solo entrepreneurs.',
    problem: 'Switching between 6 browser tabs for Google Drive, Sheets, Gmail, and Calendar breaks deep work flow and introduces friction for solo operators who need to move fast.',
    solution: 'GDECK centralizes cross-service search, quick task capture, and document staging into an Alfred/Raycast-style web interface that interacts with Google Workspace APIs.',
    targetUsers: [
      'Solo startup founders managing investor relations, client comms, and documentation',
      'Freelancers and independent software developers',
      'Remote operators prioritizing keyboard shortcuts and minimal distraction'
    ],
    techStack: [
      'TypeScript',
      'React',
      'Google Workspace REST APIs',
      'OAuth 2.0 PKCE',
      'Tailwind CSS'
    ],
    role: 'Product Designer & Prototyper',
    keyFeatures: [
      {
        title: 'Unified Command Bar',
        description: 'Search across emails, meeting notes, and spreadsheets with a single keystroke (Cmd+K).'
      },
      {
        title: 'Contextual Document Stager',
        description: 'Pin active investor pitch decks, sprint tickets, and meeting agendas directly to the daily focus view.'
      }
    ],
    lessonsLearned: [
      'Google API rate limits and authorization scopes require clear user consent messaging and client-side caching to maintain responsiveness.'
    ],
    currentStatusNote: 'Architectural specifications and UI wireframes drafted. Awaiting private API alpha testing.',
    liveUrl: undefined
  }
];
