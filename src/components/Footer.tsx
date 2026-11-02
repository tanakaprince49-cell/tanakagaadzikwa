import React from 'react';
import { 
  InstagramLogo, 
  YouTubeLogo, 
  XLogo,
  GooglePlayLogo,
  WhatsAppLogo,
  TelegramLogo,
  LinkedInLogo,
  GmailLogo,
  LinkupLogo
} from './PlatformLogos';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1E293B]/60 bg-[#060A17] text-zinc-400 py-12 px-6 lg:px-12 relative z-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        
        {/* Top row: Name and Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-serif text-2xl tracking-[0.25em] uppercase font-normal">
            <span className="text-white">TANAKA</span> <span className="text-sky-400">GAADZIKWA</span>
          </span>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
            <a href="https://instagram.com/talala2694?dlrf=MTNya21lMmQyNzFwMg%3D%3D" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <InstagramLogo className="w-8 h-8" />
            </a>
            <a href="https://youtube.com/@neverletbrocook0?si=GGts26pCPyj8Mv1t" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <YouTubeLogo className="w-8 h-8" />
            </a>
            <a href="https://x.com/TGaadzikwa" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <XLogo className="w-8 h-8" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" title="Download LINKUP on Google Play">
              <GooglePlayLogo className="w-8 h-8" />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" title="WhatsApp">
              <WhatsAppLogo className="w-8 h-8" />
            </a>
            <a href="https://t.me/tanaka_93" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" title="Telegram">
              <TelegramLogo className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" title="LinkedIn">
              <LinkedInLogo className="w-8 h-8" />
            </a>
            <a href="mailto:tanakaprince49@gmail.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <GmailLogo className="w-8 h-8" />
            </a>
            <a href="https://linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <LinkupLogo className="w-8 h-8" />
            </a>
          </div>
        </div>

        {/* Middle row: Quick Navigation & Blogs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1E293B]/40 text-xs">
          <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-serif tracking-wider uppercase text-[11px]">
            <a href="/" className="hover:text-white transition-colors">
              Portfolio
            </a>
            <a href="/blogs" className="hover:text-white transition-colors">
              Blogs
            </a>
            <a href="https://linkupbuild.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LINKUP Platform
            </a>
            <a href="mailto:tanakaprince49@gmail.com" className="hover:text-white transition-colors">
              Direct Contact
            </a>
          </div>

          <div className="text-zinc-500 font-mono text-[11px]">
            <span>Harare, Zimbabwe · Built for the World</span>
          </div>
        </div>

        {/* Bottom row: Address and Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} TANAKA GAADZIKWA. All Rights Reserved.
          </p>
          <p className="text-[11px] text-zinc-600">
            Open Builder Platform · Write, Share, and Connect
          </p>
        </div>

      </div>
    </footer>
  );
};
