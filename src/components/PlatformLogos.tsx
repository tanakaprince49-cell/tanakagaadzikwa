import React from 'react';

// Official & Pristine Brand Logos

export const GooglePlayLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img 
    src="https://i.ibb.co/fzgYDV6B/IMG-20261014-WA0003.webp" 
    alt="Google Play" 
    className={`${className} object-contain`} 
    referrerPolicy="no-referrer"
  />
);

export const WhatsAppLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.28 4.95L2 22l5.25-1.35c1.45.79 3.12 1.22 4.79 1.22 5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.82 14.18c-.24.67-1.39 1.24-1.92 1.31-.5.06-1.14.1-3.69-.93-3.15-1.28-5.18-4.51-5.34-4.72-.16-.21-1.28-1.7-1.28-3.25 0-1.55.81-2.31 1.1-2.62.29-.31.63-.39.84-.39.21 0 .42.01.6.02.19.01.44-.07.69.53.25.6.86 2.09.94 2.24.08.15.13.33.03.53-.1.2-.15.32-.3.49-.15.17-.32.38-.45.52-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.17 1.38 2.48 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.71-.15.29.11 1.83.86 2.14 1.02.31.16.52.24.6.37.08.13.08.76-.16 1.43z"
      fill="#25D366"
    />
  </svg>
);

export const TelegramLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-2.01 1.28-5.69 3.77-.54.37-1.03.55-1.47.54-.48-.01-1.4-.27-2.08-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.51 1.05-.78 4.11-1.79 6.85-2.97 8.22-3.54 3.91-1.63 4.72-1.91 5.25-1.92.12 0 .39.03.56.17.15.12.19.28.21.4-.02.09-.02.3-.17 1.47z"
      fill="#2AABEE"
    />
  </svg>
);

export const LinkedInLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
      fill="#0A66C2"
    />
  </svg>
);

export const GmailLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img 
    src="https://i.ibb.co/WwPnCND/IMG-20261014-WA0004.webp" 
    alt="Gmail" 
    className={`${className} object-contain`} 
    referrerPolicy="no-referrer"
  />
);

export const LinkupLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <img 
    src="https://i.ibb.co/jvRj8cfY/logo-idea-r2-A.webp" 
    alt="LINKUP Logo" 
    className={`${className} object-contain rounded-md`} 
    referrerPolicy="no-referrer"
  />
);

export const InstagramLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const YouTubeLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.18 1 12 1 12s0 3.82.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.82 23 12 23 12s0-3.82-.46-5.58z"></path>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
  </svg>
);

export const XLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.46-2.46l6.772-6.772"></path>
  </svg>
);
