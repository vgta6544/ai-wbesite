import React, { useState } from 'react';
import { Mail, Send, Sparkles, Phone, MapPin, CheckCircle2, AlertCircle, MessageSquare, Instagram, Globe } from 'lucide-react';
import { sendMessage } from '../services/api.js';
import { SiteSettings } from '../types.js';

interface ContactProps {
  settings: SiteSettings | null;
}

export const Contact: React.FC<ContactProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // honeypot spam protection
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await sendMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        honeypot: formData.honeypot,
      });
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const email = settings?.email;
  const whatsapp = settings?.whatsapp;
  const location = settings?.location;
  const availability = settings?.availabilityStatus;
  const socialLinks = settings?.socialLinks || {};

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#07090e]/80">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#FF5500]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Direct Information & Direct CTA Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#FF5500] font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Inquiries</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display mb-4">
                Let&apos;s Create Something Great.
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
                Whether you need a full 3D CGI product campaign, an interactive website, or a distinctive brand identity, send a message to discuss your scope.
              </p>

              {/* Status and Availability Card */}
              {availability && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-white">Current Availability</div>
                    <div className="text-neutral-400">{availability}</div>
                  </div>
                </div>
              )}

              {/* Direct Reach Cards */}
              <div className="space-y-3.5 mb-8">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/70 border border-white/10 hover:border-[#FF5500]/40 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Email Directly</div>
                      <div className="text-sm font-bold text-white group-hover:text-[#FF5500] transition-colors">{email}</div>
                    </div>
                  </a>
                )}

                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/70 border border-white/10 hover:border-emerald-400/40 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">WhatsApp Business</div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{whatsapp}</div>
                    </div>
                  </a>
                )}

                {location && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/70 border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Location</div>
                      <div className="text-sm font-medium text-white">{location}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Configured Social Media Icons - Retaining LinkedIn & Instagram */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-neutral-400 uppercase font-semibold tracking-wider mb-3">
                  Direct Networks
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={socialLinks.instagram || 'https://instagram.com/zohair.design'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    Instagram
                  </a>

                  <a
                    href={socialLinks.linkedin || 'https://linkedin.com/in/zohair-creative'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0d121c]/80 border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-[#FF5500]" />
                <h3 className="text-xl font-bold text-white font-display">Send a Direct Message</h3>
              </div>

              {success ? (
                <div className="p-8 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white mb-2">Message Sent Successfully!</h4>
                  <p className="text-sm text-neutral-300 mb-6">
                    Thanks! Your message has been sent successfully and routed directly to Zohair&apos;s admin inbox. You will receive a response shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot spam trap */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={handleChange}
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-neutral-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF5500] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-neutral-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="sarah@brand.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF5500] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-neutral-300 mb-2">
                      Subject / Project Scope *
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="e.g. 3D Product Ad or New Website Build"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF5500] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-neutral-300 mb-2">
                      Project Details &amp; Objectives *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Describe your vision, timeline, and deliverables..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF5500] transition-colors resize-y"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#ff7700] hover:from-[#ff6611] hover:to-[#ff8822] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#FF5500]/25 transition-all duration-200 active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
