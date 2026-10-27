import React from 'react';
import { Compass, Code, Brain, Target, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
  onOpenContact?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  return (
    <div className="w-full py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <header className="space-y-4 pb-8 border-b border-[#1E273A]">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            About Tanaka Gaadzikwa
          </h1>

          <p className="text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Software builder, entrepreneur, and founder. Passionate about artificial intelligence, startup collaboration, and proving that transformative technology can be built from anywhere.
          </p>
        </header>

        {/* Narrative Section 1: The Origin & The Drive */}
        <section className="space-y-6 text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Building From Harare, Zimbabwe
          </h2>
          <p>
            I live and build in Harare, Zimbabwe. Like many builders of my generation, my journey into technology started with a laptop, an internet connection, and an insatiable appetite to understand how modern digital products are conceived, engineered, and brought to market.
          </p>
          <p>
            Operating in Zimbabwe gives you a deeply pragmatic perspective on technology. Here, software cannot simply be an elegant aesthetic toy; it has to solve tangible, everyday friction. Whether it is navigating currency dynamics, intermittent network connectivity, or fragmented local services, you quickly realize that engineering resilience is not a luxury—it is the baseline requirement.
          </p>
          <p>
            Rather than seeing our geography as a limitation, I view it as an uncommon advantage. It forces high agency, extreme resourcefulness, and a commitment to writing lean, performant code.
          </p>
        </section>

        {/* Narrative Section 2: Learning Through Execution */}
        <section className="space-y-6 text-sm sm:text-base text-[#CBD5E1] leading-relaxed pt-8 border-t border-[#1C2436]">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Learning Through Execution, Not Theory
          </h2>
          <p>
            My philosophy is grounded in execution. Too many people spend years reading business books, drafting theoretical business plans, or waiting for the &quot;perfect time&quot; to begin. I believe the fastest, most honest way to learn software development and entrepreneurship is by shipping real things into the hands of real people.
          </p>
          <p>
            Every project I embark on is an experiment in understanding human behavior, API architecture, database performance, and distribution. I make mistakes, encounter bugs, rewrite interfaces, and talk directly to users. The lessons learned from a single shipped prototype are worth a library of passive study.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[#111724] border border-[#1E273A] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Code className="w-4 h-4 text-[#38BDF8]" />
                Full-Stack Systems
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Writing TypeScript, React, Node.js, and SQL to transform product visions into production code.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111724] border border-[#1E273A] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Brain className="w-4 h-4 text-[#38BDF8]" />
                Practical AI
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Leveraging vector embeddings and semantic search to organize unstructured human intents.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111724] border border-[#1E273A] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Target className="w-4 h-4 text-[#38BDF8]" />
                User Empathy
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Conducting 1-on-1 interviews with early builders to iterate on actual friction points.
              </p>
            </div>
          </div>
        </section>

        {/* Narrative Section 3: The Story of LINKUP */}
        <section className="space-y-6 text-sm sm:text-base text-[#CBD5E1] leading-relaxed pt-8 border-t border-[#1C2436]">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            The Genesis of LINKUP
          </h2>
          <p>
            As I continued building software, I noticed a recurring obstacle among my peers: finding collaborators. I spoke with brilliant developers who had strong backends but needed a product designer, and visionary founders who had deep industry insights but couldn&apos;t find a reliable technical partner.
          </p>
          <p>
            Existing platforms like LinkedIn are structured around corporate hiring and enterprise recruitment. They are not built for 0-to-1 founders who need to gauge working chemistry, shipping cadence, and complementary commitment.
          </p>
          <p>
            That realization sparked <strong className="text-white">LINKUP</strong>. I wanted to build a platform that matches founders using natural-language intent and verified proof-of-work rather than corporate titles. It is currently my primary focus, running in closed beta cohorts with builders across Southern Africa and beyond.
          </p>
          
          <div className="p-4 rounded-xl bg-[#0F1420] border border-[#1F293D] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Interested in how LINKUP works under the hood?</span>
            <button
              onClick={() => {
                setActiveTab('projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#38BDF8] hover:underline font-medium"
            >
              Explore LINKUP Architecture →
            </button>
          </div>
        </section>

        {/* Narrative Section 4: What I Am Working Toward */}
        <section className="space-y-6 text-sm sm:text-base text-[#CBD5E1] leading-relaxed pt-8 border-t border-[#1C2436]">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            What I Am Working Toward
          </h2>
          <p>
            My long-term ambition is clear: I want to build enduring technology companies that solve authentic problems, achieve financial independence, support my family, and catalyze economic opportunity across Africa.
          </p>
          <p>
            I am not interested in pretending to be an established titan with dozens of exits. I am proud to be a young founder learning with intensity every day. The internet gives our generation an unprecedented capability to participate in the global economy, and I intend to make every single day count.
          </p>
        </section>

        {/* Values & Working Style */}
        <section className="space-y-6 pt-8 border-t border-[#1C2436]">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Core Values
          </h2>
          
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#0E131E] border border-[#1E273A] space-y-1">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                Truth &amp; Intellectual Honesty
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Be clear about what is working and what is broken. Avoid buzzwords and hype. Measure progress by shipped software and user utility.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0E131E] border border-[#1E273A] space-y-1">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#38BDF8]" />
                Relentless Curiosity
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Always be a student. Study the architectures of great software, the history of successful startups, and the nuances of human collaboration.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
