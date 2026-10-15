import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowUpRight, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types.js';

interface NavbarProps {
  settings: SiteSettings | null;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  activeSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[#07090e]/85 backdrop-blur-md border-b border-white/10 shadow-2xl'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="group flex items-center gap-2.5 text-xl font-extrabold tracking-tight font-display"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF5500] to-[#00E5FF] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#07090e] rounded-[6px] flex items-center justify-center text-white font-black text-sm">
              Z
            </div>
          </div>
          <span className="text-white group-hover:text-neutral-200 transition-colors">
            ZOHAIR
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/20 px-2 py-0.5 rounded-full ml-1">
            Creative Pro
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#0e131d]/70 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#ff7700] text-white shadow-md shadow-[#FF5500]/20'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Availability & Admin Login */}
        <div className="hidden sm:flex items-center gap-3">
          <div
            className={`hidden lg:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all ${
              settings?.isOnline !== false
                ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
                : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
            }`}
            title={settings?.isOnline !== false ? 'Online (Blue Light)' : 'Offline (Red Light)'}
          >
            <span className="relative flex h-2 w-2">
              {settings?.isOnline !== false ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></span>
              )}
            </span>
            <span className="font-semibold">
              {settings?.isOnline !== false ? 'Online' : 'Offline'}
            </span>
          </div>

          <button
            id="admin-login-nav-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-95 cursor-pointer"
            title="Administrator Portal"
          >
            <Shield className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white"
            aria-label="Admin Login"
            title="Admin Login"
          >
            <Shield className="w-4 h-4 text-[#00E5FF]" />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-[#0b0e17]/95 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Restricted Access</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#ff6611] text-white transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
