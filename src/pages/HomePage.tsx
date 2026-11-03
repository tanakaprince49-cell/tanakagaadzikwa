import React, { useState, useEffect } from 'react';
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
  Search,
  Edit3,
  Clock,
  Heart,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Layers,
  MapPin,
  Calendar,
  Globe
} from 'lucide-react';
import { GooglePlayLogo, WhatsAppLogo, TelegramLogo, LinkedInLogo, GmailLogo, LinkupLogo } from '../components/PlatformLogos';
import { GoogleSearchSimulator } from '../components/GoogleSearchSimulator';
import { BlogPost, UserProfile } from '../types';
import { getStoredBlogs } from '../data/blogsData';
import { getCurrentUser } from '../data/authData';
import { WriteBlogModal } from '../components/WriteBlogModal';
import { BlogReaderModal } from '../components/BlogReaderModal';
import { AuthModal } from '../components/AuthModal';

type HeadlineSection = 
  | 'overview' 
  | 'about' 
  | 'journey' 
  | 'ventures' 
  | 'ai' 
  | 'philosophy' 
  | 'contact';

interface HomePageProps {
  onNavigateToBlogs?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToBlogs }) => {
  const linkup = projectsData.find((p) => p.id === 'linkup') || projectsData[0];

  // Active section state
  const [activeHeadline, setActiveHeadline] = useState<HeadlineSection>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['about', 'journey', 'ventures', 'companies', 'projects', 'ai', 'ai-tech', 'philosophy', 'contact'].includes(hash)) {
        if (hash === 'companies' || hash === 'projects') return 'ventures';
        if (hash === 'ai-tech') return 'ai';
        return hash as HeadlineSection;
      }
    }
    return 'overview';
  });

  // Blog and Auth state
  const [blogs, setBlogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isWriteBlogOpen, setIsWriteBlogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

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

  useEffect(() => {
    const handleUpdate = () => {
      setBlogs(getStoredBlogs());
    };
    const handleAuth = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('tg_blogs_updated', handleUpdate);
    window.addEventListener('tg_auth_changed', handleAuth);
    return () => {
      window.removeEventListener('tg_blogs_updated', handleUpdate);
      window.removeEventListener('tg_auth_changed', handleAuth);
    };
  }, []);

  // Sync hash on popstate
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['about', 'journey', 'ventures', 'companies', 'projects', 'ai', 'ai-tech', 'philosophy', 'contact'].includes(hash)) {
        if (hash === 'companies' || hash === 'projects') {
          setActiveHeadline('ventures');
        } else if (hash === 'ai-tech') {
          setActiveHeadline('ai');
        } else {
          setActiveHeadline(hash as HeadlineSection);
        }
      } else {
        setActiveHeadline('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectHeadline = (section: HeadlineSection) => {
    setActiveHeadline(section);
    if (section === 'overview') {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', `#${section}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHeroNavigate = (targetId: string) => {
    const normalized = targetId.toLowerCase();
    if (normalized === 'writing') {
      if (onNavigateToBlogs) onNavigateToBlogs();
      return;
    }
    if (normalized === 'about') selectHeadline('about');
    else if (normalized === 'journey') selectHeadline('journey');
    else if (normalized === 'companies' || normalized === 'projects') selectHeadline('ventures');
    else if (normalized === 'ai-tech' || normalized === 'ai') selectHeadline('ai');
    else if (normalized === 'philosophy' || normalized === 'media') selectHeadline('philosophy');
    else if (normalized === 'contact') selectHeadline('contact');
    else selectHeadline('overview');
  };

  const handleOpenWriteBlog = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsWriteBlogOpen(true);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.honeypot) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  const sectionsList: { id: HeadlineSection; label: string; number: string; desc: string }[] = [
    { id: 'about', label: 'About', number: '01', desc: 'Who Tanaka is, background, convictions & identity.' },
    { id: 'journey', label: 'Journey', number: '02', desc: 'From first curiosity to building scalable products in Zimbabwe.' },
    { id: 'ventures', label: 'Ventures & Projects', number: '03', desc: 'LINKUP, AI matchmaking platform & flagship software.' },
    { id: 'ai', label: 'AI & Tech', number: '04', desc: 'Conversational agents, vector search & emerging markets.' },
    { id: 'philosophy', label: 'Philosophy', number: '05', desc: 'Core principles: action creates info, Startup Cupid.' },
    { id: 'contact', label: 'Connect', number: '06', desc: 'Direct note dispatch, socials, and collaboration.' },
  ];

  return (
    <div className="relative w-full bg-[#0B1120] text-zinc-100 min-h-screen">
      
      {/* 1. CINEMATIC HERO (Shown on Overview) */}
      {activeHeadline === 'overview' && (
        <Hero
          onScrollDown={() => selectHeadline('about')}
          onNavigate={handleHeroNavigate}
          onOpenSearchSimulator={() => setIsSearchSimulatorOpen(true)}
          onNavigateToBlogs={onNavigateToBlogs}
        />
      )}


      {/* 3. OVERVIEW CHAPTER CARDS (When on Overview) */}
      {activeHeadline === 'overview' && (
        <section className="relative z-10 w-full py-16 sm:py-24 border-b border-[#1E293B]/60 bg-[#0B1120]">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-400">
                Explore Chapters
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
                Choose a Headline to Read
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Click any section below to view it individually under its own headline without continuous scrolling.
              </p>
            </div>

            {/* Chapters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionsList.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => selectHeadline(sec.id)}
                  className="liquid-glass-card rounded-2xl p-6 sm:p-7 space-y-4 border border-[#1E293B]/80 hover:border-sky-500/50 transition-all cursor-pointer group shadow-lg hover:shadow-sky-500/10 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-sky-400 font-semibold tracking-wider">
                        {sec.number}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
                        Read Headline
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-normal text-white group-hover:text-sky-300 transition-colors">
                      {sec.label}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-xs font-serif tracking-wider uppercase text-sky-400 group-hover:text-white transition-colors">
                    <span>Open Section</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Blogs Direct Highlight Card */}
            {onNavigateToBlogs && (
              <div 
                onClick={onNavigateToBlogs}
                className="liquid-glass rounded-3xl p-8 border border-sky-500/30 hover:border-sky-400 transition-all cursor-pointer shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 group"
              >
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Community Publishing &amp; Google News Indexing</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                    Blogs &amp; Perspectives Hub
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                    Read articles by Tanaka and community authors, publish your own story with custom categories and read times, and get your own verified Google &amp; Google News author profile.
                  </p>
                </div>

                <div className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-serif text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 shrink-0 group-hover:bg-sky-400 transition-colors">
                  <span>Visit Blogs</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 4. DEDICATED SECTION VIEWS (RENDERED UNDER ITS OWN HEADLINE) */}

      {/* ==================== 01. ABOUT HEADLINE ==================== */}
      {activeHeadline === 'about' && (
        <section className="relative z-10 w-full py-16 sm:py-24 bg-[#0B1120] animate-in fade-in duration-200">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]/80">
              <button
                onClick={() => selectHeadline('overview')}
                className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Return to Overview</span>
              </button>
              <button
                onClick={() => selectHeadline('journey')}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-serif uppercase tracking-wider cursor-pointer"
              >
                <span>Next: Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline Header */}
            <header className="space-y-4 text-center">
              <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-400">
                01. About Tanaka Gaadzikwa
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                Young Entrepreneur · Software Builder · AI Enthusiast
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Building technology, exploring artificial intelligence, and creating global opportunities from Harare, Zimbabwe.
              </p>
            </header>

            {/* Content Body */}
            <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-8 border-[#1E293B]/80 shadow-2xl shadow-[#060A17]">
              <div className="space-y-6 text-zinc-200 leading-relaxed text-base">
                <p>
                  I&apos;m <strong className="text-white">Tanaka Gaadzikwa</strong> (born November 20, 2010), a young entrepreneur and software builder based in Harare, Zimbabwe. I&apos;m interested in technology, artificial intelligence, and entrepreneurship, particularly how software can solve real problems and help people access opportunities they might otherwise struggle to find.
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
                <p className="text-sky-300 italic font-serif">
                  &ldquo;I&apos;m not here to pretend I&apos;ve figured everything out. I&apos;m here to build, learn, and see how far execution can take me.&rdquo;
                </p>
              </div>

              {/* Verified Links */}
              <div className="pt-6 border-t border-[#1E293B]/80 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" target="_blank" rel="noopener noreferrer" className="liquid-glass px-4 py-2.5 rounded-xl flex items-center gap-2 hover:border-white hover:scale-105 transition-all">
                  <GooglePlayLogo className="w-4 h-4 shrink-0 text-white" />
                  <span className="text-xs text-white font-medium">Download on Google Play</span>
                </a>
                <a href="https://www.linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="liquid-glass px-4 py-2.5 rounded-xl flex items-center gap-2 hover:border-white hover:scale-105 transition-all">
                  <LinkupLogo className="w-4 h-4 shrink-0 text-white" />
                  <span className="text-xs text-white font-medium">LINKUP Web Platform</span>
                </a>
                <a href="https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/" target="_blank" rel="noopener noreferrer" className="liquid-glass px-4 py-2.5 rounded-xl flex items-center gap-2 hover:border-blue-400 hover:scale-105 transition-all">
                  <LinkedInLogo className="w-4 h-4 shrink-0" />
                  <span className="text-xs text-white font-medium">LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* Bottom Section Navigator */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1E293B]/80 text-xs font-serif uppercase tracking-wider">
              <button onClick={() => selectHeadline('overview')} className="text-zinc-400 hover:text-white">
                ← Overview
              </button>
              <button onClick={() => selectHeadline('journey')} className="text-sky-400 hover:text-sky-300">
                Next Chapter: 02. The Journey →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 02. JOURNEY HEADLINE ==================== */}
      {activeHeadline === 'journey' && (
        <section className="relative z-10 w-full py-16 sm:py-24 bg-[#0B1120] animate-in fade-in duration-200">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]/80">
              <button
                onClick={() => selectHeadline('about')}
                className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Previous: About</span>
              </button>
              <button
                onClick={() => selectHeadline('ventures')}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-serif uppercase tracking-wider cursor-pointer"
              >
                <span>Next: Ventures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline Header */}
            <header className="space-y-4 text-center">
              <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-400">
                02. My Journey
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                From Curiosity to Building Technology
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Every builder starts somewhere. My journey is about moving from being curious about software to learning how to engineer and ship it.
              </p>
            </header>

            {/* Journey Timeline Cards */}
            <div className="space-y-6">
              
              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                  <span>STAGE 1</span>
                  <span>Curiosity &amp; Discovery</span>
                </div>
                <h3 className="font-serif text-2xl text-white">Discovering the Possibilities of Technology</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  My interest in technology developed around a simple question: what if I could build the things I imagine instead of only using the things other people create? Software development opened that possibility. It gave me a way to experiment with ideas, solve problems through code, and gradually understand how digital products are designed and built.
                </p>
              </div>

              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                  <span>STAGE 2</span>
                  <span>Execution &amp; Practice</span>
                </div>
                <h3 className="font-serif text-2xl text-white">Learning by Building Real Systems</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  As I explored software development, I became increasingly interested in turning ideas into applications. I started learning about development tools, programming, user interfaces, APIs, and the systems that make software work. Each project created new questions. Each technical challenge became an opportunity to learn something new. I began to understand that building software is not simply about making code run—it&apos;s about creating something that works reliably, makes sense to users, and solves a problem worth solving.
                </p>
              </div>

              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                  <span>STAGE 3</span>
                  <span>Modern Intelligence</span>
                </div>
                <h3 className="font-serif text-2xl text-white">Exploring Artificial Intelligence</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Artificial intelligence introduced another dimension to my interests. I became interested in how AI could do more than generate text or answer questions. I wanted to explore how intelligent systems could help people discover information, make decisions, automate tasks, and connect with others. That interest became particularly relevant to LINKUP, where AI-powered discovery and matchmaking are central to the product&apos;s direction.
                </p>
              </div>

              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                  <span>STAGE 4</span>
                  <span>Entrepreneurship</span>
                </div>
                <h3 className="font-serif text-2xl text-white">Founding LINKUP: The Matchmaking Platform</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  LINKUP became my main entrepreneurial project. The idea is to help people find collaborators based on their interests, skills, ambitions, and the kinds of things they want to build. Developing the product has required me to think about software engineering, product design, AI, user experience, and the difficult question every founder must answer: why would someone actually use this?
                </p>
              </div>

              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                  <span>STAGE 5</span>
                  <span>The Long Horizon</span>
                </div>
                <h3 className="font-serif text-2xl text-white">What Comes Next</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  My journey is still unfolding. I&apos;m focused on improving my technical abilities, learning from the people who use or explore my products, experimenting with AI, and understanding what it takes to build useful, sustainable software businesses. I want this website to document the journey honestly—not only the milestones, but also the questions, experiments, and lessons that make progress possible.
                </p>
              </div>

            </div>

            {/* Bottom Section Navigator */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1E293B]/80 text-xs font-serif uppercase tracking-wider">
              <button onClick={() => selectHeadline('about')} className="text-zinc-400 hover:text-white">
                ← 01. About Tanaka
              </button>
              <button onClick={() => selectHeadline('ventures')} className="text-sky-400 hover:text-sky-300">
                Next Chapter: 03. Ventures &amp; Projects →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 03. VENTURES & PROJECTS HEADLINE ==================== */}
      {activeHeadline === 'ventures' && (
        <section className="relative z-10 w-full py-16 sm:py-24 bg-[#0B1120] animate-in fade-in duration-200">
          <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]/80">
              <button
                onClick={() => selectHeadline('journey')}
                className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Previous: Journey</span>
              </button>
              <button
                onClick={() => selectHeadline('ai')}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-serif uppercase tracking-wider cursor-pointer"
              >
                <span>Next: AI &amp; Tech</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline Header */}
            <header className="space-y-4 text-center">
              <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-400">
                03. Companies, Ventures &amp; Projects
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                LINKUP &amp; Active Software Experiments
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Building products that connect ideas with execution through conversational AI and semantic matchmaking.
              </p>
            </header>

            {/* Flagship: LINKUP */}
            <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-8 border-[#1E293B]/80 shadow-2xl shadow-[#060A17]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1E293B]/80">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                      Flagship Venture
                    </span>
                    <span className="text-xs text-zinc-400 font-serif">Founded by Tanaka Gaadzikwa</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                    LINKUP · The Matchmaker for Builders
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" target="_blank" rel="noopener noreferrer" className="liquid-glass-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-medium hover:scale-105 transition-all">
                    <GooglePlayLogo className="w-4 h-4 shrink-0 text-white" />
                    <span>Google Play</span>
                  </a>
                  <a href="https://www.linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="liquid-glass inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-medium hover:scale-105 transition-all">
                    <LinkupLogo className="w-4 h-4 shrink-0 text-white" />
                    <span>Visit LINKUP</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>
              </div>

              <div className="space-y-6 text-zinc-200 leading-relaxed text-sm sm:text-base">
                <div className="p-6 rounded-2xl liquid-glass border-[#1E293B]/80 space-y-2">
                  <h3 className="font-serif text-lg text-white font-normal">The Problem LINKUP Solves</h3>
                  <p className="text-zinc-300 text-xs sm:text-sm">
                    Traditional networking often depends on existing relationships, broad professional networks, cold outreach, and the ability to get noticed in crowded online communities. Those approaches can make it difficult for people to find collaborators who share their interests and complement their abilities. LINKUP explores a different approach: helping people discover connections based on what they want to build, the skills they bring, and the opportunities they&apos;re looking for.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl liquid-glass border-[#1E293B]/80 space-y-2">
                    <h4 className="font-serif text-base text-white">Who It&apos;s For</h4>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      <li><strong className="text-white">Founders:</strong> Discover potential co-founders who complement your skill set.</li>
                      <li><strong className="text-white">Developers:</strong> Find visionary peers with ideas, projects, or technical needs.</li>
                      <li><strong className="text-white">Designers:</strong> Connect with builders who need UX and product design expertise.</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl liquid-glass border-[#1E293B]/80 space-y-2">
                    <h4 className="font-serif text-base text-white">Linky AI Assistant</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      LINKUP features Linky, a conversational AI assistant that supports discovery by helping users express what they are looking for in natural language and identifying matching profiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-4 border-[#1E293B]/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-400">Artificial Intelligence</span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono border border-purple-500/20">Ongoing</span>
                </div>
                <h3 className="font-serif text-2xl text-white">AI Agent Experiments</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Exploring how AI systems can become useful components of software products—focusing on conversational interfaces, natural-language interactions, and practical automated workflows.
                </p>
              </div>

              <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-4 border-[#1E293B]/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-400">Open Publishing</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">Live</span>
                </div>
                <h3 className="font-serif text-2xl text-white">Community Blogs &amp; Google News Indexing</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  A high-speed publishing engine integrated with Firebase Firestore and Google Auth, enabling authors to publish with customized read times, high-res cover photos, and instant Schema.org indexing for Google and Google News.
                </p>
              </div>
            </div>

            {/* Bottom Section Navigator */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1E293B]/80 text-xs font-serif uppercase tracking-wider">
              <button onClick={() => selectHeadline('journey')} className="text-zinc-400 hover:text-white">
                ← 02. The Journey
              </button>
              <button onClick={() => selectHeadline('ai')} className="text-sky-400 hover:text-sky-300">
                Next Chapter: 04. AI &amp; Tech →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 04. AI & TECH HEADLINE ==================== */}
      {activeHeadline === 'ai' && (
        <section className="relative z-10 w-full py-16 sm:py-24 bg-[#0B1120] animate-in fade-in duration-200">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]/80">
              <button
                onClick={() => selectHeadline('ventures')}
                className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Previous: Ventures</span>
              </button>
              <button
                onClick={() => selectHeadline('philosophy')}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-serif uppercase tracking-wider cursor-pointer"
              >
                <span>Next: Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline Header */}
            <header className="space-y-4 text-center">
              <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-400">
                04. AI &amp; Technology
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                Exploring What Artificial Intelligence Makes Possible
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Moving beyond AI as a novelty and exploring architectural applications that help people accomplish useful tasks.
              </p>
            </header>

            <div className="space-y-6 text-zinc-200">
              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <h3 className="font-serif text-xl text-white">Conversational AI Agents</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Conversational interfaces allow people to interact with software using natural language. I&apos;m interested in how these interfaces can make complicated workflows easier to understand, how agents can help users navigate products, and how AI can support decisions without taking control away from the person using it. LINKUP&apos;s assistant, Linky, is one application of this interest.
                </p>
              </div>

              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <h3 className="font-serif text-xl text-white">AI-Powered Matchmaking</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Professional discovery is not simply a matter of matching two people who share a keyword. Useful matchmaking may need to consider complementary skills, interests, goals, project needs, and preferences. I&apos;m interested in how AI can help interpret those signals and make discovery more relevant.
                </p>
              </div>

              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <h3 className="font-serif text-xl text-white">Semantic Search and Representation</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  I&apos;m interested in the ideas behind semantic search: representing information in ways that help software identify relationships between concepts, even when the wording differs. Vector embeddings and similarity calculations help retrieve semantically related information.
                </p>
              </div>

              <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-[#1E293B]/80">
                <h3 className="font-serif text-xl text-white">Technology in Emerging Markets</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  I&apos;m interested in building technology from Zimbabwe and other emerging markets—exploring how developers build with limited resources, how software products serve users with different levels of connectivity, and how AI can make certain capabilities more accessible.
                </p>
              </div>
            </div>

            {/* Bottom Section Navigator */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1E293B]/80 text-xs font-serif uppercase tracking-wider">
              <button onClick={() => selectHeadline('ventures')} className="text-zinc-400 hover:text-white">
                ← 03. Ventures
              </button>
              <button onClick={() => selectHeadline('philosophy')} className="text-sky-400 hover:text-sky-300">
                Next Chapter: 05. Philosophy →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 05. PHILOSOPHY & MEDIA HEADLINE ==================== */}
      {activeHeadline === 'philosophy' && (
        <section className="relative z-10 w-full py-16 sm:py-24 bg-[#0B1120] animate-in fade-in duration-200">
          <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-12">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]/80">
              <button
                onClick={() => selectHeadline('ai')}
                className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Previous: AI &amp; Tech</span>
              </button>
              <button
                onClick={() => selectHeadline('contact')}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-serif uppercase tracking-wider cursor-pointer"
              >
                <span>Next: Connect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline Header */}
            <header className="space-y-4 text-center">
              <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-400">
                05. Philosophy &amp; Recognition
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                Principles Behind the Execution
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Known as &ldquo;Startup Cupid&rdquo; and &ldquo;The Minister of AI&rdquo;. Grounded in radical execution and building from Zimbabwe.
              </p>
            </header>

            {/* Public Monikers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <span>Official Moniker</span>
                </div>
                <h3 className="font-serif text-2xl text-white">Startup Cupid</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-white">Tanaka Gaadzikwa</strong> is recognized in startup circles as <strong className="text-white">&ldquo;Startup Cupid&rdquo;</strong> for creating <strong className="text-white">LINKUP</strong>—an AI matchmaking platform that connects developers, designers, and founders.
                </p>
              </div>

              <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl space-y-3 border-[#1E293B]/80 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <span>AI Specialization</span>
                </div>
                <h3 className="font-serif text-2xl text-white">The Minister of AI</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Also known as <strong className="text-white">&ldquo;The Minister of AI&rdquo;</strong>, <strong className="text-white">Tanaka Gaadzikwa</strong> explores conversational agents, vector search, and practical automated systems from Harare, Zimbabwe.
                </p>
              </div>
            </div>

            {/* Principles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="liquid-glass-card p-5 rounded-xl space-y-2 border-[#1E293B]/80">
                <h4 className="font-serif text-base text-white">1. Action Creates Information</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Action reveals things speculation cannot. Spend less time guessing and more time shipping.
                </p>
              </div>

              <div className="liquid-glass-card p-5 rounded-xl space-y-2 border-[#1E293B]/80">
                <h4 className="font-serif text-base text-white">2. Small Gains Compound</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Meaningful breakthroughs come from repeated continuous micro-improvements.
                </p>
              </div>

              <div className="liquid-glass-card p-5 rounded-xl space-y-2 border-[#1E293B]/80">
                <h4 className="font-serif text-base text-white">3. Build for Real Problems</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Evaluate ideas based on friction solved, not how impressive they sound in pitch decks.
                </p>
              </div>

              <div className="liquid-glass-card p-5 rounded-xl space-y-2 border-[#1E293B]/80">
                <h4 className="font-serif text-base text-white">4. Geography Isn&apos;t a Boundary</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Building from Harare, Zimbabwe for global audiences using modern tools.
                </p>
              </div>

              <div className="liquid-glass-card p-5 rounded-xl space-y-2 border-[#1E293B]/80">
                <h4 className="font-serif text-base text-white">5. Distribution Matters</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  A useful tool helps no one if undiscovered. Building and distribution must march together.
                </p>
              </div>

              <div className="liquid-glass-card p-5 rounded-xl space-y-2 border-[#1E293B]/80">
                <h4 className="font-serif text-base text-white">6. Long-Term Horizon</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Build businesses that can grow sustainably and generate enduring value over decades.
                </p>
              </div>
            </div>

            {/* Bottom Section Navigator */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1E293B]/80 text-xs font-serif uppercase tracking-wider">
              <button onClick={() => selectHeadline('ai')} className="text-zinc-400 hover:text-white">
                ← 04. AI &amp; Tech
              </button>
              <button onClick={() => selectHeadline('contact')} className="text-sky-400 hover:text-sky-300">
                Next Chapter: 06. Connect &amp; HQ →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 06. CONNECT / CONTACT HEADLINE ==================== */}
      {activeHeadline === 'contact' && (
        <section className="relative z-10 w-full py-16 sm:py-24 bg-[#0B1120] animate-in fade-in duration-200">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]/80">
              <button
                onClick={() => selectHeadline('philosophy')}
                className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Previous: Philosophy</span>
              </button>
              <button
                onClick={() => selectHeadline('overview')}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-serif uppercase tracking-wider cursor-pointer"
              >
                <span>Back to Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline Header */}
            <header className="space-y-4 text-center">
              <span className="font-serif text-xs tracking-[0.3em] uppercase text-sky-400">
                06. Connect With Me
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                Let&apos;s Connect, Collaborate, and Build
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-md mx-auto leading-relaxed">
                If you&apos;re a founder, developer, designer, student, mentor, or someone working on an interesting idea, I&apos;d be glad to hear from you.
              </p>
            </header>

            {/* Quick Digital HQ Links */}
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

            {/* Contact Form */}
            <div className="max-w-xl mx-auto w-full">
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

            {/* Bottom Section Navigator */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1E293B]/80 text-xs font-serif uppercase tracking-wider">
              <button onClick={() => selectHeadline('philosophy')} className="text-zinc-400 hover:text-white">
                ← 05. Philosophy
              </button>
              <button onClick={() => selectHeadline('overview')} className="text-sky-400 hover:text-sky-300">
                Back to Top / Overview ↑
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Secret Google Search Simulator Modal */}
      <GoogleSearchSimulator isOpen={isSearchSimulatorOpen} onClose={() => setIsSearchSimulatorOpen(false)} />

      {/* Auth Modal for Sign Up / Sign In */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsWriteBlogOpen(true);
        }}
      />

      {/* Community Story Publisher Modal */}
      <WriteBlogModal
        isOpen={isWriteBlogOpen}
        onClose={() => setIsWriteBlogOpen(false)}
        onPublished={(newPost) => {
          setBlogs(getStoredBlogs());
          setSelectedBlogPost(newPost);
        }}
        currentUser={currentUser}
        onRequireAuth={() => {
          setIsWriteBlogOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Blog Post Reader Modal */}
      <BlogReaderModal
        post={selectedBlogPost}
        onClose={() => setSelectedBlogPost(null)}
        onOpenWriteBlog={handleOpenWriteBlog}
        onPostDeleted={() => setBlogs(getStoredBlogs())}
        currentUser={currentUser}
      />
    </div>
  );
};
