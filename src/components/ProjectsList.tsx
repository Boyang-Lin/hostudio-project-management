import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectCard } from "./ProjectCard";
import { ProjectEditDialog } from "./ProjectEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "./ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  status: "active" | "completed" | "on-hold";
  client_name: string;
  client_email: string;
  client_phone: string;
  construction_cost: number;
  created_at: string;
}

export function ProjectsList({ onNewProject }: { onNewProject: () => void }) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Failed to fetch projects');
        throw error;
      }
      return data as Project[];
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: Partial<Project> & { id: string }) => {
      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', updatedProject.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success("Project updated successfully");
      setEditingProject(null);
    },
    onError: (error) => {
      toast.error("Failed to update project");
      console.error('Update error:', error);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success("Project deleted successfully");
      setDeletingProject(null);
    },
    onError: (error) => {
      toast.error("Failed to delete project");
      console.error('Delete error:', error);
    },
  });

  const handleProjectUpdate = (updatedProject: Partial<Project>) => {
    if (editingProject) {
      updateProjectMutation.mutate({
        id: editingProject.id,
        ...updatedProject
      });
    }
  };

  const handleStatusChange = (projectId: string, newStatus: "active" | "completed" | "on-hold") => {
    updateProjectMutation.mutate({
      id: projectId,
      status: newStatus
    });
  };

  const handleDeleteProject = () => {
    if (deletingProject) {
      deleteProjectMutation.mutate(deletingProject.id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Projects</h1>
        <Button onClick={onNewProject}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No projects yet. Create your first project to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingProject(project);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    setDeletingProject(project);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
              <Link to={`/project/${project.id}`}>
                <ProjectCard 
                  {...project}
                  onStatusChange={(newStatus) => handleStatusChange(project.id, newStatus)}
                />
              </Link>
            </div>
          ))}
        </div>
      )}

      <ProjectEditDialog
        project={editingProject}
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        onSave={handleProjectUpdate}
      />

      <DeleteConfirmDialog
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}