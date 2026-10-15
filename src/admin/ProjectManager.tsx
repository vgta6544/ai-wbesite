import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Upload,
  X,
  Image as ImageIcon,
  Check,
  ArrowUpDown,
  Calendar,
  Layers,
} from 'lucide-react';
import { Project, ProjectCategory } from '../types.js';
import { createProject, updateProject, deleteProject, uploadImage } from '../services/api.js';

interface ProjectManagerProps {
  projects: Project[];
  onRefresh: () => Promise<void>;
  showNewModalInitially?: boolean;
  onCloseNewModal?: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  'Graphic Design',
  'Branding',
  'Social Media',
  'CGI',
  'UGC Ads',
  'Websites',
  'Other',
];

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  onRefresh,
  showNewModalInitially,
  onCloseNewModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(showNewModalInitially || false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: ProjectCategory;
    description: string;
    coverImage: string;
    images: string[];
    videoUrl: string;
    toolsString: string;
    projectDate: string;
    client: string;
    featured: boolean;
  }>({
    title: '',
    category: 'CGI',
    description: '',
    coverImage: '',
    images: [],
    videoUrl: '',
    toolsString: '',
    projectDate: '',
    client: '',
    featured: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'CGI',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      images: [],
      videoUrl: '',
      toolsString: 'Blender, Cinema 4D, After Effects',
      projectDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      client: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      coverImage: project.coverImage,
      images: project.images || [],
      videoUrl: project.videoUrl || '',
      toolsString: (project.tools || []).join(', '),
      projectDate: project.projectDate || '',
      client: project.client || '',
      featured: project.featured || false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    if (onCloseNewModal) onCloseNewModal();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadedUrl = await uploadImage(base64, file.name);
        if (isGallery) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, uploadedUrl],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            coverImage: uploadedUrl,
          }));
        }
        showToast('Image uploaded successfully.');
      } catch (err: any) {
        showToast('Upload failed: ' + err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.coverImage.trim()) {
      alert('Please provide a Title, Description, and Cover Image.');
      return;
    }

    const parsedTools = formData.toolsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectPayload = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      coverImage: formData.coverImage.trim(),
      images: formData.images.length > 0 ? formData.images : [formData.coverImage.trim()],
      videoUrl: formData.videoUrl.trim() || undefined,
      tools: parsedTools,
      projectDate: formData.projectDate.trim() || '2026',
      client: formData.client.trim() || undefined,
      featured: formData.featured,
    };

    try {
      setLoading(true);
      if (editingProject) {
        await updateProject(editingProject.id, projectPayload);
        showToast(`Project "${formData.title}" updated successfully.`);
      } else {
        await createProject(projectPayload);
        showToast(`Project "${formData.title}" published successfully.`);
      }
      await onRefresh();
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteProject(id);
      showToast('Project removed successfully.');
      setDeleteConfirmId(null);
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateProject(project.id, { featured: !project.featured });
      await onRefresh();
      showToast(`Featured status updated.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Project Management</h2>
          <p className="text-xs text-neutral-400">
            Publish, edit, or delete case studies dynamically displayed on your portfolio.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6611] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Project</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search projects by title, tool, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0d111a] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#FF5500] transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#0d111a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500] transition-colors"
        >
          <option value="All">All Categories ({projects.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Table / List */}
      <div className="rounded-2xl bg-[#0d111a] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    No matching projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.coverImage}
                          alt={proj.title}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-900 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs truncate max-w-xs sm:max-w-sm">
                            {proj.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-xs">
                            {proj.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-neutral-300">
                        {proj.category}
                      </span>
                    </td>

                    <td className="p-4 text-neutral-400 text-[11px] whitespace-nowrap">
                      {proj.projectDate}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => toggleFeatured(proj, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          proj.featured
                            ? 'text-[#FFAA00] bg-[#FFAA00]/10 hover:bg-[#FFAA00]/20'
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                        }`}
                        title={proj.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${proj.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(proj.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0e131d] border border-white/15 p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Delete this project?</h4>
            <p className="text-xs text-neutral-400 mb-6">
              This action cannot be undone. The project will be permanently removed from the live portfolio.
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

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0d111a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-neutral-100">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white font-display mb-1">
              {editingProject ? 'Edit Project' : '+ Add New Project'}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Fill in project details below to publish live to your portfolio.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lumina Audio — 3D Holographic CGI Campaign"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Project Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. February 2026"
                    value={formData.projectDate}
                    onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Client / Project Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Acoustics or Concept Spec"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Comprehensive case study overview, lighting details, 3D simulations, or interactive features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500] resize-y"
                />
              </div>

              {/* Cover Image Input + File Upload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Cover Image URL or File Upload *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" />
                  </label>
                </div>
                {formData.coverImage && (
                  <div className="mt-2 w-28 h-16 rounded-lg overflow-hidden border border-white/10">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Additional Gallery Images */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Additional Gallery Images (Optional)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add Gallery Image</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    {formData.images.length} additional image{formData.images.length === 1 ? '' : 's'}
                  </span>
                </div>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-16 h-12 rounded border border-white/15 overflow-hidden group">
                        <img src={imgUrl} alt="gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Video URL (Optional MP4 / Reel)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Tools Used (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Blender 4.2, Octane, Cinema 4D"
                    value={formData.toolsString}
                    onChange={(e) => setFormData({ ...formData, toolsString: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FF5500] focus:ring-0 bg-neutral-900 border-white/20"
                  />
                  <span className="text-xs font-semibold text-white">
                    Mark as Featured Project (Pin to highlights)
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
                  {loading ? 'Publishing...' : editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
