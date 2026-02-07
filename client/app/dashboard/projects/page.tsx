"use client";
import React, { useState } from "react";
import { 
    PageHeader, 
    EmptyState, 
    DashboardCard, 
    DashboardButton,
    DashboardModal,
    DashboardInput,
    DashboardSection
} from "@/components/dashboard/Shared";
import { FolderOpen, Plus, ExternalLink, Github, Trash2, Edit, GripVertical, Star } from "lucide-react";
import { useProjects, type CreateProjectData, type Project } from "@/hooks/useProjects";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<CreateProjectData>({
    title: "",
    description: "",
    imageUrl: "",
    projectUrl: "",
    githubUrl: "",
    tags: [],
    featured: false
  });
  const [tagInput, setTagInput] = useState("");

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || "",
        imageUrl: project.image_url || "",
        projectUrl: project.project_url || "",
        githubUrl: project.github_url || "",
        tags: project.tags || [],
        featured: project.featured
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        projectUrl: "",
        githubUrl: "",
        tags: [],
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await createProject(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Projects" 
        description="Showcase your work and manage your portfolio projects."
        action={{
            label: "New Project",
            icon: Plus,
            onClick: () => handleOpenModal()
        }}
      />

      {projects.length === 0 ? (
        <EmptyState 
          title="No projects yet"
          description="Create your first project to showcase your work and build your portfolio."
          icon={FolderOpen}
          actionLabel="Create Project"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <DashboardSection title="Your Projects" description={`${projects.length} project${projects.length !== 1 ? 's' : ''} in your portfolio`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <DashboardCard className="group relative overflow-hidden h-full">
                    {/* Project Image */}
                    {project.image_url && (
                      <div className="relative w-full h-48 bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden mb-4">
                        <Image 
                          src={project.image_url} 
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        {project.featured && (
                          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-black">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </div>
                        )}
                      </div>
                    )}

                    {/* Project Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-black italic tracking-tight text-neutral-900 dark:text-white mb-1">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium italic line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg text-xs font-bold">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-10 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenModal(project)}
                          className="h-10 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="h-10 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </DashboardCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </DashboardSection>
      )}

      {/* Create/Edit Modal */}
      <DashboardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "Edit Project" : "Create New Project"}
        description="Add details about your project to showcase in your portfolio"
        icon={editingProject ? Edit : Plus}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <DashboardInput
            label="Project Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="My Awesome Project"
            required
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full p-5 rounded-3xl bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold resize-none italic text-sm"
              placeholder="Describe your project..."
            />
          </div>

          <DashboardInput
            label="Project URL"
            value={formData.projectUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
            placeholder="https://myproject.com"
            icon={ExternalLink}
          />

          <DashboardInput
            label="GitHub URL (Optional)"
            value={formData.githubUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
            placeholder="https://github.com/username/repo"
            icon={Github}
          />

          <DashboardInput
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="https://example.com/image.jpg"
            hint="Provide a URL to an image showcasing your project"
          />

          {/* Tags Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 h-14 rounded-3xl bg-neutral-50 dark:bg-white/5 px-6 border border-transparent focus:border-indigo-500/50 outline-none transition-all font-bold"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="h-14 px-6 rounded-2xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-white/5">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-amber-500 focus:ring-2 focus:ring-amber-500/50"
            />
            <label htmlFor="featured" className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <Star className="w-4 h-4" />
              Mark as Featured Project
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <DashboardButton
              type="submit"
              variant="primary"
              className="flex-1 h-14"
            >
              {editingProject ? 'Update Project' : 'Create Project'}
            </DashboardButton>
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              className="h-14 px-8"
            >
              Cancel
            </DashboardButton>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}
