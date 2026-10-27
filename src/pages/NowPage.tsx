import React from 'react';
import { nowData } from '../data/nowData';
import { 
  Clock, 
  MapPin, 
  Hammer, 
  GraduationCap, 
  Lightbulb, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface NowPageProps {
  onOpenContact: () => void;
}

export const NowPage: React.FC<NowPageProps> = ({ onOpenContact }) => {
  return (
    <div className="w-full py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-16">
        
        {/* Top Header & Metadata */}
        <header className="space-y-4 pb-8 border-b border-[#1E273A]">
          {/* Last Updated Date at the top */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1.5 text-[#38BDF8] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Last Updated: {nowData.lastUpdated}
            </span>
            <span aria-hidden="true" className="text-[#475569]">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
              {nowData.location}
            </span>
            <span aria-hidden="true" className="text-[#475569]">·</span>
            <span className="flex items-center gap-1 text-[#10B981]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Publicly Approved Record
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            What I&apos;m Doing Now
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed max-w-2xl">
            Inspired by Derek Sivers&apos; &quot;Now Page&quot; concept, this is a public overview of my current projects, active technical studies, and topics I am actively thinking about.
          </p>

          <div className="p-4 rounded-xl bg-[#0F1420] border border-[#1E273B] text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            <strong className="text-white font-medium">Executive Summary: </strong>
            <span>{nowData.statusSummary}</span>
          </div>

          <div className="text-[11px] text-[#64748B]">
            Note: All contents are verified for public sharing. Sensitive financial details, private investor discussions, and personal schedules are intentionally omitted.
          </div>
        </header>

        {/* SECTION 1: What I'm Building */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
              <Hammer className="w-4 h-4" />
              <span>What I&apos;m Building</span>
            </div>
            <span className="text-xs text-[#64748B]">Active Software &amp; Initiatives</span>
          </div>

          <div className="space-y-6">
            {nowData.whatImBuilding.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-[#1E273A] bg-[#0E121B] p-6 sm:p-7 space-y-4 hover:border-[#2D3A54] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <span className="text-[#38BDF8] font-mono text-xs">{item.stage}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#1C2436]">
                  <div className="text-xs font-semibold text-[#94A3B8]">Key Active Milestones:</div>
                  <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                        <span className="leading-relaxed text-[#CBD5E1]">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: What I'm Learning */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
              <GraduationCap className="w-4 h-4" />
              <span>What I&apos;m Learning</span>
            </div>
            <span className="text-xs text-[#64748B]">Technical Studies &amp; Foundations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nowData.whatImLearning.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-[#1E273A] bg-[#0E121B] p-6 space-y-3 flex flex-col justify-between hover:border-[#2D3A54] transition-colors"
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#38BDF8]">{item.focus}</div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {item.topic}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.resources && (
                  <div className="pt-3 border-t border-[#1C2436] space-y-1.5">
                    <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-[#38BDF8]" />
                      Curriculum &amp; Reading
                    </div>
                    <ul className="space-y-1 text-xs text-[#CBD5E1]">
                      {item.resources.map((res, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-[#38BDF8] shrink-0">·</span>
                          <span className="leading-relaxed">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Current Areas of Interest */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              <span>Current Areas of Interest</span>
            </div>
            <span className="text-xs text-[#64748B]">Macro Themes &amp; Open Questions</span>
          </div>

          <div className="space-y-6">
            {nowData.currentAreasOfInterest.map((interest, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-[#1E273A] bg-[#0E121B] p-6 sm:p-7 space-y-4 hover:border-[#2D3A54] transition-colors"
              >
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {interest.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    {interest.summary}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#121724] border border-[#1E273A] space-y-2">
                  <div className="text-xs font-semibold text-white">Questions I am Actively Investigating:</div>
                  <div className="space-y-1.5">
                    {interest.keyQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                        <span className="text-[#38BDF8] font-mono shrink-0">?</span>
                        <span className="leading-relaxed text-[#CBD5E1] italic">&quot;{q}&quot;</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connection & Exchange Section */}
        <section className="space-y-6 pt-4 border-t border-[#1C2436]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            <Users className="w-4 h-4" />
            <span>Open Collaboration Opportunities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nowData.openToConnectWith.map((target, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-[#111623] border border-[#1E273A] text-xs text-[#CBD5E1] flex items-start gap-3"
              >
                <span className="text-[#38BDF8] font-mono shrink-0">→</span>
                <span className="leading-relaxed">{target}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Action Row */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090C12] border border-[#1F293D] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Exploring something similar or want to exchange notes?</h4>
            <p className="text-xs text-[#94A3B8]">
              I enjoy conversing with builders, engineers, and researchers working on hard problems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#090A0F] bg-white hover:bg-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="https://www.linkedin.com/in/tanaka-gaadzikwa-a7bb1335b/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#94A3B8] hover:text-white bg-[#151B28] border border-[#232D42] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
