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
    <footer className="w-full border-t border-emerald-950/60 bg-[#040806] text-emerald-200/60 py-12 px-6 lg:px-14 relative z-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        
        {/* Top row: Name and Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl tracking-[0.25em] uppercase font-normal">
              <span className="text-white">TANAKA</span> <span className="text-emerald-400">GAADZIKWA</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5">
            <a href="https://instagram.com/talala2694?dlrf=MTNya21lMmQyNzFwMg%3D%3D" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="Instagram">
              <InstagramLogo className="w-7 h-7" />
            </a>
            <a href="https://youtube.com/@neverletbrocook0?si=GGts26pCPyj8Mv1t" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="YouTube">
              <YouTubeLogo className="w-7 h-7" />
            </a>
            <a href="https://x.com/TGaadzikwa" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="X / Twitter">
              <XLogo className="w-7 h-7" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.tana.linkup" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="Download LINKUP on Google Play">
              <GooglePlayLogo className="w-7 h-7" />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="WhatsApp">
              <WhatsAppLogo className="w-7 h-7" />
            </a>
            <a href="https://t.me/tanaka_93" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="Telegram">
              <TelegramLogo className="w-7 h-7" />
            </a>
            <a href="https://www.linkedin.com/in/tanaka-gaadzikwa-linkup/" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="LinkedIn">
              <LinkedInLogo className="w-7 h-7" />
            </a>
            <a href="mailto:tanakaprince49@gmail.com" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="Email">
              <GmailLogo className="w-7 h-7" />
            </a>
            <a href="https://linkupbuild.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-300/60 hover:text-emerald-300 hover:scale-110 transition-all" title="LINKUP">
              <LinkupLogo className="w-7 h-7" />
            </a>
          </div>
        </div>

        {/* Bottom row: Address, Philosophy and Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-950/40 text-xs text-emerald-400/50">
          <p>
            Harare, Zimbabwe · The Startup Cupid · The Minister of AI
          </p>
          <p>
            &copy; {new Date().getFullYear()} Tanaka Gaadzikwa. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
