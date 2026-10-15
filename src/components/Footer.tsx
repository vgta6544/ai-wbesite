import React from 'react';
import { Sparkles, ArrowUp, Shield } from 'lucide-react';
import { SiteSettings } from '../types.js';

interface FooterProps {
  settings: SiteSettings | null;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isOnline = settings ? settings.isOnline !== false : true;
  const socialLinks = settings?.socialLinks || {};

  return (
    <footer className="relative bg-[#05070a] border-t border-white/10 pt-16 pb-12 overflow-hidden text-neutral-400">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-gradient-to-t from-[#FF5500]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3.5 mb-2">
              <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">
                ZOHAIR
              </h3>

              {/* Real-time Status Light (Blue = Online, Red = Offline) */}
              <div
                className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                  isOnline
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
                    : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
                }`}
                title={isOnline ? 'Online (Blue Light Active)' : 'Offline (Red Light Active)'}
              >
                <div className="relative flex items-center justify-center w-2.5 h-2.5">
                  {isOnline ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></span>
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></span>
                  )}
                </div>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            <p className="text-sm text-neutral-300 font-medium">
              Graphic Designer • Web Developer • CGI Designer • Content Creator
            </p>
          </div>

          {/* Social Links: Retain LinkedIn and Instagram only */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={socialLinks.instagram || 'https://instagram.com/zohair.design'}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-neutral-900 border border-white/10 hover:border-[#FF5500]/50 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Instagram</span>
            </a>

            <a
              href={socialLinks.linkedin || 'https://linkedin.com/in/zohair-creative'}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-neutral-900 border border-white/10 hover:border-[#00E5FF]/50 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <span>LinkedIn</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all ml-2 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright & Discreet Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Zohair. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-neutral-500">Autonomous Creative Agency Standard</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-[#00E5FF] transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
