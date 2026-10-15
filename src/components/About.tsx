import React from 'react';
import { Palette, Code, Box, Video, Sparkles, CheckCircle2, Cpu } from 'lucide-react';
import { SiteSettings } from '../types.js';

interface AboutProps {
  settings: SiteSettings | null;
}

export const About: React.FC<AboutProps> = ({ settings }) => {
  const bio =
    settings?.bio ||
    'Zohair is a multidisciplinary designer and creative developer focused on crafting distinct visual identities, high-fidelity 3D CGI advertisements, and modern, high-performance web applications. Working at the intersection of aesthetic design and software engineering, each project is delivered with obsessive attention to craft, typography, and interactive responsiveness.';

  const infoCards = [
    {
      title: 'Graphic Design',
      description: 'Brand visuals, social media graphics, marketing materials and creative assets.',
      icon: Palette,
      gradient: 'from-[#FF5500]/20 to-[#FF8800]/5',
      borderColor: 'group-hover:border-[#FF5500]/40',
      iconColor: 'text-[#FF5500]',
      highlight: 'Vectors & Identity',
    },
    {
      title: 'Web Development',
      description: 'Modern responsive websites and interactive digital experiences.',
      icon: Code,
      gradient: 'from-[#00E5FF]/20 to-[#0088FF]/5',
      borderColor: 'group-hover:border-[#00E5FF]/40',
      iconColor: 'text-[#00E5FF]',
      highlight: 'React & Three.js',
    },
    {
      title: 'CGI & Visual Content',
      description: 'Product visuals, CGI advertisements and creative promotional content.',
      icon: Box,
      gradient: 'from-[#FFAA00]/20 to-[#FF5500]/5',
      borderColor: 'group-hover:border-[#FFAA00]/40',
      iconColor: 'text-[#FFAA00]',
      highlight: 'Ray-traced Renders',
    },
    {
      title: 'Content Creation',
      description: 'Visual content designed for social platforms and digital marketing.',
      icon: Video,
      gradient: 'from-[#00FF9D]/20 to-[#00E5FF]/5',
      borderColor: 'group-hover:border-[#00FF9D]/40',
      iconColor: 'text-[#00FF9D]',
      highlight: 'UGC & Motion Pacing',
    },
  ];

  const tools = [
    'Blender 4.2',
    'Cinema 4D',
    'Unreal Engine',
    'Figma',
    'React 19',
    'TypeScript',
    'Three.js',
    'Tailwind CSS',
    'After Effects',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'DaVinci Resolve',
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#00E5FF] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile &amp; Approach</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display mb-6">
            Creative Mind. Digital Builder.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            {bio}
          </p>
        </div>

        {/* 4 Animated Core Focus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {infoCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`group relative p-6 rounded-2xl bg-[#0b0f17]/80 border border-white/10 ${card.borderColor} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-sm`}
              >
                {/* Accent top gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${card.iconColor}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/5 text-neutral-400">
                      {card.highlight}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-display mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="relative z-10 pt-5 mt-5 border-t border-white/5 flex items-center gap-2 text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skills & Tools Ecosystem (Section 5 requirement) */}
        <div id="skills" className="p-8 rounded-3xl bg-[#0d121c]/70 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5500] uppercase tracking-wider mb-1">
                <Cpu className="w-4 h-4" />
                <span>Technical Stack &amp; Software Suite</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Engineered with Industry Standard Tools
              </h3>
            </div>
            <div className="text-xs text-neutral-400 max-w-sm">
              From low-level WebGL shaders and full-stack React architectures to photorealistic CGI simulations in Blender and Cinema 4D.
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {tools.map((tool) => (
              <div
                key={tool}
                className="px-4 py-2 rounded-xl bg-neutral-900/90 border border-white/10 text-neutral-200 text-xs sm:text-sm font-medium hover:border-[#FF5500]/50 hover:text-white hover:bg-neutral-800 transition-all cursor-default"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
