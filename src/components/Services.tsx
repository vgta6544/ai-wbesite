import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types.js';

interface ServicesProps {
  services: Service[];
  loading?: boolean;
}

export const Services: React.FC<ServicesProps> = ({ services, loading }) => {
  // Only display enabled services on public site, sorted by sortOrder
  const activeServices = services
    .filter((s) => s.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Helper to dynamically render a Lucide icon by name
  const renderIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = LucideIcons[iconName] || LucideIcons.Sparkles;
    return <IconComponent className="w-6 h-6 text-[#FF5500] group-hover:text-[#00E5FF] transition-colors" />;
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#05070B]/60">
      {/* Background radial accent */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#FF5500]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#FF5500] font-medium mb-3">
            <LucideIcons.Layers className="w-3.5 h-3.5" />
            <span>Specialized Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display mb-4">
            Services &amp; Capabilities
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            High-caliber creative and technical solutions designed to amplify digital presence and convert audiences.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-neutral-400 text-sm flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin" />
            <span>Loading services...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && activeServices.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 max-w-md mx-auto">
            <LucideIcons.Layers className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
            <div className="text-lg font-bold text-white mb-1">Services coming soon</div>
            <div className="text-xs text-neutral-400">
              Services are currently being updated in the administrator dashboard.
            </div>
          </div>
        )}

        {/* Dynamic Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service, index) => (
            <div
              key={service.id}
              className="group relative p-7 rounded-2xl bg-[#0a0e16]/80 border border-white/10 hover:border-[#FF5500]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF5500]/10 flex flex-col justify-between backdrop-blur-sm"
            >
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                  {renderIcon(service.icon)}
                </div>
                <span className="text-[11px] font-mono text-neutral-500 font-semibold">
                  0{index + 1}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-display mb-3 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-neutral-400 group-hover:text-[#00E5FF] transition-colors">
                <span>Inquire details</span>
                <LucideIcons.ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
