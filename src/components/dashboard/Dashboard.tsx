import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { NewConsultantDialog } from "@/components/NewConsultantDialog";
import { NewGroupDialog } from "@/components/NewGroupDialog";
import { OrganizationManagement } from "@/components/organizations/OrganizationManagement";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { consultantGroups } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Dashboard = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [groups, setGroups] = useState(consultantGroups);

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
      
      setShowNewGroupDialog(false);
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  const handleConsultantGroupsChange = (newGroups) => {
    setGroups(newGroups);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectsList
            onNewProject={() => setShowNewProjectDialog(true)}
          />
        </TabsContent>

        <TabsContent value="consultants">
          <ConsultantsList
            consultantGroups={groups}
            onConsultantGroupsChange={handleConsultantGroupsChange}
            onNewConsultant={() => setShowNewConsultantDialog(true)}
            onNewGroup={() => setShowNewGroupDialog(true)}
          />
        </TabsContent>

        <TabsContent value="organizations">
          <OrganizationManagement />
        </TabsContent>
      </Tabs>

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onSave={handleNewProject}
      />

      <NewConsultantDialog
        open={showNewConsultantDialog}
        onOpenChange={setShowNewConsultantDialog}
        onSave={handleNewConsultant}
        groups={groups}
      />

      <NewGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        onSave={handleNewGroup}
      />
    </div>
  );
};