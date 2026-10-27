import React, { useState } from 'react';
import { 
  Search, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Lock, 
  Star, 
  Share2, 
  Plus, 
  MoreVertical, 
  Puzzle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Bookmark,
  Camera,
  Mic,
  SlidersHorizontal,
  Info,
  Play,
  Globe,
  newspaper
} from 'lucide-react';
import { GooglePlayLogo, WhatsAppLogo, LinkedInLogo } from './PlatformLogos';

interface GoogleSearchSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

// Authentic Google Multicolor "G" Logo
const GoogleColorG: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

// Full Google Multicolor Wordmark
const GoogleWordmark: React.FC<{ className?: string }> = ({ className = "h-7" }) => (
  <span className={`font-sans font-medium text-2xl tracking-tight select-none flex items-center ${className}`}>
    <span className="text-[#4285F4]">G</span>
    <span className="text-[#EA4335]">o</span>
    <span className="text-[#FBBC05]">o</span>
    <span className="text-[#4285F4]">g</span>
    <span className="text-[#34A853]">l</span>
    <span className="text-[#EA4335]">e</span>
  </span>
);

export const GoogleSearchSimulator: React.FC<GoogleSearchSimulatorProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('tanaka gaadzikwa');
  const [omniboxInput, setOmniboxInput] = useState('https://www.google.com/search?q=tanaka+gaadzikwa');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isLensActive, setIsLensActive] = useState(false);

  if (!isOpen) return null;

  const images = [
    { url: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp', caption: 'Tanaka Gaadzikwa · Official Portrait' },
    { url: 'https://i.ibb.co/sdcn3p4x/IMG-20260930-WA0001.webp', caption: 'Founder & CEO of LINKUP' },
    { url: 'https://i.ibb.co/WNGVKXg6/IMG-20260930-WA0000.webp', caption: 'Startup Cupid AI Matchmaker' },
    { url: 'https://i.ibb.co/DHnTYFLF/IMG-20260730-114833.webp', caption: 'Harare, Zimbabwe Tech Hub' },
    { url: 'https://i.ibb.co/BHN84Z9M/20260526-181536.webp', caption: 'The Minister of AI' },
    { url: 'https://i.ibb.co/DHnKZWtw/20250411-090522.webp', caption: 'Building in Public from Zimbabwe' },
    { url: 'https://i.ibb.co/Q7ww6xBh/20250411-090743.webp', caption: 'LINKUP Platform Engineering' },
    { url: 'https://i.ibb.co/szxQw83/20250411-090734.webp', caption: 'Linky Conversational AI' }
  ];

  const presets = [
    'tanaka gaadzikwa',
    'linkup',
    'startup cupid',
    'minister of AI',
    'tanaka prince gaadzikwa',
    'tanaka gahadzikwa'
  ];

  const categories = ['All', 'Images', 'News', 'Videos', 'Maps', 'More'];

  const isNameQuery = searchQuery.toLowerCase().includes('tanaka') || 
                      searchQuery.toLowerCase().includes('prince') || 
                      searchQuery.toLowerCase().includes('gaadzikwa') || 
                      searchQuery.toLowerCase().includes('gahadzikwa');

  const faqs = [
    {
      q: 'Who is Tanaka Gaadzikwa?',
      a: 'Tanaka Gaadzikwa (full name Tanaka Prince Gaadzikwa, born November 20, 2010) is a 15-year-old Young entrepreneur and software builder from Harare, Zimbabwe. He is the founder and CEO of LINKUP (an AI-powered co-founder matchmaking platform) and is known in the tech community as the "Startup Cupid" and "The Minister of AI".'
    },
    {
      q: 'When was Tanaka Gaadzikwa born?',
      a: 'Tanaka Gaadzikwa was born on November 20, 2010 (age 15 years) in Harare, Zimbabwe.'
    },
    {
      q: 'Why is Tanaka Gaadzikwa called the Startup Cupid?',
      a: 'He is known as the "Startup Cupid" because he created LINKUP and its AI assistant Linky to match ambitious developers, designers, founders, and students into high-impact startup partnerships through intelligent conversational matchmaking.'
    },
    {
      q: 'What is LINKUP founded by Tanaka Gaadzikwa?',
      a: 'LINKUP is an AI networking and co-founder matchmaking platform available on Google Play and the web, helping founders meet complementary partners to build technology ventures together.'
    }
  ];

  const newsArticles = [
    {
      publisher: 'TechAfrica News',
      time: '2 hours ago',
      title: 'How 15-Year-Old Founder Tanaka Gaadzikwa is Redefining African Tech with LINKUP',
      snippet: 'Operating out of Harare, Zimbabwe, young entrepreneur Tanaka Gaadzikwa is connecting developers and founders globally through AI matchmaking...'
    },
    {
      publisher: 'Startup Herald',
      time: 'Yesterday',
      title: 'Meet the "Startup Cupid": The Story Behind LINKUP and Linky AI',
      snippet: 'Dubbed the Startup Cupid and The Minister of AI, Tanaka Gaadzikwa shares lessons on building production software and high-velocity teams.'
    },
    {
      publisher: 'Harare Tech Gazette',
      time: '3 days ago',
      title: 'Zim Founders on the Rise: Tanaka Gaadzikwa and the Future of Co-Founder Matchmaking',
      snippet: 'An in-depth look at LINKUP on Google Play and how its conversational matchmaking assistant is changing early-stage startup creation.'
    }
  ];

  const videos = [
    {
      title: 'Tanaka Gaadzikwa: Building LINKUP from Harare, Zimbabwe',
      channel: 'Tech Founders TV',
      duration: '14:25',
      views: '48K views',
      thumbnail: 'https://i.ibb.co/pvvN63sV/20260526-181511.webp'
    },
    {
      title: 'Meet the Startup Cupid & Minister of AI - Full Interview',
      channel: 'Startup Stories Africa',
      duration: '22:10',
      views: '95K views',
      thumbnail: 'https://i.ibb.co/sdcn3p4x/IMG-20260930-WA0001.webp'
    },
    {
      title: 'LINKUP App Demo: AI Co-Founder Matchmaking in Action',
      channel: 'Linky AI Channel',
      duration: '08:40',
      views: '31K views',
      thumbnail: 'https://i.ibb.co/WNGVKXg6/IMG-20260930-WA0000.webp'
    }
  ];

  const handleSearchChange = (newVal: string) => {
    setSearchQuery(newVal);
    setOmniboxInput(`https://www.google.com/search?q=${encodeURIComponent(newVal).replace(/%20/g, '+')}`);
  };

  const handleOmniboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (omniboxInput.includes('q=')) {
      const queryMatch = omniboxInput.match(/q=([^&]*)/);
      if (queryMatch && queryMatch[1]) {
        setSearchQuery(decodeURIComponent(queryMatch[1].replace(/\+/g, ' ')));
      }
    } else if (omniboxInput.startsWith('http://') || omniboxInput.startsWith('https://')) {
      window.open(omniboxInput, '_blank');
    } else {
      setSearchQuery(omniboxInput);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Real Google Chrome Browser Window Container */}
      <div 
        className="relative w-full max-w-7xl h-[95vh] max-h-[940px] flex flex-col rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.98)] border border-[#3c4043] bg-[#202124] text-[#e8eaed]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= CHROME TITLE BAR & TAB STRIP ================= */}
        <div className="bg-[#1f1f1f] border-b border-[#2d2e31] select-none flex items-center justify-between px-3 pt-2.5 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {/* macOS / Chrome Window Controls (Red, Yellow, Green dots) */}
            <div className="flex items-center gap-2 mr-3 shrink-0">
              <button 
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 cursor-pointer flex items-center justify-center group"
                title="Close Chrome Window"
                aria-label="Close Chrome Window"
              >
                <X className="w-2.5 h-2.5 text-black/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer" title="Minimize" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer" title="Maximize" />
            </div>

            {/* Active Chrome Tab */}
            <div className="relative flex items-center gap-2.5 bg-[#202124] text-[#e8eaed] px-4 py-2 rounded-t-xl max-w-[280px] sm:max-w-[340px] shadow-sm border-t border-x border-[#3c4043] shrink-0 text-xs font-sans">
              <GoogleColorG className="w-4 h-4 shrink-0" />
              <span className="truncate font-normal tracking-normal">
                {searchQuery} - Google Search
              </span>
              <button 
                onClick={onClose}
                className="w-4 h-4 rounded-full hover:bg-[#3c4043] flex items-center justify-center text-[#9aa0a6] hover:text-white ml-auto shrink-0 cursor-pointer"
                title="Close Tab"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* New Tab Button (+) */}
            <button 
              onClick={() => handleSearchChange('tanaka gaadzikwa')}
              className="w-7 h-7 rounded-full hover:bg-[#35363a] text-[#9aa0a6] hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="New Tab"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Chrome Right Window Actions */}
          <div className="flex items-center gap-2 text-[#9aa0a6] shrink-0">
            <span className="text-[11px] font-mono text-[#8ab4f8] bg-[#8ab4f8]/10 px-2.5 py-0.5 rounded border border-[#8ab4f8]/20 hidden md:inline">
              Chrome v132 · Live Simulator
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#3c4043] text-[#9aa0a6] hover:text-white cursor-pointer"
              title="Close Chrome"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= CHROME TOOLBAR / NAVIGATION & OMNIBOX ================= */}
        <div className="bg-[#202124] px-3 py-2 border-b border-[#303134] flex items-center gap-2 select-none shrink-0">
          {/* Navigation Controls: Back, Forward, Reload */}
          <div className="flex items-center gap-1 text-[#9aa0a6]">
            <button className="p-1.5 rounded-full hover:bg-[#35363a] hover:text-white transition-colors cursor-pointer" title="Click to go back">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-full text-[#5f6368] cursor-not-allowed" title="Click to go forward" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleSearchChange(searchQuery)}
              className="p-1.5 rounded-full hover:bg-[#35363a] hover:text-white transition-colors cursor-pointer" 
              title="Reload this page"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fully Functional Chrome Address Bar (Omnibox) */}
          <form onSubmit={handleOmniboxSubmit} className="flex-1 flex items-center gap-2.5 bg-[#292a2d] hover:bg-[#303134] focus-within:bg-[#202124] focus-within:ring-2 focus-within:ring-[#8ab4f8] px-3.5 py-1.5 rounded-full text-xs transition-all border border-transparent">
            <Lock className="w-3.5 h-3.5 text-[#9aa0a6] shrink-0" />
            <input
              type="text"
              value={omniboxInput}
              onChange={(e) => setOmniboxInput(e.target.value)}
              className="w-full bg-transparent text-[#8ab4f8] focus:outline-none text-xs font-mono"
              placeholder="Enter URL or search query..."
            />
            
            {/* Omnibox Actions: Bookmark Star & Share */}
            <div className="flex items-center gap-1.5 text-[#9aa0a6] shrink-0">
              <button 
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-1 rounded-full hover:text-white transition-colors cursor-pointer ${isBookmarked ? 'text-[#8ab4f8]' : ''}`}
                title="Bookmark this tab"
              >
                <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#8ab4f8]' : ''}`} />
              </button>
              <button 
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('URL copied to clipboard!');
                }}
                className="p-1 rounded-full hover:text-white transition-colors cursor-pointer" 
                title="Share this page"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Chrome Extensions & User Profile */}
          <div className="flex items-center gap-1.5 text-[#9aa0a6] shrink-0 pl-1">
            <button className="p-1.5 rounded-full hover:bg-[#35363a] hover:text-white cursor-pointer" title="Extensions">
              <Puzzle className="w-4 h-4" />
            </button>
            <div className="w-7 h-7 rounded-full bg-[#8ab4f8] text-[#202124] font-bold text-xs flex items-center justify-center cursor-pointer select-none" title="Google Account: Tanaka">
              T
            </div>
            <button className="p-1.5 rounded-full hover:bg-[#35363a] hover:text-white cursor-pointer" title="Customize and control Google Chrome">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= CHROME BOOKMARKS BAR ================= */}
        <div className="bg-[#202124] px-4 py-1 border-b border-[#303134] flex items-center gap-4 text-[11px] text-[#9aa0a6] overflow-x-auto select-none shrink-0 font-sans">
          <div onClick={() => handleSearchChange('tanaka gaadzikwa')} className="flex items-center gap-1.5 hover:text-white cursor-pointer shrink-0">
            <GoogleColorG className="w-3 h-3" />
            <span>Google Search</span>
          </div>
          <a 
            href="https://tanakagaadzikwa.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 hover:text-white cursor-pointer shrink-0"
          >
            <div className="w-3 h-3 rounded-full bg-sky-400 text-black flex items-center justify-center text-[7px] font-bold">T</div>
            <span>tanakagaadzikwa.com</span>
          </a>
          <a 
            href="https://play.google.com/store/apps/details?id=com.tana.linkup" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 hover:text-white cursor-pointer shrink-0"
          >
            <GooglePlayLogo className="w-3 h-3" />
            <span>LINKUP App</span>
          </a>
          <div onClick={() => handleSearchChange('startup cupid')} className="flex items-center gap-1.5 hover:text-white cursor-pointer shrink-0">
            <Bookmark className="w-3 h-3" />
            <span>Startup Cupid Hub</span>
          </div>
          <div onClick={() => handleSearchChange('minister of AI')} className="flex items-center gap-1.5 hover:text-white cursor-pointer shrink-0">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Minister of AI</span>
          </div>
        </div>

        {/* ================= GOOGLE SEARCH WEBPAGE (INSIDE CHROME VIEWPORT) ================= */}
        <div className="flex-1 overflow-y-auto bg-[#202124] text-[#bdc1c6] font-sans">
          
          {/* Real Google Search Top Nav Header */}
          <div className="sticky top-0 z-20 bg-[#202124] border-b border-[#3c4043]/60 px-4 sm:px-8 pt-4 pb-2">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-6 flex-1">
                {/* Google Logo */}
                <div className="shrink-0 cursor-pointer" onClick={() => handleSearchChange('tanaka gaadzikwa')}>
                  <GoogleWordmark className="h-8" />
                </div>

                {/* Real Google Search Bar Pill with Mic & Lens */}
                <div className="flex-1 max-w-2xl flex items-center gap-3 bg-[#303134] hover:bg-[#3c4043]/80 focus-within:bg-[#303134] focus-within:shadow-[0_2px_8px_rgba(0,0,0,0.4)] px-4 py-2.5 rounded-full border border-transparent text-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search Google or type a URL"
                    className="w-full bg-transparent text-white placeholder-[#9aa0a6] focus:outline-none text-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => handleSearchChange('')}
                      className="p-0.5 text-[#9aa0a6] hover:text-white cursor-pointer shrink-0"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <span className="w-px h-5 bg-[#5f6368] shrink-0" />
                  <button 
                    onClick={() => {
                      setIsMicActive(true);
                      setTimeout(() => {
                        setIsMicActive(false);
                        handleSearchChange('tanaka gaadzikwa');
                      }, 2500);
                    }}
                    className="text-[#8ab4f8] hover:text-white cursor-pointer shrink-0 relative" 
                    title="Search by voice"
                  >
                    <Mic className="w-4 h-4" />
                    {isMicActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setIsLensActive(true);
                      setTimeout(() => setIsLensActive(false), 3000);
                    }}
                    className="text-[#8ab4f8] hover:text-white cursor-pointer shrink-0" 
                    title="Search by image (Google Lens)"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button className="text-[#8ab4f8] hover:text-white cursor-pointer shrink-0" title="Search">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Google Account Profile & App Grid */}
              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                <div className="w-8 h-8 rounded-full hover:bg-[#303134] flex items-center justify-center text-[#9aa0a6] cursor-pointer" title="Settings">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#8ab4f8] text-[#202124] font-semibold text-xs flex items-center justify-center cursor-pointer shadow">
                  T
                </div>
              </div>
            </div>

            {/* Google Category Tabs Strip (All, Images, News, etc.) */}
            <div className="max-w-6xl mx-auto flex items-center justify-between text-xs pt-3 mt-2 overflow-x-auto text-[#9aa0a6]">
              <div className="flex items-center gap-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`pb-2.5 font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                      activeCategory === cat 
                        ? 'border-[#8ab4f8] text-[#8ab4f8]' 
                        : 'border-transparent hover:text-[#e8eaed]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 shrink-0 pb-2.5 text-[11px] text-[#9aa0a6]">
                <button className="hover:text-white cursor-pointer">Tools</button>
                <button className="hover:text-white cursor-pointer">SafeSearch</button>
              </div>
            </div>
          </div>

          {/* Voice / Lens Active Feedback Overlays */}
          {isMicActive && (
            <div className="bg-red-950/80 border-b border-red-500/40 px-4 py-2 text-center text-xs text-red-200 animate-pulse">
              🎤 Listening for voice search... ("Tanaka Gaadzikwa")
            </div>
          )}
          {isLensActive && (
            <div className="bg-blue-950/80 border-b border-blue-500/40 px-4 py-2 text-center text-xs text-blue-200 animate-pulse">
              📷 Google Lens: Analyzing visual entity &amp; knowledge graph for Tanaka Gaadzikwa...
            </div>
          )}

          {/* Quick Query Selector Bar inside Google */}
          <div className="bg-[#292a2d] px-4 sm:px-8 py-2 border-b border-[#303134] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#9aa0a6] font-mono text-[11px]">Test Query Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSearchChange(preset)}
                className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === preset.toLowerCase()
                    ? 'bg-[#8ab4f8] text-[#202124] font-semibold shadow-sm'
                    : 'bg-[#303134] text-[#bdc1c6] hover:bg-[#3c4043] hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* ================= MAIN SEARCH ENGINE RESULTS (SERP) ================= */}
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
            
            {/* Search Metric Row */}
            <div className="text-xs text-[#9aa0a6]">
              About 1,420,000 results (0.34 seconds)
            </div>

            {/* ================= CATEGORY DYNAMIC VIEWS ================= */}

            {/* 1. IMAGES TAB VIEW */}
            {activeCategory === 'Images' && (
              <div className="space-y-6">
                <div className="text-sm font-medium text-white pb-2 border-b border-[#3c4043]">
                  Images for {searchQuery}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div 
                      key={img.url}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setActiveCategory('All');
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-black border border-[#3c4043] hover:border-[#8ab4f8] cursor-pointer transition-all shadow-md hover:scale-[1.02]"
                    >
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[11px] text-white font-medium opacity-90 group-hover:opacity-100">
                        {img.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. NEWS TAB VIEW */}
            {activeCategory === 'News' && (
              <div className="space-y-6 max-w-4xl">
                <div className="text-sm font-medium text-white pb-2 border-b border-[#3c4043]">
                  Top news for {searchQuery}
                </div>
                <div className="space-y-6">
                  {newsArticles.map((article, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#292a2d] border border-[#3c4043] space-y-2 hover:border-[#8ab4f8]/50 transition-colors">
                      <div className="flex items-center gap-2 text-xs text-[#9aa0a6]">
                        <span className="text-[#dadce0] font-medium">{article.publisher}</span>
                        <span>·</span>
                        <span>{article.time}</span>
                      </div>
                      <h3 className="text-base text-[#8ab4f8] hover:underline cursor-pointer font-sans">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[#bdc1c6] leading-relaxed">
                        {article.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. VIDEOS TAB VIEW */}
            {activeCategory === 'Videos' && (
              <div className="space-y-6">
                <div className="text-sm font-medium text-white pb-2 border-b border-[#3c4043]">
                  Videos for {searchQuery}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((vid, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden bg-[#292a2d] border border-[#3c4043] space-y-3 group cursor-pointer hover:border-[#8ab4f8]/50">
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                          {vid.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-sm text-[#8ab4f8] font-medium leading-snug line-clamp-2">
                          {vid.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-[#9aa0a6]">
                          <span>{vid.channel}</span>
                          <span>{vid.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. MAPS / MORE TAB VIEW */}
            {(activeCategory === 'Maps' || activeCategory === 'More') && (
              <div className="p-8 rounded-2xl bg-[#292a2d] border border-[#3c4043] text-center space-y-4 max-w-2xl mx-auto">
                <div className="w-12 h-12 rounded-full bg-[#8ab4f8]/10 text-[#8ab4f8] flex items-center justify-center mx-auto">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-white">Harare, Zimbabwe Entity Headquarters</h3>
                <p className="text-xs text-[#9aa0a6] leading-relaxed">
                  Tanaka Gaadzikwa operates and builds technology from Harare, Zimbabwe, coordinating digital infrastructure globally via LINKUP.
                </p>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="px-4 py-2 rounded-xl bg-[#8ab4f8] text-[#202124] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  Return to All Search Results
                </button>
              </div>
            )}

            {/* 5. ALL TAB VIEW (STANDARD GOOGLE SERP + KNOWLEDGE PANEL) */}
            {activeCategory === 'All' && (
              <>
                {/* Autocorrect & Did You Mean Row */}
                {isNameQuery && (
                  <div className="text-sm space-y-0.5 pb-2 border-b border-[#303134]">
                    <div className="flex items-center gap-1.5 text-[#e8eaed]">
                      <span>Showing results for</span>
                      <span 
                        className="text-[#8ab4f8] font-semibold italic underline cursor-pointer"
                        onClick={() => handleSearchChange('tanaka gaadzikwa')}
                      >
                        tanaka gaadzikwa
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6]">
                      <span>Search instead for</span>
                      <span 
                        className="text-[#8ab4f8] hover:underline cursor-pointer"
                        onClick={() => handleSearchChange('tanaka gahadzikwa')}
                      >
                        tanaka gahadzikwa
                      </span>
                    </div>
                  </div>
                )}

                {/* TWO COLUMN SERP GRID: ORGANIC RESULTS (LEFT) vs KNOWLEDGE GRAPH (RIGHT) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT COLUMN: Organic Search Results */}
                  <div className="lg:col-span-7 space-y-7">
                    
                    {/* Result 1: Official Website with Sitelinks (tanakagaadzikwa.com) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-xs">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5 shrink-0 shadow-sm">
                          <img src="/favicon-48x48.png" alt="Tanaka Gaadzikwa" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="leading-tight">
                          <div className="text-[#dadce0] text-xs font-medium">tanakagaadzikwa.com</div>
                          <div className="text-[11px] text-[#9aa0a6] font-mono">https://www.tanakagaadzikwa.com</div>
                        </div>
                      </div>

                      <a 
                        href="https://tanakagaadzikwa.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xl text-[#8ab4f8] hover:underline font-normal block leading-snug font-sans"
                      >
                        Tanaka Gaadzikwa | Young Entrepreneur, Startup Cupid &amp; Minister of AI
                      </a>

                      <p className="text-sm text-[#bdc1c6] leading-relaxed">
                        Official personal website of <strong className="text-white">Tanaka Gaadzikwa</strong> (born November 20, 2010), 15-year-old Young entrepreneur, tech founder &amp; CEO of <strong className="text-white">LINKUP</strong> based in Harare, Zimbabwe. Widely known as the &ldquo;Startup Cupid&rdquo; and &ldquo;The Minister of AI&rdquo;.
                      </p>

                      {/* Google Sitelinks Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 pl-2">
                        <div className="space-y-1">
                          <a href="https://tanakagaadzikwa.com/#about" className="text-sm text-[#8ab4f8] hover:underline block font-medium">
                            About Tanaka Gaadzikwa
                          </a>
                          <p className="text-xs text-[#9aa0a6] leading-relaxed">
                            Background, vision, and ambitions of the Zimbabwean young founder.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <a href="https://linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#8ab4f8] hover:underline block font-medium">
                            LINKUP &amp; Linky AI
                          </a>
                          <p className="text-xs text-[#9aa0a6] leading-relaxed">
                            AI co-founder matchmaking app available on Google Play.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <a href="https://tanakagaadzikwa.com/#projects" className="text-sm text-[#8ab4f8] hover:underline block font-medium">
                            Ventures &amp; Projects
                          </a>
                          <p className="text-xs text-[#9aa0a6] leading-relaxed">
                            Production applications, AI agents, and engineering prototypes.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <a href="https://tanakagaadzikwa.com/#contact" className="text-sm text-[#8ab4f8] hover:underline block font-medium">
                            Connect With Tanaka
                          </a>
                          <p className="text-xs text-[#9aa0a6] leading-relaxed">
                            Direct outreach via email, LinkedIn, WhatsApp, and Telegram.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* People Also Ask (Interactive Accordion) */}
                    <div className="rounded-xl border border-[#3c4043] overflow-hidden bg-[#202124]">
                      <div className="px-4 py-3 border-b border-[#3c4043] font-medium text-sm text-[#e8eaed]">
                        People also ask
                      </div>

                      <div className="divide-y divide-[#3c4043]">
                        {faqs.map((faq, idx) => (
                          <div key={faq.q} className="p-4 space-y-2">
                            <button
                              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                              className="w-full flex items-center justify-between text-left text-sm text-[#e8eaed] hover:text-[#8ab4f8] cursor-pointer"
                            >
                              <span className="font-normal">{faq.q}</span>
                              {expandedFaq === idx ? (
                                <ChevronUp className="w-4 h-4 text-[#9aa0a6] shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#9aa0a6] shrink-0" />
                              )}
                            </button>
                            {expandedFaq === idx && (
                              <p className="text-xs text-[#bdc1c6] leading-relaxed pt-1 pl-1 font-sans">
                                {faq.a}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result 2: Google Play Store App (LINKUP) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-xs">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1">
                          <GooglePlayLogo className="w-4 h-4" />
                        </div>
                        <div className="leading-tight">
                          <div className="text-[#dadce0] text-xs font-medium">Google Play Store</div>
                          <div className="text-[11px] text-[#9aa0a6] font-mono">https://play.google.com › apps › details › com.tana.linkup</div>
                        </div>
                      </div>

                      <a 
                        href="https://play.google.com/store/apps/details?id=com.tana.linkup" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xl text-[#8ab4f8] hover:underline font-normal block leading-snug"
                      >
                        LINKUP: Co-Founder &amp; Startup Matchmaker - Apps on Google Play
                      </a>

                      <p className="text-sm text-[#bdc1c6] leading-relaxed">
                        Install <strong className="text-white">LINKUP</strong> created by Tanaka Gaadzikwa. Connect with ambitious developers, designers, founders, and students. Powered by conversational AI assistant Linky.
                      </p>
                    </div>

                    {/* Result 3: LINKUP Platform Web */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-xs">
                        <div className="w-6 h-6 rounded-full bg-sky-950 flex items-center justify-center text-xs font-bold text-sky-300">
                          L
                        </div>
                        <div className="leading-tight">
                          <div className="text-[#dadce0] text-xs font-medium">LINKUP Platform</div>
                          <div className="text-[11px] text-[#9aa0a6] font-mono">https://linkupbuild.com</div>
                        </div>
                      </div>

                      <a 
                        href="https://www.linkupbuild.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xl text-[#8ab4f8] hover:underline font-normal block leading-snug"
                      >
                        LINKUP | AI Startup Partner &amp; Co-Founder Matching
                      </a>

                      <p className="text-sm text-[#bdc1c6] leading-relaxed">
                        The platform founded by Tanaka Gaadzikwa that turns solo ambition into high-velocity startup teams. Start conversations, build prototypes, and find technical partners.
                      </p>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: GOOGLE KNOWLEDGE GRAPH PANEL */}
                  <div className="lg:col-span-5 rounded-2xl border border-[#3c4043] bg-[#292a2d] p-5 space-y-4 shadow-xl">
                    
                    {/* Photo Carousel Header */}
                    <div className="space-y-3">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-[#3c4043]">
                        <img
                          src={images[activeImageIndex].url}
                          alt="Tanaka Gaadzikwa"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] text-white font-mono flex items-center justify-between">
                          <span className="truncate">{images[activeImageIndex].caption}</span>
                          <span className="shrink-0">{activeImageIndex + 1}/{images.length}</span>
                        </div>
                      </div>

                      {/* Thumbnail Row */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {images.map((img, idx) => (
                          <button
                            key={img.url}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer ${
                              activeImageIndex === idx 
                                ? 'border-[#8ab4f8] scale-105 shadow-md shadow-[#8ab4f8]/30' 
                                : 'border-[#3c4043] opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Entity Title & Subtitle */}
                    <div className="space-y-1 pb-3 border-b border-[#3c4043]">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-normal text-white font-sans">
                          Tanaka Gaadzikwa
                        </h2>
                        <button className="p-1.5 rounded-full hover:bg-[#35363a] text-[#9aa0a6] hover:text-white cursor-pointer" title="Share profile">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* EXACTLY "Young entrepreneur" */}
                      <div className="text-sm text-[#8ab4f8] font-medium">
                        Young entrepreneur
                      </div>

                      <p className="text-xs text-[#bdc1c6] leading-relaxed pt-1.5">
                        Tanaka Gaadzikwa (born November 20, 2010) is a Zimbabwean young entrepreneur, software builder, and founder/CEO of LINKUP. Widely recognized in the tech community as the &ldquo;Startup Cupid&rdquo; and &ldquo;The Minister of AI&rdquo;.
                      </p>
                    </div>

                    {/* Knowledge Graph Attributes Table */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#3c4043]/60">
                        <span className="text-[#9aa0a6]">Full name:</span>
                        <span className="text-white font-medium text-right">Tanaka Prince Gaadzikwa</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#3c4043]/60">
                        <span className="text-[#9aa0a6]">Born:</span>
                        <span className="text-white font-medium text-right">November 20, 2010 (age 15 years), Harare, Zimbabwe</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#3c4043]/60">
                        <span className="text-[#9aa0a6]">Nationality:</span>
                        <span className="text-white">Zimbabwean</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#3c4043]/60">
                        <span className="text-[#9aa0a6]">Known for:</span>
                        <span className="text-white">Startup Cupid, The Minister of AI</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#3c4043]/60">
                        <span className="text-[#9aa0a6]">Organization:</span>
                        <span className="text-white">LINKUP (Founder &amp; CEO)</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#3c4043]/60">
                        <span className="text-[#9aa0a6]">Official Source:</span>
                        <a href="https://tanakagaadzikwa.com" target="_blank" rel="noopener noreferrer" className="text-[#8ab4f8] underline">
                          tanakagaadzikwa.com
                        </a>
                      </div>
                    </div>

                    {/* Profiles & Verified Handles */}
                    <div className="pt-2 border-t border-[#3c4043] space-y-2">
                      <div className="text-[11px] font-semibold text-[#9aa0a6] uppercase tracking-wider">
                        Profiles
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <a 
                          href="https://play.google.com/store/apps/details?id=com.tana.linkup" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-xl bg-[#202124] hover:bg-[#303134] border border-[#3c4043] flex flex-col items-center justify-center gap-1 text-center transition-colors group cursor-pointer"
                        >
                          <GooglePlayLogo className="w-4 h-4 text-white" />
                          <span className="text-[10px] text-[#bdc1c6] group-hover:text-white">Google Play</span>
                        </a>

                        <a 
                          href="https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-xl bg-[#202124] hover:bg-[#303134] border border-[#3c4043] flex flex-col items-center justify-center gap-1 text-center transition-colors group cursor-pointer"
                        >
                          <LinkedInLogo className="w-4 h-4 text-white" />
                          <span className="text-[10px] text-[#bdc1c6] group-hover:text-white">LinkedIn</span>
                        </a>

                        <a 
                          href="https://tanakagaadzikwa.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-xl bg-[#202124] hover:bg-[#303134] border border-[#3c4043] flex flex-col items-center justify-center gap-1 text-center transition-colors group cursor-pointer"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#8ab4f8] text-[#202124] font-bold text-[8px] flex items-center justify-center">T</div>
                          <span className="text-[10px] text-[#bdc1c6] group-hover:text-white">Website</span>
                        </a>
                      </div>
                    </div>

                    {/* Google Knowledge Graph Claim / Feedback Note */}
                    <div className="p-2.5 rounded-xl bg-[#202124] border border-[#3c4043] text-[11px] text-[#9aa0a6] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Claimed &amp; Verified Entity</span>
                      </div>
                      <span className="text-[10px] hover:underline cursor-pointer">Feedback</span>
                    </div>

                  </div>

                </div>
              </>
            )}

            {/* Google Pagination Footer ("Gooooooogle") */}
            <div className="pt-8 pb-6 border-t border-[#3c4043] flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center text-2xl font-serif tracking-widest select-none">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8ab4f8]">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button 
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`cursor-pointer ${currentPage === num ? 'font-bold text-white underline' : 'hover:underline'}`}
                  >
                    {num}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, 5))} className="hover:underline cursor-pointer">
                  Next &gt;
                </button>
              </div>
              <div className="text-[11px] text-[#9aa0a6]">
                Harare, Zimbabwe · From your internet address · Accurate Entity Indexing (Page {currentPage} of 5)
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
