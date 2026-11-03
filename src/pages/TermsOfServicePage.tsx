import React from 'react';
import { ArrowLeft, BookOpen, ShieldCheck, Scale, FileCheck, Mail, Globe } from 'lucide-react';

interface TermsOfServicePageProps {
  onNavigateHome: () => void;
  onNavigateBlogs: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({
  onNavigateHome,
  onNavigateBlogs,
}) => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-zinc-200 py-16 px-6 sm:px-8 lg:px-16 selection:bg-sky-500/30 selection:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-800/80 mb-10">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <button
              onClick={onNavigateBlogs}
              className="text-sky-400 hover:text-sky-300 underline underline-offset-4 cursor-pointer"
            >
              Explore Blogs
            </button>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-500">Domain: tanakagaadzikwa.com</span>
          </div>
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium tracking-wide mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Effective Date: November 3, 2026 · Last Updated: November 2026
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            Governing the use of <strong className="text-white">https://tanakagaadzikwa.com</strong> and all connected blog authoring, reader, and authentication tools.
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <Scale className="w-5 h-5 text-sky-400" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p>
              By accessing or using <strong className="text-white">tanakagaadzikwa.com</strong> (&quot;Website&quot;, &quot;Platform&quot;, &quot;Service&quot;), including signing in via Google Authentication or creating blog publications, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <h2>2. User Accounts & Google Sign-In</h2>
            </div>
            <p>
              To publish articles or curate content on the platform, you may sign in using your verified Google Account. You agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2">
              <li>You will provide accurate account details and maintain the security of your access credentials.</li>
              <li>You are solely responsible for all activities and content published through your authenticated account.</li>
              <li>You may disconnect or delete your account at any time.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <FileCheck className="w-5 h-5 text-sky-400" />
              <h2>3. Content Ownership and License</h2>
            </div>
            <p>
              <strong className="text-white">You own what you create:</strong> Authors retain 100% intellectual property ownership of the articles, essays, and media they upload to the Platform.
            </p>
            <p>
              By submitting content to tanakagaadzikwa.com, you grant us a worldwide, non-exclusive, royalty-free license to host, format, index for search engines (SEO), display, and distribute your content across our platform and readers so readers can discover and engage with your work.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <Globe className="w-5 h-5 text-sky-400" />
              <h2>4. Acceptable Use Policy</h2>
            </div>
            <p>When participating in our open builder community, you agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2">
              <li>Publish defamatory, abusive, harassing, hateful, or infringing material.</li>
              <li>Post automated spam, scam solicitations, malware, or destructive code.</li>
              <li>Impersonate another individual, author, or entity without authorization.</li>
              <li>Attempt to circumvent security measures or access restrictions on our databases and APIs.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <Mail className="w-5 h-5 text-sky-400" />
              <h2>5. Contact & Inquiries</h2>
            </div>
            <p>
              For legal inquiries, copyright notices, or questions regarding these Terms of Service, please reach out directly:
            </p>
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-sm space-y-1">
              <p><strong className="text-white">Website Owner:</strong> Tanaka Gaadzikwa</p>
              <p><strong className="text-white">Domain:</strong> tanakagaadzikwa.com</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:tanakaprince49@gmail.com" className="text-sky-400 hover:text-sky-300 underline">tanakaprince49@gmail.com</a></p>
              <p><strong className="text-white">Jurisdiction:</strong> Harare, Zimbabwe</p>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            ← Back to Homepage
          </button>
          <button
            onClick={onNavigateBlogs}
            className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-sky-500/20"
          >
            Visit Blogs Community →
          </button>
        </div>
      </div>
    </div>
  );
};
