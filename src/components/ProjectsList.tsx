import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectCard } from "./ProjectCard";
import { ProjectEditDialog } from "./ProjectEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "./ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { Input } from "./ui/input";

interface ProjectsListProps {
  onNewProject: () => void;
}

export function ProjectsList({ onNewProject }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  // Updated query to handle both personal and organization projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First, get user's organization memberships
      const { data: memberships, error: membershipError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);

      if (membershipError) {
        console.error('Error fetching memberships:', membershipError);
      }

      const organizationIds = memberships?.map(m => m.organization_id) || [];

      // Fetch both personal projects and organization projects
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or(`user_id.eq.${user.id},organization_id.in.(${organizationIds.join(',')})`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
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
      console.error('Update error:', error);
      toast.error("Failed to update project");
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
      console.error('Delete error:', error);
      toast.error("Failed to delete project");
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

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">Projects</h1>
        <div className="flex w-full sm:w-auto gap-4">
          <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button onClick={onNewProject} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-border/50">
          <div className="max-w-md mx-auto space-y-4">
            <Search className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search terms or clear the search to see all projects."
                : "Create your first project to get started!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`} className="block">
              <ProjectCard 
                {...project}
                onStatusChange={(newStatus) => handleStatusChange(project.id, newStatus)}
              />
            </Link>
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
