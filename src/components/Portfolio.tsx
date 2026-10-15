import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Play, Eye, Layers } from 'lucide-react';
import { Project, ProjectCategory } from '../types.js';
import { ProjectModal } from './ProjectModal.js';

interface PortfolioProps {
  projects: Project[];
  loading?: boolean;
}

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Graphic Design',
  'Branding',
  'Social Media',
  'CGI',
  'UGC Ads',
  'Websites',
  'Other',
];

export const Portfolio: React.FC<PortfolioProps> = ({ projects, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Filter projects by category
  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === 'All') return true;
    return project.category === selectedCategory;
  });

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00E5FF]/5 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#FF5500]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#00E5FF] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Case Studies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
              Featured Portfolio
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-3">
              Explore dynamic commercial projects across 3D CGI simulation, responsive web systems, brand identity, and viral digital media.
            </p>
          </div>

          <div className="text-xs text-neutral-400 font-mono">
            Showing {filteredProjects.length} of {projects.length} project{projects.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Category Filters Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#ff7700] text-white shadow-lg shadow-[#FF5500]/25'
                    : 'bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center text-neutral-400 text-sm flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
            <span>Loading projects...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="p-16 text-center rounded-3xl bg-neutral-900/40 border border-white/10 max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-display">
              Projects coming soon.
            </h3>
            <p className="text-sm text-neutral-400">
              No projects found under the &quot;{selectedCategory}&quot; category. Check back soon or switch categories above.
            </p>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group relative rounded-2xl bg-[#0d121c]/80 border border-white/10 overflow-hidden hover:border-[#FF5500]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF5500]/15 flex flex-col cursor-pointer backdrop-blur-sm"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/15">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FF5500] text-white shadow-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Video Indicator */}
                {project.videoUrl && (
                  <div className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-[#00E5FF] border border-white/15">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}

                {/* Hover Quick Action Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-neutral-900 text-xs font-bold shadow-xl transition-transform transform scale-90 group-hover:scale-100">
                    <Eye className="w-4 h-4" />
                    <span>View Case Study</span>
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-neutral-400 font-medium mb-1.5 flex items-center justify-between">
                    <span>{project.projectDate}</span>
                    {project.client && (
                      <span className="text-neutral-500 truncate max-w-[120px]">
                        {project.client}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mb-2.5 line-clamp-1 group-hover:text-[#FF5500] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Tools Chips */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-neutral-300 font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-neutral-400 font-mono">
                        +{project.tools.length - 3}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#00E5FF] transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
};
