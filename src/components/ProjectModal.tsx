import React, { useState } from 'react';
import { X, ExternalLink, Calendar, Tag, User, Play, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Project } from '../types.js';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = project.images && project.images.length > 0 ? project.images : [project.coverImage];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0b0f17] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white border border-white/15 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Section: Image Gallery or Video */}
        <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden group">
          <img
            src={images[activeImageIndex]}
            alt={`${project.title} gallery view ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Multiple Image Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeImageIndex ? 'w-5 bg-[#FF5500]' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Category Pill on Image */}
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FF5500] text-white shadow-lg">
              {project.category}
            </span>
          </div>
        </div>

        {/* Video Player if available */}
        {project.videoUrl && (
          <div className="p-6 bg-neutral-900/60 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00E5FF] uppercase tracking-wider mb-2">
              <Play className="w-3.5 h-3.5" />
              <span>Video Demonstration</span>
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-black max-h-[360px]">
              <video
                src={project.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={project.coverImage}
              >
                Your browser does not support the video element.
              </video>
            </div>
          </div>
        )}

        {/* Project Details Body */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {project.title}
            </h3>

            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                ★ Featured Case Study
              </span>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-6 py-4 mb-6 border-y border-white/10 text-xs sm:text-sm text-neutral-300">
            {project.client && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF5500]" />
                <span className="text-neutral-400">Client:</span>
                <span className="font-semibold text-white">{project.client}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-neutral-400">Completed:</span>
              <span className="font-semibold text-white">{project.projectDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-neutral-400">Category:</span>
              <span className="font-semibold text-white">{project.category}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-2">
              Overview &amp; Execution
            </h4>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Tools & Tech Stack */}
          {project.tools && project.tools.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Technologies &amp; Creative Tools</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-300 font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
