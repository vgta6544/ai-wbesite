import React, { useState } from 'react';
import {
  FolderKanban,
  Star,
  Inbox,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Mail,
  CheckCircle2,
  TrendingUp,
  Layers,
  Radio,
} from 'lucide-react';
import { Project, Service, ContactMessage, SiteSettings } from '../types.js';
import { AdminTab } from './AdminSidebar.js';
import { updateSiteSettings } from '../services/api.js';

interface AdminDashboardProps {
  projects: Project[];
  services: Service[];
  messages: ContactMessage[];
  settings: SiteSettings | null;
  onSelectTab: (tab: AdminTab) => void;
  onOpenNewProject: () => void;
  onOpenNewService: () => void;
  onRefreshData?: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  services,
  messages,
  settings,
  onSelectTab,
  onOpenNewProject,
  onOpenNewService,
  onRefreshData,
}) => {
  const [togglingStatus, setTogglingStatus] = useState(false);
  const isOnline = settings ? settings.isOnline !== false : true;

  const handleToggleOnline = async () => {
    try {
      setTogglingStatus(true);
      await updateSiteSettings({ isOnline: !isOnline });
      if (onRefreshData) await onRefreshData();
    } catch (err) {
      console.error('Failed to toggle online status:', err);
    } finally {
      setTogglingStatus(false);
    }
  };

  const totalProjects = projects.length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => m.status === 'New').length;
  const activeServices = services.filter((s) => s.enabled).length;

  const recentProjects = projects.slice(0, 4);
  const recentMessages = messages.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111622] via-[#0f141f] to-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5500] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Executive Control Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Welcome back, Zohair
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
              Manage your dynamic portfolio, live service catalog, and client inquiries from this centralized console.
            </p>
          </div>

          {/* Quick Action Buttons & Real-time Online Light Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1-Click Online (Blue) / Offline (Red) Toggle */}
            <button
              onClick={handleToggleOnline}
              disabled={togglingStatus}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${
                isOnline
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20'
                  : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20'
              }`}
              title="Click to toggle your live status between Online (Blue Light) and Offline (Red Light)"
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
              <span>Status: {isOnline ? 'Online (Blue Light)' : 'Offline (Red Light)'}</span>
            </button>

            <button
              onClick={onOpenNewProject}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6611] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={onOpenNewService}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Projects */}
        <div
          onClick={() => onSelectTab('projects')}
          className="p-5 rounded-2xl bg-[#0d111a] border border-white/10 hover:border-[#FF5500]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-neutral-400">Total Projects</span>
            <div className="w-9 h-9 rounded-xl bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalProjects}</div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Dynamic cases published</span>
            <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Featured Projects */}
        <div
          onClick={() => onSelectTab('projects')}
          className="p-5 rounded-2xl bg-[#0d111a] border border-white/10 hover:border-[#FFAA00]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-neutral-400">Featured Highlights</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFAA00]/10 flex items-center justify-center text-[#FFAA00] group-hover:scale-110 transition-transform">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{featuredProjects}</div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Pinned to top of portfolio</span>
            <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Unread Messages */}
        <div
          onClick={() => onSelectTab('messages')}
          className="p-5 rounded-2xl bg-[#0d111a] border border-white/10 hover:border-[#00E5FF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-neutral-400">Unread Messages</span>
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
            <span>{unreadMessages}</span>
            <span className="text-xs font-normal text-neutral-400">/ {totalMessages} total</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Client inquiries pending</span>
            <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Active Services */}
        <div
          onClick={() => onSelectTab('services')}
          className="p-5 rounded-2xl bg-[#0d111a] border border-white/10 hover:border-emerald-400/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-neutral-400">Active Services</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{activeServices}</div>
          <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-between">
            <span>Visible to visitors</span>
            <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Split Grid: Recent Inquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Client Inquiries */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0d111a] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-sm font-bold text-white font-display">Recent Client Messages</h3>
              </div>
              <button
                onClick={() => onSelectTab('messages')}
                className="text-xs text-[#00E5FF] hover:underline font-medium"
              >
                View All
              </button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="py-10 text-center text-xs text-neutral-500">
                No inquiries in inbox yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => onSelectTab('messages')}
                    className="p-3.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/5 transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                            msg.status === 'New'
                              ? 'bg-[#FF5500] text-white'
                              : msg.status === 'Replied'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 text-neutral-400'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-300 font-medium truncate">{msg.subject}</div>
                      <div className="text-[11px] text-neutral-500 truncate">{msg.message}</div>
                    </div>
                    <div className="text-[10px] text-neutral-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Projects Published */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0d111a] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#FF5500]" />
                <h3 className="text-sm font-bold text-white font-display">Published Projects</h3>
              </div>
              <button
                onClick={() => onSelectTab('projects')}
                className="text-xs text-[#FF5500] hover:underline font-medium"
              >
                Manage All
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <div className="py-10 text-center text-xs text-neutral-500">
                No projects added yet. Click &quot;Add Project&quot; to publish your first work!
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectTab('projects')}
                    className="p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/5 transition-all cursor-pointer flex items-center gap-3.5"
                  >
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-950 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{p.title}</span>
                        {p.featured && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FFAA00]/20 text-[#FFAA00] font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {p.category} • {p.projectDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
