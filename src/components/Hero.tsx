import React from 'react';
import { ArrowRight, Sparkles, Code2, Box, Palette, Video } from 'lucide-react';
import { Hero3DCanvas } from './Hero3DCanvas.js';
import { SiteSettings } from '../types.js';

interface HeroProps {
  settings: SiteSettings | null;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const headline = settings?.heroTitle || "Hi, I'm Zohair.";
  const subtitle = settings?.heroSubtitle || "Graphic Designer • Web Developer • CGI Designer • Content Creator";
  const description = settings?.heroDescription || "Designing bold visuals, immersive digital experiences and creative websites that help brands stand out.";
  const primaryCta = settings?.primaryCta || "View My Work";
  const secondaryCta = settings?.secondaryCta || "Let's Work Together";

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const disciplines = [
    { label: '3D & CGI Advertising', icon: Box, color: 'text-[#FF5500]' },
    { label: 'Modern Web Engineering', icon: Code2, color: 'text-[#00E5FF]' },
    { label: 'Visual Identity & Branding', icon: Palette, color: 'text-[#FFAA00]' },
    { label: 'Dynamic Content & UGC', icon: Video, color: 'text-[#00FF9D]' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[95vh] pt-32 pb-20 lg:pt-36 lg:pb-28 flex items-center justify-center overflow-hidden"
    >
      {/* 3D Interactive Canvas in the Full Background */}
      <Hero3DCanvas fullBackground={true} />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FF5500]/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-[#00E5FF]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            {/* Creative Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
              <span className="font-medium">Portfolio &amp; Creative Studio</span>
              <span className="text-neutral-600">•</span>
              <span className="text-[#00E5FF] font-semibold">2026 Edition</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] font-display mb-6">
              {headline}
            </h1>

            {/* Professional Positioning Subheading */}
            <p className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#FF5500] via-[#FFAA00] to-[#00E5FF] bg-clip-text text-transparent mb-5 leading-snug">
              {subtitle}
            </p>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed mb-8">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                id="hero-primary-cta"
                onClick={() => handleScrollTo('portfolio')}
                className="group relative px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#ff7700] hover:from-[#ff6611] hover:to-[#ff8822] text-white font-semibold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-[#FF5500]/25 hover:shadow-[#FF5500]/40 transition-all duration-200 active:scale-98 cursor-pointer"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => handleScrollTo('contact')}
                className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-medium text-sm sm:text-base border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-98 cursor-pointer"
              >
                <span>{secondaryCta}</span>
              </button>
            </div>

            {/* Disciplines Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full pt-4 border-t border-white/10">
              {disciplines.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 py-2 px-2.5 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md"
                  >
                    <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                    <span className="text-[11px] font-medium text-neutral-200 leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Floating Showcase Cards */}
          <div className="lg:col-span-4 flex flex-col gap-4 items-start lg:items-end justify-center">
            {/* Floating 3D Badge 1 */}
            <div className="p-4 rounded-2xl bg-[#0e131e]/80 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-3.5 hover:border-[#FF5500]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FF5500]/20 flex items-center justify-center text-[#FF5500]">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Ray-traced</div>
                <div className="text-sm font-bold text-white">3D &amp; CGI Visuals</div>
                <div className="text-[11px] text-neutral-400">Full background WebGL simulation</div>
              </div>
            </div>

            {/* Floating 3D Badge 2 */}
            <div className="p-4 rounded-2xl bg-[#0e131e]/80 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-3.5 hover:border-[#00E5FF]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Interactive</div>
                <div className="text-sm font-bold text-white">Full-Stack Code</div>
                <div className="text-[11px] text-neutral-400">Reactive high-performance UI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
