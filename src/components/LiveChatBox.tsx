import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCheck,
  User,
  Mail,
  Box,
  Layers,
  Code,
  Video,
  ChevronDown,
} from 'lucide-react';
import { SiteSettings, ContactMessage } from '../types.js';
import { sendChatMessage } from '../services/api.js';

interface LiveChatBoxProps {
  settings: SiteSettings | null;
}

interface LocalChatMessage {
  id: string;
  sender: 'zohair' | 'visitor';
  name: string;
  text: string;
  product?: string;
  timestamp: string;
}

const PRODUCT_OPTIONS = [
  '3D & CGI Advertising / Product Renders',
  'Modern Web Development & Full-Stack',
  'Brand Identity & Logo Design',
  'Social Media Content & UGC Ads',
  'Interactive 3D Experiences / WebGL',
  'General Inquiry / Collaboration',
];

export const LiveChatBox: React.FC<LiveChatBoxProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  // Form State
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_OPTIONS[0]);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine Online / Offline status
  const isOnline = settings ? settings.isOnline !== false : true;

  // Local Chat History
  const [chatHistory, setChatHistory] = useState<LocalChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('zohair_live_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome-1',
        sender: 'zohair',
        name: 'Zohair',
        text: "Hey! 👋 Thanks for stopping by. Need a high-impact 3D CGI commercial, bespoke website, or brand design? Send me a message below and let's bring your vision to life!",
        timestamp: 'Just now',
      },
    ];
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zohair_live_chat_history', JSON.stringify(chatHistory));
    } catch {}
  }, [chatHistory]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnreadNotification(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessageText(prompt);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = messageText.trim();
    if (!cleanMsg || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const displayName = isAnonymous || !senderName.trim() ? 'Anonymous' : senderName.trim();
    const visitorMsg: LocalChatMessage = {
      id: 'vis-' + Date.now(),
      sender: 'visitor',
      name: displayName,
      text: cleanMsg,
      product: selectedProduct,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, visitorMsg]);
    setMessageText('');

    try {
      const res = await sendChatMessage({
        name: displayName,
        email: senderEmail.trim() || undefined,
        product: selectedProduct,
        message: cleanMsg,
        isAnonymous: isAnonymous || !senderName.trim(),
      });

      // Automated acknowledgment reply from Zohair
      setTimeout(() => {
        const replyText =
          res.autoReply ||
          (isOnline
            ? "Message received! I'm active on my dashboard right now and will review this shortly."
            : "Thanks! I'm currently offline, but your inquiry has been sent to my priority inbox. I'll get back to you as soon as I'm back!");

        const zohairReply: LocalChatMessage = {
          id: 'reply-' + Date.now(),
          sender: 'zohair',
          name: 'Zohair',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatHistory((prev) => [...prev, zohairReply]);
      }, 700);
    } catch (err: any) {
      setStatusMessage(err.message || 'Could not send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Fixed Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Status Tooltip / Callout */}
          <button
            onClick={handleOpenChat}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0c1017]/95 border border-white/10 hover:border-white/20 text-xs text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Real-time Online (Blue) vs Offline (Red) Light */}
            <div className="relative flex items-center justify-center w-3 h-3">
              {isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></span>
              )}
            </div>
            <span className="font-semibold">{isOnline ? 'Online' : 'Offline'}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300">Live Chat</span>
          </button>

          {/* Primary Circular Trigger */}
          <button
            id="live-chat-trigger-btn"
            onClick={handleOpenChat}
            aria-label="Open Live Chat"
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#ff7722] text-white flex items-center justify-center shadow-xl shadow-[#FF5500]/30 hover:shadow-[#FF5500]/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <MessageSquare className="w-6 h-6" />

            {/* Notification pip or Status dot */}
            <span
              className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-[#07090E] ${
                isOnline ? 'bg-[#00E5FF] animate-pulse' : 'bg-[#EF4444]'
              }`}
              title={isOnline ? 'Online (Blue Light)' : 'Offline (Red Light)'}
            />
          </button>
        </div>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          id="live-chat-window"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[410px] h-[580px] max-h-[90vh] rounded-3xl bg-[#090d15] border border-white/15 shadow-2xl shadow-black/80 flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-[#0d121c] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar Monogram */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5500] to-[#00E5FF] p-[1.5px]">
                  <div className="w-full h-full bg-[#07090E] rounded-[10px] flex items-center justify-center text-white font-black text-sm">
                    Z
                  </div>
                </div>
                {/* Live Status indicator */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#090d15] ${
                    isOnline
                      ? 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'
                      : 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-display">Zohair</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-medium">
                    Creative Pro
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOnline ? 'bg-[#00E5FF]' : 'bg-[#EF4444]'
                    }`}
                  />
                  <span className={isOnline ? 'text-[#00E5FF] font-medium' : 'text-[#EF4444] font-medium'}>
                    {isOnline ? 'Online • Blue Light Active' : 'Offline • Red Light Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Minimize / Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Identity & Product Selector Bar */}
          <div className="px-4 py-2.5 bg-[#0b0f18] border-b border-white/5 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              {/* Anonymous Toggle */}
              <label className="flex items-center gap-1.5 text-neutral-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-[#FF5500] focus:ring-0 focus:outline-none w-3.5 h-3.5 cursor-pointer"
                />
                <span>Send as Anonymous</span>
              </label>

              {/* Name Input if not anonymous */}
              {!isAnonymous && (
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/10 text-white text-[11px] placeholder:text-neutral-500 focus:outline-none focus:border-[#FF5500] w-36"
                />
              )}
            </div>

            {/* Email Field */}
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <input
                type="email"
                placeholder="Enter email to get direct replies (recommended)"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-2.5 py-1 rounded-lg bg-neutral-900/80 border border-white/10 text-white text-[11px] placeholder:text-neutral-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            {/* Product / Service Selector */}
            <div className="flex items-center gap-2">
              <Box className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-2 py-1 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 text-[11px] focus:outline-none focus:border-[#FF5500] cursor-pointer"
              >
                {PRODUCT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-neutral-900 text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {chatHistory.map((msg) => {
              const isMe = msg.sender === 'visitor';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-400">
                    <span>{msg.name}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.product && (
                      <span className="text-[#FF5500] font-medium truncate max-w-[140px]">
                        [{msg.product.split('/')[0].trim()}]
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-[#FF5500] to-[#ff7722] text-white rounded-br-xs'
                        : 'bg-white/5 border border-white/10 text-neutral-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 pt-2 pb-1 border-t border-white/5 bg-[#0a0e16] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'Need a quote for 3D CGI',
              'Website redesign inquiry',
              'Are you available for projects?',
              'Logo & Branding design',
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {statusMessage && (
            <div className="px-3 py-1.5 bg-red-500/10 border-t border-red-500/20 text-red-400 text-[11px] flex items-center justify-between">
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage(null)} className="text-red-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Chat Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#0c1018] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                isAnonymous
                  ? 'Type anonymous message to Zohair...'
                  : 'Type your message to Zohair...'
              }
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-xs focus:outline-none focus:border-[#FF5500]"
            />

            <button
              type="submit"
              disabled={!messageText.trim() || isSubmitting}
              className="p-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6611] disabled:opacity-40 disabled:hover:bg-[#FF5500] text-white transition-all shadow-md shadow-[#FF5500]/25 active:scale-95 cursor-pointer shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
