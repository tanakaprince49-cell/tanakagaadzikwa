import React, { useState, useRef } from 'react';
import { ChevronsDown, Sparkles, ExternalLink, ArrowRight, ShieldCheck, MapPin, Compass } from 'lucide-react';
import { GooglePlayLogo } from './PlatformLogos';

interface HeroProps {
  onScrollDown: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSearchSimulator?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollDown, onNavigate, onOpenSearchSimulator }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [portraitLoaded, setPortraitLoaded] = useState(false);
  
  // High-resolution forest ascent backdrop inspired by user's anime forest concept
  const forestBackdrop = '/assets/images/forest_shrine_ascent.jpg';
  const portraitUrl = 'https://i.ibb.co/pvvN63sV/20260526-181511.webp';

  // Secret Double-Tap / Double-Click Detector for Tanaka Gaadzikwa search simulator
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapCountRef = useRef<number>(0);

  const handleSecretTrigger = () => {
    if (onOpenSearchSimulator) {
      onOpenSearchSimulator();
    }
  };

  const handleTap = () => {
    tapCountRef.current += 1;
    if (tapCountRef.current === 1) {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 350);
    } else if (tapCountRef.current >= 2) {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      tapCountRef.current = 0;
      handleSecretTrigger();
    }
  };

  return (
    <section 
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#060D0A] text-white pt-4 pb-8 px-6 lg:px-14 select-none"
    >
      {/* Background Forest Ascent Artwork with Soft Atmospheric Lighting */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={forestBackdrop}
          alt="Ethereal Forest Ascent"
          referrerPolicy="no-referrer"
          onLoad={() => setBgLoaded(true)}
          className={`w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.12] transition-opacity duration-1000 ${
            bgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
        {/* Deep Mystical Forest Gradient Scrims ensuring WCAG AAA Legibility */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#060D0A]/90 via-[#060D0A]/65 to-[#060D0A]" 
          aria-hidden="true"
        />
        {/* Soft Golden Sunbeam / God Ray Glow Overlay */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-200/10 via-emerald-500/5 to-transparent blur-3xl rounded-full pointer-events-none" 
          aria-hidden="true"
        />
      </div>

      {/* Top Bar: Clean 3-Zone Navigation Contract */}
      <header className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between gap-6 py-4 border-b border-emerald-900/40 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark with Secret Double-Click */}
        <div 
          onClick={handleTap}
          onDoubleClick={handleSecretTrigger}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          title="Tanaka Gaadzikwa — Double-click to preview search identity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            TG
          </div>
          <span className="font-serif text-sm tracking-[0.25em] text-emerald-100 group-hover:text-emerald-300 transition-colors uppercase whitespace-nowrap">
            Tanaka Gaadzikwa
          </span>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wider text-emerald-200/80 uppercase">
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-emerald-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => onNavigate('journey')}
            className="hover:text-emerald-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            The Journey
          </button>
          <button
            onClick={() => onNavigate('companies')}
            className="hover:text-emerald-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ventures
          </button>
          <button
            onClick={() => onNavigate('projects')}
            className="hover:text-emerald-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Projects
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="hover:text-emerald-300 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Connect
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Google Play badge */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://play.google.com/store/apps/details?id=com.tana.linkup"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-200 hover:text-white transition-all shadow-sm"
            title="Download LINKUP on Google Play"
          >
            <GooglePlayLogo className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">Get LINKUP</span>
          </a>

          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer whitespace-nowrap"
          >
            Get in Touch
          </button>
        </div>
      </header>

      {/* Main Hero Split View: Left Column (Message & Mission) vs Right Column (Founder Showcase) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* Left Column: Vision, Identity, and Action */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Natural Unboxed Metadata (Zero-Pill Rule) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300/90 font-mono tracking-wide">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
              Harare, Zimbabwe
            </span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>15-Year-Old Founder &amp; CEO</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span className="text-amber-300/90">Startup Cupid</span>
          </div>

          {/* Hero Main Heading with Cinematic Typography */}
          <h1 
            onClick={handleTap}
            onDoubleClick={handleSecretTrigger}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] cursor-pointer"
            style={{ textWrap: 'balance' }}
            title="Double click to test search simulation"
          >
            Climbing the summit of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">African AI</span> &amp; human connection.
          </h1>

          {/* Lead Prose */}
          <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-2xl font-light">
            I am <strong className="font-semibold text-white">Tanaka Gaadzikwa</strong>. Born in 2010 in Harare, I write code, train agents, and build platforms to bridge global founders. As the founder of <span className="text-emerald-300 font-medium">LINKUP</span>, I match developers, visionaries, and creators through conversational artificial intelligence.
          </p>

          {/* Role Highlights / Badges in subtle editorial styling */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/30 backdrop-blur-sm">
              <div className="text-[11px] font-mono text-emerald-400/90 uppercase tracking-wider">Venture</div>
              <div className="text-sm font-semibold text-white mt-0.5">LINKUP &amp; Linky AI</div>
              <div className="text-[11px] text-emerald-300/60 mt-0.5">Google Play Available</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/30 backdrop-blur-sm">
              <div className="text-[11px] font-mono text-emerald-400/90 uppercase tracking-wider">Known As</div>
              <div className="text-sm font-semibold text-white mt-0.5">The Startup Cupid</div>
              <div className="text-[11px] text-emerald-300/60 mt-0.5">Co-founder Matchmaker</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/30 backdrop-blur-sm col-span-2 sm:col-span-1">
              <div className="text-[11px] font-mono text-emerald-400/90 uppercase tracking-wider">Mission</div>
              <div className="text-sm font-semibold text-white mt-0.5">The Minister of AI</div>
              <div className="text-[11px] text-emerald-300/60 mt-0.5">Empowering Youth Tech</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.tana.linkup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-semibold text-sm shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <GooglePlayLogo className="w-4 h-4 text-black shrink-0" />
              <span>Download LINKUP on Google Play</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
            </a>

            <button
              onClick={() => onNavigate('journey')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-100 hover:text-white text-sm font-medium transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore My Journey</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
            </button>
          </div>

        </div>

        {/* Right Column: Framed Founder Card with Real Portrait */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm rounded-3xl p-3 bg-gradient-to-b from-emerald-800/40 via-emerald-950/60 to-[#060D0A]/90 border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-xl">
            
            {/* Ambient Corner Aura */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Portrait Image Container */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-emerald-950/80 border border-emerald-600/20">
              <img
                src={portraitUrl}
                alt="Tanaka Gaadzikwa"
                referrerPolicy="no-referrer"
                onLoad={() => setPortraitLoaded(true)}
                className={`w-full h-full object-cover object-center filter contrast-[1.05] transition-all duration-700 ${
                  portraitLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              />

              {/* Subtle Atmospheric Gradient Scrim on Portrait */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060D0A] via-transparent to-transparent opacity-80" />

              {/* Status Badge in Lower Third */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <span>Tanaka Prince Gaadzikwa</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-emerald-300/80 font-mono">CEO · LINKUP Zimbabwe</div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Age 15
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Caption Under Card */}
            <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-emerald-300/70 font-mono">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Startup Cupid
              </span>
              <span>The Minister of AI</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <button
          onClick={onScrollDown}
          className="group flex flex-col items-center gap-1.5 text-xs text-emerald-300/70 hover:text-emerald-200 transition-colors cursor-pointer"
          aria-label="Scroll down to explore"
        >
          <span className="tracking-widest uppercase font-mono text-[10px]">Begin Ascent</span>
          <ChevronsDown className="w-4 h-4 stroke-[2] animate-bounce text-emerald-400" />
        </button>
      </div>

    </section>
  );
};
