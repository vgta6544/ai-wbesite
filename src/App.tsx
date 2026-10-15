import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { About } from './components/About.js';
import { Services } from './components/Services.js';
import { Portfolio } from './components/Portfolio.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';
import { LiveChatBox } from './components/LiveChatBox.js';
import { AdminLoginModal } from './admin/AdminLoginModal.js';
import { AdminLayout } from './admin/AdminLayout.js';
import {
  fetchProjects,
  fetchServices,
  fetchSettings,
  fetchMessages,
  getAdminUser,
  clearAdminToken,
} from './services/api.js';
import { Project, Service, SiteSettings, ContactMessage } from './types.js';

export default function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Core Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Check admin session on initial load
  const checkAuth = useCallback(async () => {
    try {
      const user = await getAdminUser();
      if (user) {
        setIsAdminAuthenticated(true);
        // Load messages for authenticated admin
        const msgs = await fetchMessages();
        setMessages(msgs);
      } else {
        setIsAdminAuthenticated(false);
      }
    } catch {
      setIsAdminAuthenticated(false);
    }
  }, []);

  // Fetch Public Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [projs, servs, sets] = await Promise.all([
        fetchProjects(),
        fetchServices(),
        fetchSettings(),
      ]);
      setProjects(projs);
      setServices(servs);
      setSettings(sets);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    checkAuth();

    // Check if initial URL includes #admin or path /admin
    if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
      setView('admin');
    }
  }, [loadData, checkAuth]);

  // Handle route change when admin logs in
  const handleLoginSuccess = async () => {
    setIsLoginModalOpen(false);
    setIsAdminAuthenticated(true);
    setView('admin');
    window.history.pushState(null, '', '/admin');
    // Load admin messages
    try {
      const msgs = await fetchMessages();
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsAdminAuthenticated(false);
    setView('public');
    window.history.pushState(null, '', '/');
  };

  const handleOpenAdminPortal = () => {
    if (isAdminAuthenticated) {
      setView('admin');
      window.history.pushState(null, '', '/admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleViewLiveSite = () => {
    setView('public');
    window.history.pushState(null, '', '/');
  };

  // Render Admin View if in admin mode and authenticated
  if (view === 'admin' && isAdminAuthenticated) {
    return (
      <AdminLayout
        projects={projects}
        services={services}
        messages={messages}
        settings={settings}
        onRefreshData={async () => {
          await loadData();
          if (isAdminAuthenticated) {
            const msgs = await fetchMessages();
            setMessages(msgs);
          }
        }}
        onViewLive={handleViewLiveSite}
        onLogout={handleLogout}
      />
    );
  }

  // Otherwise, render Public Portfolio View
  return (
    <div className="min-h-screen bg-[#07090E] text-neutral-100 selection:bg-[#FF5500] selection:text-white font-sans flex flex-col justify-between">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        onOpenAdmin={handleOpenAdminPortal}
        activeSection="home"
      />

      <main className="flex-1">
        {/* Hero Section with 3D Torus Knot Canvas */}
        <Hero settings={settings} />

        {/* About Section */}
        <About settings={settings} />

        {/* Services & Capabilities Section */}
        <Services services={services} loading={loading} />

        {/* Portfolio & Case Studies Section */}
        <Portfolio projects={projects} loading={loading} />

        {/* Contact & Inquiries Section */}
        <Contact settings={settings} />
      </main>

      {/* Footer */}
      <Footer settings={settings} onOpenAdmin={handleOpenAdminPortal} />

      {/* Floating Interactive Live Chat Box with Anonymous / Product Selection */}
      <LiveChatBox settings={settings} />

      {/* Admin 2FA Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen || (view === 'admin' && !isAdminAuthenticated)}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (view === 'admin') setView('public');
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
