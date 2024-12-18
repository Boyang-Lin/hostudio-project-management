import { Project } from "@/data/mockData";
import { ProjectCard } from "./ProjectCard";
import { ProjectEditDialog } from "./ProjectEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "./ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProjectsListProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  onNewProject: () => void;
}

export function ProjectsList({ onNewProject }: ProjectsListProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const { data: projectsData = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_consultants (
            *,
            consultant: consultants (*)
          )
        `);
      
      if (error) {
        toast.error('Failed to fetch projects');
        throw error;
      }
      
      return data.map((project: any) => ({
        id: project.id,
        title: project.title,
        status: project.status,
        clientName: project.client_name,
        clientEmail: project.client_email,
        clientPhone: project.client_phone,
        constructionCost: project.construction_cost,
        consultants: project.project_consultants?.map((pc: any) => ({
          id: pc.consultant?.id,
          name: pc.consultant?.name,
          email: pc.consultant?.email,
          phone: pc.consultant?.phone,
          specialty: pc.consultant?.specialty,
          company: pc.consultant?.company,
          address: pc.consultant?.address,
          quote: pc.quote,
          status: pc.status
        })) || []
      }));
    },
  });

  const handleProjectUpdate = async (updatedProject: Partial<Project>) => {
    if (!editingProject?.id) return;

    const { error } = await supabase
      .from('projects')
      .update({
        title: updatedProject.title,
        status: updatedProject.status,
        client_name: updatedProject.clientName,
        client_email: updatedProject.clientEmail,
        client_phone: updatedProject.clientPhone,
        construction_cost: updatedProject.constructionCost
      })
      .eq('id', editingProject.id);

    if (error) {
      toast.error('Failed to update project');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setEditingProject(null);
    toast.success("Project updated successfully");
  };

  const handleStatusChange = async (projectId: string, newStatus: "active" | "completed" | "on-hold") => {
    const { error } = await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', projectId);

    if (error) {
      toast.error('Failed to update project status');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['projects'] });
    toast.success("Project status updated successfully");
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', deletingProject.id);

    if (error) {
      toast.error('Failed to delete project');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setDeletingProject(null);
    toast.success("Project deleted successfully");
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Projects</h1>
        <Button onClick={onNewProject}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
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