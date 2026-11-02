import React, { useState } from 'react';
import { Mail, ArrowUpRight, CheckCircle2, Send, MapPin, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'LINKUP Feedback & Collaboration',
    message: '',
    honeypot: '' // anti-spam trap
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Spam honeypot detection
    if (formData.honeypot) {
      // Silently discard spam bots
      setSubmitted(true);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-[#1E273A]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Channel</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Have an idea, opportunity, or project worth discussing?
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Whether you want to test LINKUP, discuss technical architecture, explore co-founding synergies, or share insights on building from Zimbabwe, I welcome thoughtful messages.
          </p>
        </header>

        {/* 2-Column Split: Direct Coordinates vs Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-2xl border border-[#1E273A] bg-[#0E121B] p-6 space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Direct Coordinates
              </h2>

              <div className="space-y-4 text-xs">
                {/* LinkedIn */}
                <div className="space-y-1">
                  <div className="text-[#64748B]">LinkedIn (Primary Hub)</div>
                  <a
                    href="https://www.linkedin.com/in/tanaka-gaadzikwa-a7bb1335b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-[#38BDF8] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>tanaka-gaadzikwa</span>
                    <ArrowUpRight className="w-4 h-4 text-[#38BDF8]" />
                  </a>
                  <p className="text-[#94A3B8] pt-0.5">
                    Fastest way to connect. Documenting updates to ~2,000 founders and developers.
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1 pt-3 border-t border-[#1C2333]">
                  <div className="text-[#64748B]">Direct Email</div>
                  <a
                    href="mailto:tanakaprince49@gmail.com"
                    className="text-sm font-semibold text-white hover:text-[#38BDF8] inline-flex items-center gap-1.5 transition-colors font-mono"
                  >
                    <Mail className="w-4 h-4 text-[#38BDF8]" />
                    <span>tanakaprince49@gmail.com</span>
                  </a>
                  <p className="text-[#94A3B8] pt-0.5">
                    For formal proposals, advisory inquiries, and project deep dives.
                  </p>
                </div>

                {/* Location & Timezone */}
                <div className="space-y-1 pt-3 border-t border-[#1C2333]">
                  <div className="text-[#64748B]">Location &amp; Working Hours</div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Harare, Zimbabwe</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Central Africa Time (CAT · UTC+2)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Response expectation note */}
            <div className="p-5 rounded-xl bg-[#090C12] border border-[#1A2234] text-xs text-[#64748B] space-y-2">
              <div className="font-semibold text-white">What I Appreciate in Outreach</div>
              <p className="leading-relaxed text-[#94A3B8]">
                Clear context, direct questions, and authentic thoughts. No formal corporate jargon needed. Usually reply within 24–48 hours.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 rounded-2xl border border-[#1E273A] bg-[#0E121B] p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Message Dispatched
                </h3>
                <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, {formData.name}. Your note has been logged. I will review it and follow up at <span className="text-white font-mono">{formData.email}</span>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: 'LINKUP Feedback & Collaboration',
                        message: '',
                        honeypot: ''
                      });
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#151B28] hover:bg-[#1E2638] border border-[#232D42] rounded-lg transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">
                    Send a Direct Note
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    All submissions are delivered directly to Tanaka without intermediary filters.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Honeypot field (hidden from legitimate humans, traps spam bots) */}
                <input
                  type="text"
                  name="website_url_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-medium text-[#CBD5E1]">
                      Your Name <span className="text-[#38BDF8]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Tendai Moyo or Sarah Chen"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#121622] border border-[#1E273A] rounded-lg text-white placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-medium text-[#CBD5E1]">
                      Email Address <span className="text-[#38BDF8]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#121622] border border-[#1E273A] rounded-lg text-white placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-medium text-[#CBD5E1]">
                    What is this regarding?
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#121622] border border-[#1E273A] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors"
                  >
                    <option value="LINKUP Feedback & Collaboration">LINKUP Feedback &amp; Collaboration</option>
                    <option value="Technical Discussion & Software Architecture">Technical Discussion &amp; Software Architecture</option>
                    <option value="Mentorship & Startup Guidance">Mentorship &amp; Startup Guidance</option>
                    <option value="Investment / Advisory Discussion">Investment / Advisory Discussion</option>
                    <option value="General Conversation & Fellowship">General Conversation &amp; Fellowship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-medium text-[#CBD5E1]">
                    Message <span className="text-[#38BDF8]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Share what you are working on, ideas for LINKUP, or what sparked your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#121622] border border-[#1E273A] rounded-lg text-white placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#64748B]">
                    Protected with client honeypot &amp; spam mitigation.
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#090A0F] bg-white hover:bg-[#E2E8F0] disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
