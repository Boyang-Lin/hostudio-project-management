import { Project } from "@/data/mockData";
import { ProjectCard } from "./ProjectCard";
import { ProjectEditDialog } from "./ProjectEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "./ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ProjectsListProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  onNewProject: () => void;
}

export function ProjectsList({ projects, onProjectsChange, onNewProject }: ProjectsListProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleProjectUpdate = (updatedProject: Partial<Project>) => {
    onProjectsChange(
      projects.map(p =>
        p.id === editingProject?.id
          ? { ...p, ...updatedProject }
          : p
      )
    );
    toast.success("Project updated successfully");
  };

  const handleStatusChange = (projectId: string, newStatus: "active" | "completed" | "on-hold") => {
    onProjectsChange(
      projects.map(p =>
        p.id === projectId
          ? { ...p, status: newStatus }
          : p
      )
    );
  };

  const handleDeleteProject = () => {
    if (deletingProject) {
      onProjectsChange(projects.filter(p => p.id !== deletingProject.id));
      setDeletingProject(null);
      toast.success("Project deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Projects</h1>
        <Button onClick={onNewProject}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
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