import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Project {
  id: number;
  portfolio_id?: number;
  user_id: number;
  title: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  tags: string[];
  featured: boolean;
  order_index: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  portfolioId?: number;
  title: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  tags?: string[];
  featured?: boolean;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: string;
}

export const useProjects = (portfolioId?: number) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = portfolioId ? { portfolioId } : {};
      const { data } = await api.get('/projects', { params });
      
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch projects';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: CreateProjectData) => {
    try {
      const { data } = await api.post('/projects', projectData);
      
      if (data.success) {
        setProjects(prev => [...prev, data.project]);
        toast.success('Project created successfully!');
        return data.project;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create project';
      toast.error(message);
      throw err;
    }
  };

  const updateProject = async (id: number, projectData: UpdateProjectData) => {
    try {
      const { data } = await api.put(`/projects/${id}`, projectData);
      
      if (data.success) {
        setProjects(prev => 
          prev.map(p => p.id === id ? data.project : p)
        );
        toast.success('Project updated successfully!');
        return data.project;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update project';
      toast.error(message);
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const { data } = await api.delete(`/projects/${id}`);
      
      if (data.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
        toast.success('Project deleted successfully!');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete project';
      toast.error(message);
      throw err;
    }
  };

  const reorderProjects = async (projectIds: number[]) => {
    try {
      const { data } = await api.patch('/projects/reorder', { projectIds });
      
      if (data.success) {
        // Update local state to reflect new order
        const reordered = projectIds.map((id, index) => {
          const project = projects.find(p => p.id === id);
          return project ? { ...project, order_index: index } : null;
        }).filter(Boolean) as Project[];
        
        setProjects(reordered);
        toast.success('Projects reordered successfully!');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reorder projects';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [portfolioId]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    refetch: fetchProjects
  };
};
