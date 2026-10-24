import React, { useState, useRef } from 'react';
import { ChevronsDown } from 'lucide-react';
import { GooglePlayLogo } from './PlatformLogos';

interface HeroProps {
  onScrollDown: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSearchSimulator?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollDown, onNavigate, onOpenSearchSimulator }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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

      {/* Top Placement (In-flow at the top of the hero per user request, not a sticky nav bar) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
        {/* Top Brand Name - Secret Double-Tap Target */}
        <div 
          onClick={handleTap}
          onDoubleClick={handleSecretTrigger}
          className="font-serif text-[11px] sm:text-xs tracking-[0.35em] text-white/90 hover:text-white uppercase select-none cursor-pointer transition-colors py-1 shrink-0"
          title="Tanaka Gaadzikwa"
        >
          Tanaka Gaadzikwa
        </div>

        <nav className="flex items-center gap-3 sm:gap-6 font-serif text-[11px] sm:text-xs tracking-[0.25em] text-white/80 overflow-x-auto py-1 max-w-full">
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => onNavigate('journey')}
            className="hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            Journey
          </button>
          <button
            onClick={() => onNavigate('companies')}
            className="hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ventures
          </button>
          <button
            onClick={() => onNavigate('projects')}
            className="hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            Projects
          </button>
          <button
            onClick={() => onNavigate('ai-tech')}
            className="hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            AI
          </button>
          <button
            onClick={() => onNavigate('writing')}
            className="hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            Insights
          </button>
          <button
            onClick={() => onNavigate('philosophy')}
            className="hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            Philosophy
          </button>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={() => onNavigate('contact')}
            className="font-serif text-[11px] sm:text-xs tracking-[0.3em] text-white/80 hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer hidden md:block"
          >
            Connect
          </button>
          
          <a
            href="https://play.google.com/store/apps/details?id=com.tana.linkup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-sm cursor-pointer"
            title="Download LINKUP on Google Play"
            aria-label="Download LINKUP on Google Play"
          >
            <GooglePlayLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </a>
        </div>
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
    </section>
  );
};
