import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Lightbulb, Activity } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D111A] border border-[#232C3F] p-6 sm:p-8 shadow-2xl text-[#E2E8F0] space-y-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#1E2638]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
              <span className="text-[#38BDF8] font-semibold">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.date}</span>
              <span aria-hidden="true">·</span>
              <span className="text-white font-medium">{project.status}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xl">
              {project.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white rounded-lg bg-[#141925] border border-[#222B3D] transition-colors"
            aria-label="Close Project Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#090A0F] bg-white hover:bg-[#E2E8F0] rounded-lg transition-colors"
            >
              <span>Visit Live Experience</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white bg-[#151B28] border border-[#242E42] rounded-lg transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Public Repositories</span>
            </a>
          )}
          <div className="text-xs text-[#64748B] ml-auto py-2">
            <span>Tanaka&apos;s Role: </span>
            <strong className="text-[#CBD5E1] font-medium">{project.role}</strong>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#38BDF8]">
            Overview
          </h3>
          <p className="text-sm text-[#CBD5E1] leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-xl bg-[#121723] border border-[#1E273A] space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              The Authentic Problem
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121723] border border-[#1E273A] space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              The Applied Solution
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Target Users */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#38BDF8]">
            Who This Serves
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.targetUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-[#111622] border border-[#1D2536] text-xs text-[#CBD5E1]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <span>{user}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#38BDF8]">
            Key Shipped Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.keyFeatures.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#111622] border border-[#1D2536] space-y-1.5">
                <div className="text-xs font-semibold text-white">{feat.title}</div>
                <div className="text-xs text-[#94A3B8] leading-relaxed">{feat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture Notes (if available) */}
        {project.architectureNotes && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#38BDF8] flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Technical Architecture &amp; System Decisions
            </h3>
            <ul className="space-y-2 text-xs text-[#94A3B8] pl-2">
              {project.architectureNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#38BDF8] font-mono shrink-0">→</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lessons Learned */}
        <div className="p-5 rounded-xl bg-[#131926] border border-[#20293D] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
            Lessons Learned Through Execution
          </h3>
          <ul className="space-y-2 text-xs text-[#CBD5E1]">
            {project.lessonsLearned.map((lesson, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#64748B]">·</span>
                <span className="leading-relaxed">{lesson}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current Status Note with Date */}
        <div className="pt-4 border-t border-[#1E2638] flex items-center gap-3 text-xs text-[#94A3B8]">
          <Activity className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <div>
            <strong className="text-white">Current Status &amp; Real-Time Note: </strong>
            <span>{project.currentStatusNote}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
