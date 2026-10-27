import React, { useState } from 'react';
import { Network, ArrowRight, ShieldCheck, Cpu, Users, GitFork, Check, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface LinkupShowcaseProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

export const LinkupShowcase: React.FC<LinkupShowcaseProps> = ({ project, onOpenDetails }) => {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'intent' | 'matching' | 'intro'>('intent');

  // Interactive sample simulator data
  const sampleIntents = [
    {
      role: 'Solo Technical Founder (Nairobi)',
      intent: 'Building an offline-first inventory POS for informal retailers. Need a commercial co-founder with FMCG distribution experience in East Africa.',
      matchedWith: 'Operations Lead (Ex-B2B Logistics, Kigali)',
      similarityScore: '94% Complementary Matrix',
      keyMatchFactors: ['Zero overlap in duties', 'Aligned timezone (EAT)', 'Shared focus on informal trade']
    },
    {
      role: 'Full-Stack Developer (Harare)',
      intent: 'Developing an AI document extraction tool for legal compliance. Looking for a UI/UX product designer to overhaul usability before launch.',
      matchedWith: 'Product Designer (Design Systems Specialist, Lagos)',
      similarityScore: '91% Complementary Matrix',
      keyMatchFactors: ['Figma to React workflow synergy', 'Complementary sprint availability', 'B2B SaaS interest']
    }
  ];

  const [selectedIntentIndex, setSelectedIntentIndex] = useState(0);
  const currentIntent = sampleIntents[selectedIntentIndex];

  return (
    <section className="w-full py-16 lg:py-20 border-b border-[#1A2234]">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
              <Network className="w-3.5 h-3.5" />
              <span>Flagship Venture &amp; Case Study</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#94A3B8]">Live Beta (2026)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ textWrap: 'balance' }}>
              LINKUP: Re-engineering how ambitious builders discover co-founders
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Traditional networks reward resumes and posturing. LINKUP uses natural-language intent parsing and proof-of-work profiles to connect entrepreneurs, software developers, and designers with genuine collaborators.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenDetails(project)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#151B28] hover:bg-[#1E2638] border border-[#232D42] rounded-lg transition-colors"
            >
              <span>Full Case Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="https://linkup.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#090A0F] bg-white hover:bg-[#E2E8F0] rounded-lg transition-colors"
            >
              <span>Visit LINKUP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2-Column Split: Deep Problem & Technical Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Problem & Founder Perspective */}
          <div className="lg:col-span-6 rounded-xl border border-[#1E273A] bg-[#0E131E] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  The Problem: The Co-Founder Bottleneck
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  For builders outside traditional venture capitals (like Harare, Nairobi, or Accra), finding a trustworthy technical co-founder or design partner is an existential bottleneck. Cold LinkedIn DMs have sub-3% response rates, and local hackathons happen too infrequently to form lasting ventures.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Core Architectural Tenets
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-[#171F30] text-[#38BDF8] shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Intent-First Semantic Matching</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Evaluates what you are actually building and where your gaps are, rather than surface job titles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-[#171F30] text-[#38BDF8] shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Double-Opt-In Privacy</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Zero cold spam. Contact info is only exchanged when both creators approve the collaboration premise.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-[#171F30] text-[#38BDF8] shrink-0 mt-0.5">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">7-Day Sprint Trial</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        A structured micro-project framework to test mutual cadence and communication before committing equity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tanaka's Role & Stage */}
            <div className="pt-4 border-t border-[#1C2436] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[#64748B]">Tanaka&apos;s Role: </span>
                <span className="text-[#CBD5E1] font-medium">Founder, System Architect &amp; Full-Stack Dev</span>
              </div>
              <div className="text-[#38BDF8] font-mono">
                Cohort Beta · Active in 2026
              </div>
            </div>
          </div>

          {/* Right: Interactive Product Workflow Simulator */}
          <div className="lg:col-span-6 rounded-xl border border-[#1E273A] bg-[#0B0F18] overflow-hidden flex flex-col justify-between">
            
            {/* Simulator Top Nav */}
            <div className="p-4 border-b border-[#1E273A] bg-[#0E131E] flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                How LINKUP Works in Practice
              </span>
              <div className="flex items-center gap-1">
                {(['intent', 'matching', 'intro'] as const).map((step) => (
                  <button
                    key={step}
                    onClick={() => setActiveWorkflowTab(step)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                      activeWorkflowTab === step
                        ? 'bg-[#1E273A] text-white'
                        : 'text-[#64748B] hover:text-[#94A3B8]'
                    }`}
                  >
                    {step === 'intent' && '1. Intent'}
                    {step === 'matching' && '2. Match Engine'}
                    {step === 'intro' && '3. Introduction'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-6 space-y-5">
              
              {/* Sample Intent Selector */}
              <div className="flex items-center gap-2 pb-2 border-b border-[#1A2234]">
                <span className="text-xs text-[#64748B]">Scenario:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedIntentIndex(0)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      selectedIntentIndex === 0
                        ? 'bg-[#182133] text-white border border-[#263552]'
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    POS Founder &amp; FMCG Ops
                  </button>
                  <button
                    onClick={() => setSelectedIntentIndex(1)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      selectedIntentIndex === 1
                        ? 'bg-[#182133] text-white border border-[#263552]'
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    AI Legal Dev &amp; Designer
                  </button>
                </div>
              </div>

              {activeWorkflowTab === 'intent' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#111724] border border-[#1E273B] space-y-2">
                    <div className="text-xs font-mono text-[#38BDF8]">Builder Manifesto Input:</div>
                    <div className="text-xs font-semibold text-white">{currentIntent.role}</div>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed italic bg-[#0B0F18] p-3 rounded border border-[#1B2335]">
                      &quot;{currentIntent.intent}&quot;
                    </p>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Instead of checking standard dropdown boxes, builders write raw vision notes. The system converts these inputs into semantic embedding vectors to analyze complementary skill dependencies.
                  </p>
                </div>
              )}

              {activeWorkflowTab === 'matching' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#111724] border border-[#1E273B] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#38BDF8]">Algorithmic Alignment</span>
                      <span className="text-xs font-semibold text-[#10B981]">{currentIntent.similarityScore}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{currentIntent.matchedWith}</div>
                    <div className="space-y-1.5 pt-1">
                      {currentIntent.keyMatchFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <Check className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Notice that the engine matches for <em>complementarity</em>—pairing software depth with go-to-market execution—rather than matching two identical profiles who would compete for the same responsibilities.
                  </p>
                </div>
              )}

              {activeWorkflowTab === 'intro' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#111724] border border-[#1E273B] space-y-2">
                    <div className="text-xs font-mono text-[#10B981]">Double-Opt-In Mutual Consent</div>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      Both builders received an anonymous brief highlighting problem scope, time commitment, and timezone overlap. Both clicked &quot;Accept Sprint Match&quot;.
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-[#94A3B8] border-t border-[#1C2436]">
                      <span>7-Day Communication Protocol</span>
                      <span className="text-white font-medium">Sprint Active</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Personal contact coordinates (Telegram, Signal, or Email) are unlocked only after mutual approval, preventing cold inbox exhaustion.
                  </p>
                </div>
              )}

            </div>

            {/* Footer details */}
            <div className="p-4 bg-[#0E131E] border-t border-[#1E273A] flex items-center justify-between text-xs text-[#64748B]">
              <span>Vector Similarity · Cosine Threshold 0.88</span>
              <button
                onClick={() => onOpenDetails(project)}
                className="text-[#38BDF8] hover:underline"
              >
                Inspect Technical Architecture →
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
