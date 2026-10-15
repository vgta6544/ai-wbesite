import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Layers,
  Sparkles,
  Share2,
  FileText,
  CreditCard,
  PlaySquare,
  Box,
  Video,
  Layout,
  Code,
  Eye,
  EyeOff,
  Palette,
  Smartphone,
  Cpu,
} from 'lucide-react';
import { Service } from '../types.js';
import { createService, updateService, deleteService } from '../services/api.js';

interface ServiceManagerProps {
  services: Service[];
  onRefresh: () => Promise<void>;
  showNewModalInitially?: boolean;
  onCloseNewModal?: () => void;
}

const AVAILABLE_ICONS = [
  'Sparkles',
  'Layers',
  'Share2',
  'FileText',
  'CreditCard',
  'PlaySquare',
  'Box',
  'Video',
  'Layout',
  'Code',
  'Palette',
  'Smartphone',
  'Cpu',
];

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  onRefresh,
  showNewModalInitially,
  onCloseNewModal,
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(showNewModalInitially || false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Sparkles',
    sortOrder: 1,
    enabled: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Sparkles',
      sortOrder: services.length + 1,
      enabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || 'Sparkles',
      sortOrder: service.sortOrder || 1,
      enabled: service.enabled !== false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    if (onCloseNewModal) onCloseNewModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill out Title and Description.');
      return;
    }

    try {
      setLoading(true);
      if (editingService) {
        await updateService(editingService.id, formData);
        showToast(`Service "${formData.title}" updated.`);
      } else {
        await createService(formData);
        showToast(`Service "${formData.title}" added to live catalog.`);
      }
      await onRefresh();
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteService(id);
      showToast('Service deleted.');
      setDeleteConfirmId(null);
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const toggleEnabled = async (service: Service) => {
    try {
      await updateService(service.id, { enabled: !service.enabled });
      await onRefresh();
      showToast(`Service visibility updated.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

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
          <h2 className="text-xl font-bold text-white font-display">Services Catalog</h2>
          <p className="text-xs text-neutral-400">
            Control the services and offerings displayed publicly on the portfolio.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6611] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Service</span>
        </button>
      </div>

      {/* Services Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`p-5 rounded-2xl bg-[#0d111a] border transition-all flex flex-col justify-between ${
              service.enabled ? 'border-white/10' : 'border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5500]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono text-neutral-500">#{service.sortOrder || index + 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(service)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      service.enabled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {service.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{service.enabled ? 'Enabled' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(service)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(service.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5 font-display">
                {service.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-white/5 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Icon identifier: {service.icon}</span>
              <span>Updated {new Date(service.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0e131d] border border-white/15 p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Delete this service?</h4>
            <p className="text-xs text-neutral-400 mb-6">
              This service will be removed immediately from the public portfolio.
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

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0d111a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white font-display mb-1">
              {editingService ? 'Edit Service' : '+ Add Service'}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Configure service title, description, and visual representation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3D Product Visuals"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe deliverables and value proposition..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500] resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Icon Style
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FF5500] focus:ring-0 bg-neutral-900 border-white/20"
                  />
                  <span className="text-xs font-semibold text-white">
                    Service Enabled (Visible on public portfolio)
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#ff7700] hover:from-[#ff6611] hover:to-[#ff8822] text-white font-bold text-xs shadow-lg shadow-[#FF5500]/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Saving...' : editingService ? 'Save Changes' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
