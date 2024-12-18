import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { NewConsultantDialog } from "@/components/NewConsultantDialog";
import { NewGroupDialog } from "@/components/NewGroupDialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [consultantGroups, setConsultantGroups] = useState({});
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  const handleNewProject = async (newProject) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...newProject,
          status: 'active',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProjects([...projects, data]);
      setShowNewProjectDialog(false);
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleNewConsultant = async (newConsultant) => {
    try {
      const { group, ...consultantData } = newConsultant;
      
      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert([{
          ...consultantData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (consultantError) throw consultantError;

      const updatedGroups = { ...consultantGroups };
      if (updatedGroups[group]) {
        updatedGroups[group].consultants.push(consultant);
        setConsultantGroups(updatedGroups);
      }
      
      setShowNewConsultantDialog(false);
      toast.success('Consultant added successfully');
    } catch (error) {
      console.error('Error creating consultant:', error);
      toast.error('Failed to add consultant');
    }
  };

  const handleNewGroup = async (groupName) => {
    try {
      const { data: group, error } = await supabase
        .from('consultant_groups')
        .insert([{
          title: groupName,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setConsultantGroups({
        ...consultantGroups,
        [group.id]: {
          title: group.title,
          consultants: [],
        },
      });
      
      setShowNewGroupDialog(false);
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectsList
        projects={projects}
        onProjectsChange={setProjects}
        onNewProject={() => setShowNewProjectDialog(true)}
      />

      <ConsultantsList
        consultantGroups={consultantGroups}
        onConsultantGroupsChange={setConsultantGroups}
        onNewConsultant={() => setShowNewConsultantDialog(true)}
        onNewGroup={() => setShowNewGroupDialog(true)}
      />

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onSave={handleNewProject}
      />

      <NewConsultantDialog
        open={showNewConsultantDialog}
        onOpenChange={setShowNewConsultantDialog}
        groups={consultantGroups}
        onSave={handleNewConsultant}
      />

      <NewGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        onSave={handleNewGroup}
      />
    </div>
  );
};