import React, { useState } from 'react';
import {
  Save,
  Check,
  User,
  Globe,
  Share2,
  Mail,
  Shield,
  Upload,
  Lock,
} from 'lucide-react';
import { SiteSettings } from '../types.js';
import { updateSiteSettings, updateAdminPin, uploadImage } from '../services/api.js';

interface SettingsManagerProps {
  settings: SiteSettings | null;
  onRefresh: () => Promise<void>;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>(
    settings || {
      name: 'Zohair',
      title: 'Graphic Designer • Web Developer • CGI Designer • Content Creator',
      bio: 'Creating high-impact visual design, 3D CGI simulations, and performance web applications.',
      avatarUrl: '',
      email: 'vgta6544@gmail.com',
      whatsapp: '',
      location: 'Available Worldwide / Remote',
      availabilityStatus: 'Available for Select Projects & Collaborations',
      socialLinks: {
        instagram: '',
        behance: '',
        youtube: '',
        github: '',
        linkedin: '',
      },
      heroHeadline: 'Crafting Next-Gen Visuals & Interactive Web Experiences',
      heroSubheadline:
        'Transforming brands through high-fidelity CGI, modern graphic systems, and bespoke digital development.',
      ctaText: "Let's Create Something Great",
      footerText: '© 2026 Zohair. All rights reserved.',
    }
  );

  const [pinChange, setPinChange] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadedUrl = await uploadImage(base64, file.name);
        setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
        showToast('Avatar updated');
      } catch (err: any) {
        showToast('Upload error: ' + err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSiteSettings(formData);
      showToast('Settings saved successfully and applied live.');
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);
    if (!pinChange.currentPin || !pinChange.newPin) {
      setPinMessage({ text: 'Please fill in current and new PIN.', isError: true });
      return;
    }
    if (pinChange.newPin.length < 4 || pinChange.newPin.length > 6) {
      setPinMessage({ text: 'New PIN must be between 4 and 6 digits.', isError: true });
      return;
    }
    if (pinChange.newPin !== pinChange.confirmPin) {
      setPinMessage({ text: 'New PIN and confirmation do not match.', isError: true });
      return;
    }

    try {
      setSaving(true);
      await updateAdminPin(pinChange.currentPin, pinChange.newPin);
      setPinMessage({ text: 'Admin PIN updated successfully.', isError: false });
      setPinChange({ currentPin: '', newPin: '', confirmPin: '' });
      showToast('Security PIN changed.');
    } catch (err: any) {
      setPinMessage({ text: err.message || 'Failed to update PIN', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-display">System &amp; Brand Settings</h2>
        <p className="text-xs text-neutral-400">
          Customize personal positioning, bio, contact channels, connected social links, and security PIN.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Brand & Profile Information */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0d111a] border border-white/10 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <User className="w-4 h-4 text-[#FF5500]" />
            <h3 className="text-sm font-bold text-white font-display">Identity &amp; Positioning</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Professional Positioning Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Bio / About Synopsis
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500] resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Current Availability Status
              </label>
              <input
                type="text"
                placeholder="e.g. Available for Select Projects & Collaborations"
                value={formData.availabilityStatus || ''}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Location / Working Hours
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0d111a] border border-white/10 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <Mail className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-sm font-bold text-white font-display">Direct Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Direct Contact Email (Public)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                type="text"
                placeholder="+1234567890"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0d111a] border border-white/10 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-display">Connected Social Networks</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Behance Portfolio URL
              </label>
              <input
                type="url"
                placeholder="https://behance.net/..."
                value={formData.socialLinks?.behance || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, behance: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/@..."
                value={formData.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.socialLinks?.github || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, github: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>
        </div>

        {/* Hero & Messaging Copy */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0d111a] border border-white/10 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <Globe className="w-4 h-4 text-[#FFAA00]" />
            <h3 className="text-sm font-bold text-white font-display">Hero &amp; Copywriting</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Hero Headline
            </label>
            <input
              type="text"
              value={formData.heroHeadline || ''}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Hero Subheadline
            </label>
            <input
              type="text"
              value={formData.heroSubheadline || ''}
              onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#ff7700] hover:from-[#ff6611] hover:to-[#ff8822] text-white font-bold text-xs shadow-lg shadow-[#FF5500]/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>

      {/* Security: Update Admin PIN */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0d111a] border border-white/10 space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
          <Shield className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-white font-display">Update Admin PIN</h3>
        </div>

        <p className="text-xs text-neutral-400">
          Change the 4-to-6 digit administrator passcode required along with your Google account.
        </p>

        {pinMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              pinMessage.isError
                ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}
          >
            <span>{pinMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePin} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Current PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinChange.currentPin}
              onChange={(e) => setPinChange({ ...pinChange, currentPin: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                New PIN (4-6 digits)
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinChange.newPin}
                onChange={(e) => setPinChange({ ...pinChange, newPin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Confirm New PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinChange.confirmPin}
                onChange={(e) => setPinChange({ ...pinChange, confirmPin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer disabled:opacity-50"
          >
            Update Admin PIN
          </button>
        </form>
      </div>
    </div>
  );
};
