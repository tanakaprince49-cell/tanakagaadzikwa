import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { projectsData } from '../data/projectsData';
import { 
  ArrowUpRight, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Rocket, 
  Bot, 
  Users, 
  BookOpen, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Code2, 
  Lightbulb, 
  Target, 
  Award,
  Terminal,
  Activity,
  Search
} from 'lucide-react';
import { GooglePlayLogo, WhatsAppLogo, TelegramLogo, LinkedInLogo, GmailLogo, LinkupLogo } from '../components/PlatformLogos';
import { GoogleSearchSimulator } from '../components/GoogleSearchSimulator';

export const HomePage: React.FC = () => {
  const linkup = projectsData.find((p) => p.id === 'linkup') || projectsData[0];

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearchSimulatorOpen, setIsSearchSimulatorOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.honeypot) {
      setSubmitted(true);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, email, and message.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      const mailtoUrl = `mailto:tanakaprince49@gmail.com?subject=Direct Note from ${encodeURIComponent(formData.name)} (${encodeURIComponent(formData.email)})&body=${encodeURIComponent(formData.message)}`;
      window.location.href = mailtoUrl;
    }, 450);
  };

  return (
    <div className="relative w-full bg-[#0B1120] text-white overflow-hidden">
      
      {/* Cinematic Fullscreen Hero */}
      <Hero 
        onScrollDown={() => handleScrollTo('about')} 
        onNavigate={handleScrollTo} 
        onOpenSearchSimulator={() => setIsSearchSimulatorOpen(true)}
      />

      {/* 01. ABOUT ME */}
      <section id="about" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-[#0B1120]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-900/10 via-indigo-950/20 to-transparent blur-[120px] pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-14 relative z-10">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              01. About Me
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-[0.05em] leading-tight">
              Tanaka Gaadzikwa · Young Entrepreneur. Software Builder. AI Enthusiast.
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Building technology, exploring artificial intelligence, and creating opportunities from Zimbabwe.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-8 border-[#1E293B]/80 shadow-2xl shadow-[#060A17]">
            <div className="space-y-6 text-zinc-200 leading-relaxed text-base font-normal">
              <p>
                I&apos;m Tanaka Gaadzikwa (born November 20, 2010), a young entrepreneur and software builder based in Harare, Zimbabwe. I&apos;m interested in technology, artificial intelligence, and entrepreneurship, particularly how software can solve real problems and help people access opportunities they might otherwise struggle to find.
              </p>
              <p>
                My journey began with curiosity about what technology makes possible. That curiosity grew into a desire to build things myself—not just explore existing products, but develop my own ideas, experiment with emerging technologies, and turn concepts into working software.
              </p>
              <p>
                Today, my primary venture is <strong className="text-white">LINKUP</strong>, an AI-powered networking and matchmaking platform designed to help founders, developers, designers, and other ambitious people discover potential collaborators.
              </p>
              <p>
                Building a startup while continuing my education has taught me that entrepreneurship involves much more than writing code. It requires understanding people, questioning assumptions, communicating ideas, learning from feedback, and staying committed when progress is slower than expected.
              </p>
              <p>
                I&apos;m particularly interested in the intersection of AI and human collaboration: how intelligent systems can help people discover the right connections, find complementary skills, and turn ambitious ideas into meaningful projects.
              </p>
              <p>
                I believe meaningful technology can be built from anywhere. Being based in Zimbabwe is part of my story, not a boundary on what I can explore or create.
              </p>
              <p>
                I&apos;m still learning, experimenting, and developing my skills. This website documents that process: the products I build, the ideas I explore, the lessons I learn, and the ambitions that drive me forward.
              </p>
              <p>
                My long-term goal is to build sustainable technology businesses that solve meaningful problems, create opportunities, and give me the freedom to keep pursuing ambitious ideas.
              </p>
              <p className="text-sky-300 italic font-serif">
                I&apos;m not here to pretend I&apos;ve figured everything out. I&apos;m here to build, learn, and see how far execution can take me.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1E293B]/80 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" target="_blank" rel="noopener noreferrer" className="liquid-glass px-4 py-2 rounded-xl flex items-center gap-2 hover:border-white hover:scale-105 transition-all">
                <GooglePlayLogo className="w-4 h-4 shrink-0 text-white" />
                <span className="text-xs text-white font-medium">Google Play</span>
              </a>
              <a href="https://www.linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="liquid-glass px-4 py-2 rounded-xl flex items-center gap-2 hover:border-white hover:scale-105 transition-all">
                <LinkupLogo className="w-4 h-4 shrink-0 text-white" />
                <span className="text-xs text-white font-medium">LINKUP</span>
              </a>
              <a href="https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/" target="_blank" rel="noopener noreferrer" className="liquid-glass px-4 py-2 rounded-xl flex items-center gap-2 hover:border-blue-400 hover:scale-105 transition-all">
                <LinkedInLogo className="w-4 h-4 shrink-0" />
                <span className="text-xs text-white font-medium">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 02. MY JOURNEY */}
      <section id="journey" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-gradient-to-b from-[#0B1120] to-[#0D1527]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-14">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              02. My Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              From Curiosity to Building Technology
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto">
              Every builder starts somewhere. My journey is about moving from being curious about technology to learning how to create it.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-8 border-[#1E293B]/80 shadow-2xl shadow-[#060A17] text-zinc-200 leading-relaxed text-sm sm:text-base">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-white mb-2">Discovering the Possibilities of Technology</h3>
                <p>
                  My interest in technology developed around a simple question: what if I could build the things I imagine instead of only using the things other people create? Software development opened that possibility. It gave me a way to experiment with ideas, solve problems through code, and gradually understand how digital products are designed and built.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Learning by Building</h3>
                <p>
                  As I explored software development, I became increasingly interested in the process of turning ideas into applications. I started learning about development tools, programming, user interfaces, APIs, and the systems that make software work. Each project created new questions. Each technical challenge became an opportunity to learn something new. I began to understand that building software is not simply about making code run. It&apos;s about creating something that works reliably, makes sense to users, and solves a problem worth solving.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Exploring Artificial Intelligence</h3>
                <p>
                  Artificial intelligence introduced another dimension to my interests. I became interested in how AI could do more than generate text or answer questions. I wanted to explore how intelligent systems could help people discover information, make decisions, automate tasks, and connect with others. That interest became particularly relevant to LINKUP, where AI-powered discovery and matchmaking are central to the product&apos;s direction.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Building LINKUP</h3>
                <p>
                  LINKUP became my main entrepreneurial project. The idea is to help people find collaborators based on their interests, skills, ambitions, and the kinds of things they want to build. Developing the product has required me to think about software engineering, product design, AI, user experience, and the difficult question every founder must answer: why would someone actually use this?
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Learning the Business Side</h3>
                <p>
                  Building a product is only one part of entrepreneurship. A product also needs users, clear positioning, useful feedback, effective distribution, and a sustainable business model. I&apos;m learning to think beyond the code: how to explain a product, understand potential customers, test assumptions, and improve the experience based on real needs.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">What Comes Next</h3>
                <p>
                  My journey is still unfolding. I&apos;m focused on improving my technical abilities, learning from the people who use or explore my products, experimenting with AI, and understanding what it takes to build useful, sustainable software businesses. I want this website to document the journey honestly—not only the milestones, but also the questions, experiments, and lessons that make progress possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. COMPANIES & VENTURES */}
      <section id="companies" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-[#0B1120]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-16">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              03. Companies &amp; Ventures
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white">
              LINKUP
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
              Building Products That Connect Ideas With Execution.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-10 border-[#1E293B]/80 shadow-2xl shadow-[#060A17]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#1E293B]/80">
              <div className="space-y-3">
                <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-wide">
                  The Matchmaking Platform for Builders
                </h3>
                <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  {linkup.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" target="_blank" rel="noopener noreferrer" className="liquid-glass-button inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-white text-xs font-medium tracking-wide hover:scale-105 transition-all shadow-md shadow-[#060A17]" title="Google Play">
                  <GooglePlayLogo className="w-4 h-4 shrink-0 text-white" />
                  <span>Google Play</span>
                </a>
                <a href="https://www.linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="liquid-glass inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-white text-xs font-medium tracking-wide border-[#1E293B] hover:border-white hover:scale-105 transition-all" title="LINKUP">
                  <LinkupLogo className="w-4 h-4 shrink-0 text-white" />
                  <span>LINKUP</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </div>
            </div>

            <div className="space-y-8 text-zinc-200 leading-relaxed text-sm sm:text-base">
              <div className="p-6 rounded-2xl liquid-glass border-[#1E293B]/80 space-y-4">
                <h4 className="font-serif text-xl text-white font-normal">The Problem</h4>
                <p className="text-zinc-300">
                  Traditional networking often depends on existing relationships, broad professional networks, cold outreach, and the ability to get noticed in crowded online communities. Those approaches can make it difficult for people to find collaborators who share their interests and complement their abilities. LINKUP explores a different approach: helping people discover connections based on what they want to build, the skills they bring, and the opportunities they&apos;re looking for.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl liquid-glass border-[#1E293B]/80 space-y-3">
                  <h4 className="font-serif text-lg text-white">Who It&apos;s For</h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li><strong className="text-white">Founders:</strong> Discover potential collaborators who complement your skills.</li>
                    <li><strong className="text-white">Developers:</strong> Find people with ideas, projects, or technical abilities.</li>
                    <li><strong className="text-white">Designers:</strong> Connect with builders and founders who need design expertise.</li>
                    <li><strong className="text-white">Students:</strong> Explore collaboration on projects and learn with peers.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl liquid-glass border-[#1E293B]/80 space-y-3">
                  <h4 className="font-serif text-lg text-white">The Role of AI</h4>
                  <p className="text-xs text-zinc-300 text-zinc-300 leading-relaxed">
                    LINKUP explores how conversational AI can make professional discovery more intuitive. Its AI assistant, Linky, supports discovery by helping users express what they&apos;re looking for in natural language.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. PROJECTS & EXPERIMENTS */}
      <section id="projects" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-gradient-to-b from-[#0B1120] to-[#0D1527]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              04. Projects &amp; Experiments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              Exploring Ideas Through Software
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto">
              Some projects may become businesses. Others remain prototypes, technical experiments, or explorations of interesting problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-4 border-[#1E293B]/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-sky-400">AI / Networking / Venture</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">Active</span>
              </div>
              <h3 className="font-serif text-2xl text-white">LINKUP</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                My primary venture exploring how AI can help people discover potential collaborators and build meaningful professional connections through conversational discovery and matchmaking.
              </p>
              <div className="pt-2">
                <a href="https://www.linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline inline-flex items-center gap-1">
                  <span>Visit LINKUP</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-4 border-[#1E293B]/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-sky-400">Artificial Intelligence</span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono border border-purple-500/20">Ongoing</span>
              </div>
              <h3 className="font-serif text-2xl text-white">AI Experiments</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Exploring how AI systems can become useful components of software products—focusing on conversational interfaces, natural-language interactions, and practical workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05. AI & TECHNOLOGY */}
      <section id="ai-tech" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-[#0B1120]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              05. AI &amp; Technology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              Exploring What Artificial Intelligence Makes Possible
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto">
              Moving beyond AI as a novelty and exploring applications that help people accomplish useful tasks.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-8 border-[#1E293B]/80 shadow-2xl shadow-[#060A17] text-zinc-200 leading-relaxed text-sm sm:text-base">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-white mb-2">Conversational AI Agents</h3>
                <p>
                  Conversational interfaces allow people to interact with software using natural language. I&apos;m interested in how these interfaces can make complicated workflows easier to understand, how agents can help users navigate products, and how AI can support decisions without taking control away from the person using it. LINKUP&apos;s assistant, Linky, is one application of this interest.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">AI-Powered Matchmaking</h3>
                <p>
                  Professional discovery is not simply a matter of matching two people who share a keyword. Useful matchmaking may need to consider complementary skills, interests, goals, project needs, and preferences. I&apos;m interested in how AI can help interpret those signals and make discovery more relevant.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Semantic Search and Representation</h3>
                <p>
                  I&apos;m interested in the ideas behind semantic search: representing information in ways that help software identify relationships between concepts, even when the wording differs. Vector embeddings and similarity calculations help retrieve semantically related information.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Technology in Emerging Markets</h3>
                <p>
                  I&apos;m interested in building technology from Zimbabwe and other emerging markets—exploring how developers build with limited resources, how software products serve users with different levels of connectivity, and how AI can make certain capabilities more accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06. WRITING & INSIGHTS */}
      <section id="writing" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-gradient-to-b from-[#0B1120] to-[#0D1527]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              06. Writing &amp; Insights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              Ideas, Experiments, and Lessons From Building
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto">
              Documenting what I&apos;m learning about entrepreneurship, software development, artificial intelligence, and building from Zimbabwe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80">
              <h3 className="font-serif text-xl text-white">Entrepreneurship</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Exploring the practical side of building a business: identifying problems, understanding users, communicating value, and validating ideas before investing too much time.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80">
              <h3 className="font-serif text-xl text-white">Artificial Intelligence</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Examining practical AI applications, technical limitations, product decisions, and the difference between an impressive demo and a genuinely useful system.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80">
              <h3 className="font-serif text-xl text-white">Software Development</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Sharing lessons about development tools, architecture, debugging, product implementation, and moving from an idea to working software.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80">
              <h3 className="font-serif text-xl text-white">Building From Zimbabwe</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Reflecting on the experience of building outside major tech hubs—working with limited resources, learning independently, and connecting globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 07. BUILDING IN PUBLIC */}
      <section id="building-public" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-[#0B1120]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              07. Building in Public
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              Sharing the Process, Not Just the Milestones
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto">
              Documenting the work behind LINKUP, exploring AI, learning about entrepreneurship, and improving my ability to build.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-8 border-[#1E293B]/80 shadow-2xl shadow-[#060A17] text-zinc-200 leading-relaxed text-sm sm:text-base">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-white mb-2">Building and Iterating</h3>
                <p>
                  A product changes as its creator learns more about the problem and the people it serves. Features may need to be redesigned, onboarding simplified, or technical approaches reconsidered. Documenting these decisions reveals what building actually involves.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Learning From Users</h3>
                <p>
                  A product cannot be evaluated by its code alone. It also matters whether people understand it, find it useful, and have a reason to return. I want to keep improving my approach to gathering feedback and using what I learn to make better product decisions.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-white mb-2">Shipping Software</h3>
                <p>
                  Getting a product into the hands of users creates new questions: Can people understand value quickly? Do they complete onboarding? What prevents them from returning? These questions guide the work that follows a launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08. MY PHILOSOPHY */}
      <section id="philosophy" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-gradient-to-b from-[#0B1120] to-[#0D1527]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              08. My Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              The Principles Behind My Work
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto">
              Core principles guiding my approach to entrepreneurship and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">1. Action Creates Information</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Thinking is important, but action reveals things that speculation cannot. Spend less time assuming and more time gathering evidence.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">2. Small Improvements Compound</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Meaningful progress comes from repeated improvements rather than one dramatic breakthrough.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">3. Build for Real Problems</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Technology is a means, not an end. Evaluate ideas based on the problems they solve, not how impressive they sound.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">4. Geography Shouldn&apos;t Define Ambition</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Building from Harare, Zimbabwe, I use modern tools to build products for global audiences while working intelligently within constraints.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">5. Learn Before Claiming Expertise</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Stay curious, question assumptions, and be honest about what I know and what I&apos;m still learning.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">6. Distribution Matters</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                A useful product cannot help people who never discover it. Building and communicating must work together.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">7. Build With Integrity</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Judge work by what it actually does. Be honest about product limitations and respect users.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-2 border-[#1E293B]/80">
              <h3 className="font-serif text-lg text-white">8. Keep the Long Term in View</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Build businesses that can grow sustainably and create lasting value over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 09. MEDIA & RECOGNITION */}
      <section id="media" className="relative z-10 w-full py-28 lg:py-36 border-b border-[#1E293B]/60 bg-[#0B1120]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
          <div className="space-y-3 text-center max-w-3xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              09. Media &amp; Recognition
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
              Public Work, Professional Presence, and Milestones
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto">
              Sharing my work, connecting with other builders, and documenting my development as an entrepreneur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <span>Official Moniker &amp; Identity</span>
              </div>
              <h3 className="font-serif text-2xl text-white">Startup Cupid</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-white">Tanaka Gaadzikwa</strong> is widely recognized in global startup circles as <strong className="text-white">&ldquo;Startup Cupid&rdquo;</strong> for founding <strong className="text-white">LINKUP</strong>—the AI-powered co-founder matchmaking platform that connects developers, designers, and founders.
              </p>
            </div>

            <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <span>AI Leadership &amp; Innovation</span>
              </div>
              <h3 className="font-serif text-2xl text-white">The Minister of AI</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Also known as <strong className="text-white">&ldquo;The Minister of AI&rdquo;</strong>, <strong className="text-white">Tanaka Gaadzikwa</strong> specializes in building conversational AI agents, vector semantic matchmakers, and practical automated systems from Harare, Zimbabwe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CONNECT WITH ME */}
      <section id="contact" className="relative z-10 w-full py-28 lg:py-36 bg-gradient-to-b from-[#0B1120] to-[#060A17]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-16">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-300/80 drop-shadow">
              10. Connect With Me
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-[0.05em]">
              Let&apos;s Connect, Collaborate, and Build
            </h2>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              If you&apos;re a founder, developer, designer, student, mentor, or someone working on an interesting idea, I&apos;d be glad to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" target="_blank" rel="noopener noreferrer" className="liquid-glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:border-white hover:bg-[#1E293B]/60 hover:scale-105 transition-all text-center group" title="Google Play">
              <GooglePlayLogo className="w-6 h-6 text-white" />
              <span className="text-xs font-medium text-white">Google Play</span>
            </a>
            <a href="https://wa.me/263780011810" target="_blank" rel="noopener noreferrer" className="liquid-glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:border-emerald-400 hover:bg-emerald-950/30 hover:scale-105 transition-all text-center group" title="WhatsApp">
              <WhatsAppLogo className="w-6 h-6 text-white" />
              <span className="text-xs font-medium text-white">WhatsApp</span>
            </a>
            <a href="https://t.me/tanaka_93" target="_blank" rel="noopener noreferrer" className="liquid-glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:border-sky-400 hover:bg-sky-950/30 hover:scale-105 transition-all text-center group" title="Telegram">
              <TelegramLogo className="w-6 h-6 text-white" />
              <span className="text-xs font-medium text-white">Telegram</span>
            </a>
            <a href="https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/" target="_blank" rel="noopener noreferrer" className="liquid-glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:border-blue-400 hover:bg-blue-950/30 hover:scale-105 transition-all text-center group" title="LinkedIn">
              <LinkedInLogo className="w-6 h-6 text-white" />
              <span className="text-xs font-medium text-white">LinkedIn</span>
            </a>
            <a href="mailto:tanakaprince49@gmail.com" className="liquid-glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:border-red-400 hover:bg-red-950/30 hover:scale-105 transition-all text-center group" title="Email">
              <GmailLogo className="w-6 h-6 text-white" />
              <span className="text-xs font-medium text-white">Email</span>
            </a>
          </div>

          <div className="max-w-xl mx-auto">
            {submitted ? (
              <div className="liquid-glass-card p-10 rounded-3xl text-center space-y-3 border-[#1E293B]/80 shadow-2xl shadow-[#060A17]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-serif text-xl text-white">Message Dispatched</h3>
                <p className="text-xs text-zinc-300">
                  Thank you. Your message has been sent directly to Tanaka Gaadzikwa.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="liquid-glass-card p-8 rounded-3xl space-y-4 border-[#1E293B]/80 shadow-2xl shadow-[#060A17]">
                <div className="pb-1 text-center">
                  <h3 className="font-serif text-sm tracking-[0.2em] uppercase text-zinc-300">Send Direct Note</h3>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <input type="text" name="contact_honeypot" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" aria-hidden="true" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="liquid-glass-input w-full px-4 py-3 text-xs rounded-xl text-white placeholder-zinc-500 focus:outline-none transition-all duration-300" required />
                  <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="liquid-glass-input w-full px-4 py-3 text-xs rounded-xl text-white placeholder-zinc-500 focus:outline-none transition-all duration-300 font-mono" required />
                </div>

                <textarea rows={4} placeholder="Your Message..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="liquid-glass-input w-full px-4 py-3 text-xs rounded-xl text-white placeholder-zinc-500 focus:outline-none transition-all duration-300 resize-none leading-relaxed" required />

                <button type="submit" disabled={loading} className="liquid-glass-button w-full py-3.5 font-serif text-xs tracking-[0.2em] uppercase text-white disabled:opacity-50 transition-all duration-300 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#060A17]">
                  {loading ? <span>Dispatching...</span> : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <GoogleSearchSimulator isOpen={isSearchSimulatorOpen} onClose={() => setIsSearchSimulatorOpen(false)} />
    </div>
  );
};
