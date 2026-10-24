import React from 'react';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-white font-sans selection:bg-[#38BDF8]/30 selection:text-white">
      {/* Main Single-Page Experience with Hero top placement */}
      <main className="flex-1 w-full">
        <HomePage />
      </main>

      {/* Minimalist Luxury Footer */}
      <Footer />

      {/* Vercel Tracking & Insights */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

