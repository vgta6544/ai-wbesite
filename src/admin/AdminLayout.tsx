import React, { useState } from 'react';
import { Menu, ExternalLink, Shield, CheckCircle2, Bell } from 'lucide-react';
import { AdminSidebar, AdminTab } from './AdminSidebar.js';
import { AdminDashboard } from './AdminDashboard.js';
import { ProjectManager } from './ProjectManager.js';
import { ServiceManager } from './ServiceManager.js';
import { MessageManager } from './MessageManager.js';
import { SettingsManager } from './SettingsManager.js';
import { Project, Service, ContactMessage, SiteSettings } from '../types.js';

interface AdminLayoutProps {
  projects: Project[];
  services: Service[];
  messages: ContactMessage[];
  settings: SiteSettings | null;
  onRefreshData: () => Promise<void>;
  onViewLive: () => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  projects,
  services,
  messages,
  settings,
  onRefreshData,
  onViewLive,
  onLogout,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showProjectCreateModal, setShowProjectCreateModal] = useState(false);
  const [showServiceCreateModal, setShowServiceCreateModal] = useState(false);

  const unreadCount = messages.filter((m) => m.status === 'New').length;

  return (
    <div className="min-h-screen bg-[#05070a] text-neutral-100 flex flex-col lg:flex-row">
      {/* Persistent Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setShowProjectCreateModal(false);
          setShowServiceCreateModal(false);
        }}
        projectCount={projects.length}
        serviceCount={services.length}
        unreadCount={unreadCount}
        onViewLive={onViewLive}
        onLogout={onLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#080b12]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-neutral-300 hover:text-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider hidden sm:inline">
                Console /
              </span>
              <span className="text-xs sm:text-sm font-bold text-white capitalize">
                {currentTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Live Preview Button */}
            <button
              onClick={onViewLive}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Preview Live Site</span>
            </button>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">Zohair</span>
              <span className="text-[10px] text-[#00E5FF] font-mono hidden md:inline">
                (vgta6544@gmail.com)
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboard
              projects={projects}
              services={services}
              messages={messages}
              settings={settings}
              onSelectTab={setCurrentTab}
              onOpenNewProject={() => {
                setCurrentTab('projects');
                setShowProjectCreateModal(true);
              }}
              onOpenNewService={() => {
                setCurrentTab('services');
                setShowServiceCreateModal(true);
              }}
              onRefreshData={onRefreshData}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectManager
              projects={projects}
              onRefresh={onRefreshData}
              showNewModalInitially={showProjectCreateModal}
              onCloseNewModal={() => setShowProjectCreateModal(false)}
            />
          )}

          {currentTab === 'services' && (
            <ServiceManager
              services={services}
              onRefresh={onRefreshData}
              showNewModalInitially={showServiceCreateModal}
              onCloseNewModal={() => setShowServiceCreateModal(false)}
            />
          )}

          {currentTab === 'messages' && (
            <MessageManager messages={messages} onRefresh={onRefreshData} />
          )}

          {currentTab === 'settings' && (
            <SettingsManager settings={settings} onRefresh={onRefreshData} />
          )}
        </main>
      </div>
    </div>
  );
};
