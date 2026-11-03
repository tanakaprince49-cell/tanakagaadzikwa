import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail, Globe, CheckCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
  onNavigateBlogs: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
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
            <Shield className="w-3.5 h-3.5" />
            <span>Official Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Effective Date: November 3, 2026 · Last Updated: November 2026
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            Applicable to the website <strong className="text-white">https://tanakagaadzikwa.com</strong> and associated subdomains, publishing tools, and authentication services operated by Tanaka Gaadzikwa.
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <Globe className="w-5 h-5 text-sky-400" />
              <h2>1. Introduction & Overview</h2>
            </div>
            <p>
              Welcome to <strong className="text-white">tanakagaadzikwa.com</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or the &quot;Platform&quot;). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines our practices regarding data collection, use, disclosure, and security when you visit our website, read articles, authenticate via Google Sign-In, or publish blog content.
            </p>
            <p>
              By accessing our website or signing in, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <Eye className="w-5 h-5 text-sky-400" />
              <h2>2. Information We Collect</h2>
            </div>
            <p>We collect only the minimum information necessary to provide an authentic, community-driven publishing experience:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2">
              <li>
                <strong className="text-white">Google OAuth Authentication Data:</strong> When you sign in using Google, we receive basic identity information authorized by you via Google OAuth: your full name, email address, and public profile avatar URL.
              </li>
              <li>
                <strong className="text-white">Author Profile & Bio:</strong> Any bio text, author name, or personal details you voluntarily provide in your author profile to accompany your published articles.
              </li>
              <li>
                <strong className="text-white">User Generated Content:</strong> Articles, titles, rich text content, category tags, custom read times, cover images, and like interactions you submit to the Platform.
              </li>
              <li>
                <strong className="text-white">Technical & Usage Logs:</strong> Standard web analytics (such as browser type, timestamps, and page visits) used strictly to monitor site health, responsiveness, and performance.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4 border-l-4 border-l-sky-500">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <CheckCircle className="w-5 h-5 text-sky-400" />
              <h2>3. Google API Services User Data Policy Compliance</h2>
            </div>
            <p>
              Our application adheres strictly to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Specifically:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2">
              <li>
                We request only the minimum required basic authentication scopes (<code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded text-sky-300">openid</code>, <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded text-sky-300">profile</code>, and <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded text-sky-300">email</code>).
              </li>
              <li>
                We do <strong className="text-white">NOT</strong> sell, transfer, or rent your personal Google user data or credentials to third parties, advertising networks, or data brokers.
              </li>
              <li>
                We use your Google profile identity exclusively to verify your identity, secure author credentials, and attribute published posts to you.
              </li>
              <li>
                We do <strong className="text-white">NOT</strong> use Google user data to serve targeted advertisements.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <Lock className="w-5 h-5 text-sky-400" />
              <h2>4. How We Protect and Store Your Data</h2>
            </div>
            <p>
              Data is stored securely on Google Cloud Platform and Firebase Firestore infrastructure. All network requests use modern TLS/SSL encryption in transit, and database records are governed by strict security rules so that only authenticated authors can edit or delete their own posts.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <FileText className="w-5 h-5 text-sky-400" />
              <h2>5. Your Rights & Data Deletion</h2>
            </div>
            <p>
              You maintain ownership and control over your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2">
              <li>You can delete any article you have published directly from the interface at any time.</li>
              <li>You can revoke our app&apos;s access to your Google Account at any time through your Google Security Settings (<a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">myaccount.google.com/permissions</a>).</li>
              <li>You may request complete deletion of your account record and associated data by emailing us at <strong className="text-white">tanakaprince49@gmail.com</strong>.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-[#0e1628] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white font-medium text-lg">
              <Mail className="w-5 h-5 text-sky-400" />
              <h2>6. Contact Us</h2>
            </div>
            <p>
              If you have any questions or inquiries regarding this Privacy Policy, your personal information, or our compliance with Google OAuth standards, please contact:
            </p>
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-sm space-y-1">
              <p><strong className="text-white">Data Controller:</strong> Tanaka Gaadzikwa</p>
              <p><strong className="text-white">Primary Domain:</strong> tanakagaadzikwa.com</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:tanakaprince49@gmail.com" className="text-sky-400 hover:text-sky-300 underline">tanakaprince49@gmail.com</a></p>
              <p><strong className="text-white">Location:</strong> Harare, Zimbabwe</p>
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
