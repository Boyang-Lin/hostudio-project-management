import { ProjectsList } from "@/components/ProjectsList";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const handleNewProject = async (newProject) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: newProject.title,
          client_name: newProject.clientName,
          client_email: newProject.clientEmail,
          client_phone: newProject.clientPhone,
          construction_cost: newProject.constructionCost,
          status: 'active',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setShowNewProjectDialog(false);
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectsList
        onNewProject={() => setShowNewProjectDialog(true)}
      />

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onSave={handleNewProject}
      />
    </div>
  );
};