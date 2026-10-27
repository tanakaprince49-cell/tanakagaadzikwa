import React from 'react';
import { projectsData } from '../data/projectsData';
import { Project } from '../types';
import { ExternalLink } from 'lucide-react';

interface ProjectsPageProps {
  onOpenProject?: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const linkup = projectsData.find((p) => p.id === 'linkup') || projectsData[0];

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="space-y-3 pb-8 border-b border-[#1E273A]">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Projects
          </h1>
          <p className="text-base text-[#94A3B8] leading-relaxed max-w-2xl">
            Software built to solve real-world friction.
          </p>
        </div>

        {/* LINKUP Showcase Card */}
        <div className="rounded-2xl border border-[#1E273A] bg-[#0E121B] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#38BDF8]">{linkup.category}</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {linkup.title}
              </h2>
            </div>

            {linkup.liveUrl && (
              <a
                href={linkup.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#090A0F] bg-white hover:bg-[#E2E8F0] rounded-lg transition-colors shrink-0"
              >
                <span>Visit Live App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
            {linkup.summary}
          </p>

          <p className="text-sm text-[#94A3B8] leading-relaxed">
            {linkup.solution}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1C2436] text-xs text-[#64748B]">
            <span className="text-[#94A3B8] font-mono">Stack:</span>
            {linkup.techStack.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span className="text-[#CBD5E1] font-mono">{tech}</span>
                {idx < linkup.techStack.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
