import React, { useState } from 'react';
import {
  Inbox,
  Mail,
  Trash2,
  Archive,
  Check,
  CheckCheck,
  Reply,
  X,
  Clock,
  User,
  Search,
  AlertCircle,
} from 'lucide-react';
import { ContactMessage, MessageStatus } from '../types.js';
import { updateMessageStatus, deleteMessage } from '../services/api.js';

interface MessageManagerProps {
  messages: ContactMessage[];
  onRefresh: () => Promise<void>;
}

export const MessageManager: React.FC<MessageManagerProps> = ({ messages, onRefresh }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | MessageStatus>('All');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    try {
      setLoading(true);
      await updateMessageStatus(id, status);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
      }
      showToast(`Message marked as ${status}`);
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update message');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteMessage(id);
      showToast('Message deleted');
      setDeleteConfirmId(null);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'New') {
      await handleStatusChange(msg.id, 'Read');
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = activeFilter === 'All' || m.status === activeFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Client Inquiries &amp; Messages</h2>
          <p className="text-xs text-neutral-400">
            Incoming communications submitted through the portfolio contact portal.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="px-3.5 py-1.5 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
            <span>{unreadCount} Unread Message{unreadCount === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['All', 'New', 'Read', 'Replied', 'Archived'] as const).map((tab) => {
            const isActive = activeFilter === tab;
            const count =
              tab === 'All'
                ? messages.length
                : messages.filter((m) => m.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5500] text-white shadow-md'
                    : 'bg-[#0d111a] text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{tab}</span>
                <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0d111a] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#FF5500]"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="rounded-2xl bg-[#0d111a] border border-white/10 overflow-hidden shadow-xl">
        {filteredMessages.length === 0 ? (
          <div className="p-16 text-center text-neutral-500 text-xs">
            <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <span>No messages found in this category.</span>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                  msg.status === 'New' ? 'bg-[#FF5500]/[0.03]' : ''
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {/* Status Indicator */}
                  <div className="mt-1 sm:mt-0 shrink-0">
                    {msg.status === 'New' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] inline-block shadow-lg shadow-[#FF5500]/50" />
                    )}
                    {msg.status === 'Read' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
                    )}
                    {msg.status === 'Replied' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    )}
                    {msg.status === 'Archived' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-white text-xs truncate">{msg.name}</span>
                      <span className="text-[11px] text-neutral-500 truncate">({msg.email})</span>

                      {msg.isChat && (
                        <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                          Live Chat
                        </span>
                      )}

                      {msg.product && (
                        <span className="text-[9px] px-2 py-0.5 rounded font-medium bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/25">
                          {msg.product}
                        </span>
                      )}

                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          msg.status === 'New'
                            ? 'bg-[#FF5500]/20 text-[#FF5500]'
                            : msg.status === 'Replied'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 text-neutral-400'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-neutral-200 truncate max-w-md sm:max-w-lg mb-0.5">
                      {msg.subject}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate max-w-md sm:max-w-xl">
                      {msg.message}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-neutral-500 shrink-0">
                  <span className="text-[11px] whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(msg.id);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Viewer Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0d111a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                  selectedMessage.status === 'New'
                    ? 'bg-[#FF5500] text-white'
                    : selectedMessage.status === 'Replied'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/10 text-neutral-300'
                }`}
              >
                Status: {selectedMessage.status}
              </span>
              <span className="text-xs text-neutral-500">
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-display mb-3">
              {selectedMessage.subject}
            </h3>

            {/* Sender details */}
            <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{selectedMessage.name}</span>
                  {selectedMessage.isChat && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-bold">
                      Live Chat
                    </span>
                  )}
                  {selectedMessage.product && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-semibold">
                      Product: {selectedMessage.product}
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">{selectedMessage.email}</div>
              </div>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                onClick={() => handleStatusChange(selectedMessage.id, 'Replied')}
                className="px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#ff6611] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply Email</span>
              </a>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <div className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-2">
                Message Body
              </div>
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-white/5 text-sm text-neutral-200 whitespace-pre-line leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'Read')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'Replied')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium text-emerald-400 transition-all cursor-pointer"
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'Archived')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  Archive
                </button>
              </div>

              <button
                onClick={() => setDeleteConfirmId(selectedMessage.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0e131d] border border-white/15 p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Delete message?</h4>
            <p className="text-xs text-neutral-400 mb-6">
              This will permanently delete this client inquiry from your database.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
