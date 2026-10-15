import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  Sparkles,
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'projects' | 'services' | 'messages' | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  projectCount: number;
  serviceCount: number;
  unreadCount: number;
  onViewLive: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  projectCount,
  serviceCount,
  unreadCount,
  onViewLive,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'projects' as AdminTab,
      label: 'Projects',
      icon: FolderKanban,
      badge: projectCount,
    },
    {
      id: 'services' as AdminTab,
      label: 'Services',
      icon: Layers,
      badge: serviceCount,
    },
    {
      id: 'messages' as AdminTab,
      label: 'Messages',
      icon: Inbox,
      badge: unreadCount > 0 ? `${unreadCount} new` : undefined,
      badgeColor: unreadCount > 0 ? 'bg-[#FF5500] text-white' : undefined,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const content = (
    <div className="w-64 bg-[#0a0d14] border-r border-white/10 flex flex-col justify-between h-full p-4 select-none">
      <div>
        {/* Brand Bar */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5500] to-[#00E5FF] p-[1px]">
            <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center text-white font-black text-sm">
              Z
            </div>
          </div>
          <div>
            <div className="text-sm font-extrabold text-white font-display flex items-center gap-1.5">
              <span>ZOHAIR</span>
              <span className="text-[10px] bg-[#00E5FF]/20 text-[#00E5FF] font-mono px-1.5 py-0.2 rounded">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">Admin Control Center</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Management
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-neutral-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Utility Actions */}
      <div className="pt-4 border-t border-white/10 space-y-1">
        <button
          onClick={onViewLive}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
            <span>View Public Site</span>
          </div>
          <span className="text-[10px] text-neutral-500">Live</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
