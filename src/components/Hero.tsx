import React, { useState, useRef, useEffect } from 'react';
import { ChevronsDown, X, ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollDown: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSearchSimulator?: () => void;
  onNavigateToBlogs?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onScrollDown, 
  onNavigate, 
  onOpenSearchSimulator,
  onNavigateToBlogs 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const portraitUrl = 'https://i.ibb.co/pvvN63sV/20260526-181511.webp';

  // Secret Double-Tap Detector for Tanaka Gaadzikwa
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
      }, 400);
    } else if (tapCountRef.current >= 2) {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      tapCountRef.current = 0;
      handleSecretTrigger();
    }
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSelectSection = (sectionId: string) => {
    setIsMenuOpen(false);
    if (sectionId === 'blogs') {
      if (onNavigateToBlogs) onNavigateToBlogs();
      else onNavigate('writing');
    } else {
      onNavigate(sectionId);
    }
  };

  const menuItems = [
    { id: 'about', label: 'About', number: '01', desc: 'Background, identity, and convictions' },
    { id: 'journey', label: 'The Journey', number: '02', desc: 'From curiosity to building software in Zimbabwe' },
    { id: 'companies', label: 'Ventures & LINKUP', number: '03', desc: 'Flagship AI matchmaking platform for builders' },
    { id: 'projects', label: 'Projects & Experiments', number: '04', desc: 'Software prototypes and applications' },
    { id: 'ai-tech', label: 'AI & Technology', number: '05', desc: 'Conversational agents, vector search & emerging markets' },
    { id: 'blogs', label: 'Blogs & Stories', number: '06', desc: 'Open publishing, custom read times & Super SEO' },
    { id: 'philosophy', label: 'Philosophy & Recognition', number: '07', desc: 'Startup Cupid, Minister of AI & core principles' },
    { id: 'contact', label: 'Connect & Inquiries', number: '08', desc: 'Direct message dispatch & digital headquarters' },
  ];

  return (
    <section 
      id="hero"
      className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-between overflow-hidden bg-black py-6 px-6 lg:px-12"
    >
      {/* Background Portrait Image - Full Screen Edge-to-Edge */}
      <div className="absolute inset-0 z-0">
        <img
          src={portraitUrl}
          alt="Tanaka Gaadzikwa"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05] transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Pitch Midnight Vignette Overlays blending into #0B1120 */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/30 to-black/60 pointer-events-none" 
          aria-hidden="true"
        />
      </div>

      {/* Top Header: Only Brand Name on left + 3-Stripe Menu on right */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between gap-4 pt-2">
        {/* Top Brand Name - Secret Double-Tap Target */}
        <div 
          onClick={handleTap}
          onDoubleClick={handleSecretTrigger}
          className="font-serif text-xs sm:text-sm tracking-[0.35em] text-white/95 hover:text-white uppercase select-none cursor-pointer transition-colors py-2 shrink-0 font-medium"
          title="Tanaka Gaadzikwa"
        >
          Tanaka Gaadzikwa
        </div>

        {/* 3-Striped Hamburger Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer flex items-center gap-2.5 group shrink-0 active:scale-95 shadow-sm"
          aria-label="Open Navigation Menu"
          title="Open Sections Menu"
        >
          {/* 3 Stripes */}
          <div className="w-5 h-3.5 flex flex-col justify-between items-center py-0.5">
            <span className="w-5 h-0.5 bg-white rounded-full transition-colors group-hover:bg-sky-300" />
            <span className="w-5 h-0.5 bg-white rounded-full transition-colors group-hover:bg-sky-300" />
            <span className="w-5 h-0.5 bg-white rounded-full transition-colors group-hover:bg-sky-300" />
          </div>
          <span className="font-serif text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/90 font-medium hidden sm:inline">
            Menu
          </span>
        </button>
      </div>

      {/* Main Center Content Area: Name Only */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center text-center my-auto">
        <h1 
          onClick={handleTap}
          onDoubleClick={handleSecretTrigger}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300 drop-shadow-[0_15px_50px_rgba(56,189,248,0.4)] leading-tight select-none cursor-pointer"
          style={{ fontFamily: "'Cinzel', Georgia, serif", textWrap: 'balance' }}
          title="Tanaka Gaadzikwa"
        >
          Tanaka Gaadzikwa
        </h1>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 pb-2 flex flex-col items-center">
        <button
          onClick={onScrollDown}
          className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-all duration-300 transform hover:translate-y-1 focus:outline-none cursor-pointer"
          aria-label="Scroll down to About Tanaka"
        >
          <ChevronsDown className="w-5 h-5 stroke-[1.8] animate-bounce" />
        </button>
      </div>

      {/* POP-UP SECTIONS OVERLAY (Opened by 3-Striped Nav) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0B1120]/95 backdrop-blur-2xl flex flex-col p-6 sm:p-12 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="w-full max-w-4xl mx-auto my-auto flex flex-col space-y-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]/80">
              <span className="font-serif text-xs sm:text-sm tracking-[0.35em] text-white/90 uppercase font-medium">
                TANAKA GAADZIKWA
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Headline Sections List */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.25em] text-sky-400 uppercase">
                Select a Headline Section
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSection(item.id)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-sky-500/50 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-sky-400 font-semibold">
                          {item.number}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl text-white group-hover:text-sky-300 transition-colors font-medium">
                          {item.label}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Note */}
            <div className="pt-4 border-t border-[#1E293B]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
              <span>Harare, Zimbabwe · Building Global Tech</span>
              <span className="text-zinc-400">Click any section to view its headline</span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
