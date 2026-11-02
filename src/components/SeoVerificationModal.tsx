import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Globe, Search, Shield, FileText } from 'lucide-react';

interface SeoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoVerificationModal: React.FC<SeoVerificationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'sitemap' | 'schema' | 'growth'>('console');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const personJsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://tanakagaadzikwa.com/#person",
      "name": "Tanaka Gaadzikwa",
      "givenName": "Tanaka",
      "familyName": "Gaadzikwa",
      "url": "https://tanakagaadzikwa.com/",
      "jobTitle": "Software Builder & Entrepreneur",
      "description": "Young entrepreneur and software builder from Harare, Zimbabwe, building LINKUP and exploring practical applications of artificial intelligence and startup collaboration.",
      "homeLocation": {
        "@type": "Place",
        "name": "Harare, Zimbabwe"
      },
      "nationality": {
        "@type": "Country",
        "name": "Zimbabwe"
      },
      "knowsAbout": [
        "Software Development",
        "Artificial Intelligence",
        "Entrepreneurship",
        "Startups",
        "Venture Ecosystems",
        "Founder Networking",
        "Full-Stack Web Development"
      ],
      "sameAs": [
        "https://www.linkedin.com/in/tanaka-gaadzikwa-a7bb1335b/"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://tanakagaadzikwa.com/#linkup",
      "name": "LINKUP",
      "operatingSystem": "Web",
      "applicationCategory": "ProductivityApplication",
      "creator": {
        "@id": "https://tanakagaadzikwa.com/#person"
      },
      "description": "AI-assisted founder discovery and intentional collaborator matching for software builders and creators."
    }
  ]
}`;

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tanakagaadzikwa.com/</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tanakagaadzikwa.com/about</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tanakagaadzikwa.com/projects</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tanakagaadzikwa.com/writing</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tanakagaadzikwa.com/now</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://tanakagaadzikwa.com/contact</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D111A] border border-[#232C3F] p-6 sm:p-8 shadow-2xl text-[#E2E8F0] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1E2638]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
              <Search className="w-3.5 h-3.5" />
              <span>Technical SEO &amp; Brand Authority Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Tanaka Gaadzikwa · Webmaster &amp; Search Visibility Toolkit
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Actionable configuration steps, structured data, and the 90-day execution roadmap to establish authoritative Google rankings for &quot;Tanaka Gaadzikwa&quot;.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg bg-[#141925] border border-[#222B3D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1C2333] pb-3 text-xs font-medium">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'console'
                ? 'bg-[#182133] text-white border border-[#273652]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            1. Search Console Setup
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'sitemap'
                ? 'bg-[#182133] text-white border border-[#273652]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            2. Sitemap &amp; Robots.txt
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'schema'
                ? 'bg-[#182133] text-white border border-[#273652]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            3. Schema.org JSON-LD
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'growth'
                ? 'bg-[#182133] text-white border border-[#273652]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            4. 90-Day Authority Plan
          </button>
        </div>

        {/* Tab 1: Google Search Console & Bing Guide */}
        {activeTab === 'console' && (
          <div className="space-y-4 text-xs text-[#CBD5E1]">
            <div className="p-4 rounded-xl bg-[#111724] border border-[#1E273B] space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                Step-by-Step Verification Protocol for Tanaka
              </h3>
              <ol className="list-decimal pl-4 space-y-2 text-[#94A3B8] leading-relaxed">
                <li>
                  <strong className="text-white">Domain DNS Ownership:</strong> Open{' '}
                  <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">
                    Google Search Console
                  </a>
                  , enter your custom domain (e.g. <code className="text-white font-mono">tanakagaadzikwa.com</code>), and copy the TXT verification token into your DNS provider (Cloudflare, Namecheap, or Porkbun).
                </li>
                <li>
                  <strong className="text-white">Submit XML Sitemap:</strong> Navigate to &quot;Sitemaps&quot; in the left sidebar and submit <code className="text-white font-mono">/sitemap.xml</code>.
                </li>
                <li>
                  <strong className="text-white">Request Initial Indexing:</strong> Use the &quot;URL Inspection&quot; bar at the top, enter your homepage URL, and click &quot;Request Indexing&quot;.
                </li>
                <li>
                  <strong className="text-white">Bing Webmaster Tools:</strong> Import directly from Google Search Console at{' '}
                  <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">
                    bing.com/webmasters
                  </a>{' '}
                  with 1 click to sync index coverage for Microsoft Bing &amp; Copilot.
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-[#111622] border border-[#1E2536] space-y-2">
              <div className="text-xs font-semibold text-white">Recommended TXT DNS Record Example:</div>
              <div className="flex items-center justify-between p-2.5 rounded bg-[#090C12] font-mono text-[11px] text-[#38BDF8] border border-[#1A2234]">
                <span>google-site-verification=tanaka-official-identity-verification-token</span>
                <button
                  onClick={() => copyToClipboard('google-site-verification=tanaka-official-identity-verification-token', 'txt')}
                  className="p-1 hover:text-white"
                >
                  {copiedKey === 'txt' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sitemap & Robots */}
        {activeTab === 'sitemap' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#38BDF8]" />
                Generated Canonical Sitemap (XML)
              </span>
              <button
                onClick={() => copyToClipboard(sitemapXml, 'sitemap')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141925] border border-[#222B3D] text-[#94A3B8] hover:text-white rounded transition-colors"
              >
                {copiedKey === 'sitemap' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>Copy XML</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#090C12] border border-[#1C2333] text-[11px] font-mono text-[#94A3B8] overflow-x-auto leading-relaxed">
              {sitemapXml}
            </pre>

            <div className="space-y-2 pt-2">
              <div className="font-semibold text-white">Robots.txt Directives:</div>
              <pre className="p-3 rounded-lg bg-[#090C12] border border-[#1C2333] text-[11px] font-mono text-[#38BDF8]">
{`User-agent: *
Allow: /
Sitemap: https://tanakagaadzikwa.com/sitemap.xml`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Schema.org JSON-LD */}
        {activeTab === 'schema' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#38BDF8]" />
                Validated Schema.org (Person &amp; SoftwareApplication)
              </span>
              <button
                onClick={() => copyToClipboard(personJsonLd, 'schema')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141925] border border-[#222B3D] text-[#94A3B8] hover:text-white rounded transition-colors"
              >
                {copiedKey === 'schema' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>Copy JSON-LD</span>
              </button>
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              Already embedded in <code className="text-white">&lt;head&gt;</code> of <code className="text-white">index.html</code>. Connects Tanaka&apos;s name, location, knowsAbout topics, sameAs LinkedIn URL, and LINKUP software application.
            </p>
            <pre className="p-4 rounded-xl bg-[#090C12] border border-[#1C2333] text-[11px] font-mono text-[#38BDF8] overflow-x-auto max-h-60">
              {personJsonLd}
            </pre>
          </div>
        )}

        {/* Tab 4: 90-Day Authority Growth Plan */}
        {activeTab === 'growth' && (
          <div className="space-y-4 text-xs text-[#CBD5E1]">
            <div className="p-4 rounded-xl bg-[#111724] border border-[#1E273B] space-y-3">
              <h3 className="text-sm font-semibold text-white">
                90-Day Personal Brand &amp; Entity Grounding Plan
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <strong className="text-[#38BDF8]">Days 1–30: Entity Foundation &amp; Indexation</strong>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Verify domain in Google Search Console. Ensure title tags and H1 headers consistently feature &quot;Tanaka Gaadzikwa&quot;. Update Tanaka&apos;s LinkedIn profile header to link to the official domain as his primary website.
                  </p>
                </div>
                <div className="space-y-1">
                  <strong className="text-[#38BDF8]">Days 31–60: Build-in-Public Cross-Pollination</strong>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Publish 1 high-conviction article per month on the site, then post a concise summary thread on LinkedIn linking back to the canonical essay. This generates legitimate human inbound traffic and natural social signals.
                  </p>
                </div>
                <div className="space-y-1">
                  <strong className="text-[#38BDF8]">Days 61–90: Ecosystem Partnerships &amp; Natural Backlinks</strong>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Participate in African tech podcasts, founder interviews, and community panels (e.g. Harare Tech Meetups, GitHub open-source showcases). Each authentic external citation reinforces knowledge panel recognition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[#1E2638] flex items-center justify-between text-xs text-[#64748B]">
          <span>Prepared for Tanaka Gaadzikwa · Built for Sustainable SEO</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-[#090A0F] font-semibold rounded-lg hover:bg-[#E2E8F0] transition-colors"
          >
            Close Toolkit
          </button>
        </div>

      </div>
    </div>
  );
};
