import { useState, useEffect } from "react";
import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { NewConsultantDialog } from "@/components/NewConsultantDialog";
import { NewGroupDialog } from "@/components/NewGroupDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch consultant groups with their consultants
  const { data: consultantGroups = {}, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['consultant_groups'],
    queryFn: async () => {
      const { data: groups, error: groupsError } = await supabase
        .from('consultant_groups')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (groupsError) throw groupsError;

      const { data: consultants, error: consultantsError } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (consultantsError) throw consultantsError;

      // Transform the data into the expected format
      const groupedData: Record<string, { title: string; consultants: any[] }> = {};
      groups.forEach((group) => {
        groupedData[group.id] = {
          title: group.title,
          consultants: consultants.filter(c => c.group_id === group.id) || []
        };
      });

      return groupedData;
    }
  });

  // Add new project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (newProject: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('projects')
        .insert([{ ...newProject, owner_id: user.id }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add project: ' + error.message);
    }
  });

  // Add new consultant group mutation
  const addGroupMutation = useMutation({
    mutationFn: async (groupName: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('consultant_groups')
        .insert([{ 
          title: groupName,
          owner_id: user.id
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant_groups'] });
      toast.success('Group added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add group: ' + error.message);
    }
  });

  // Add new consultant mutation
  const addConsultantMutation = useMutation({
    mutationFn: async (newConsultant: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { group, ...consultantData } = newConsultant;
      const { error } = await supabase
        .from('consultants')
        .insert([{ 
          ...consultantData,
          group_id: group,
          owner_id: user.id
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant_groups'] });
      toast.success('Consultant added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add consultant: ' + error.message);
    }
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out: ' + error.message);
    } else {
      navigate('/login');
    }
  };

  if (isLoadingProjects || isLoadingGroups) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <ProjectsList
        projects={projects}
        onProjectsChange={() => queryClient.invalidateQueries({ queryKey: ['projects'] })}
        onNewProject={() => setShowNewProjectDialog(true)}
      />

      <ConsultantsList
        consultantGroups={consultantGroups}
        onConsultantGroupsChange={() => queryClient.invalidateQueries({ queryKey: ['consultant_groups'] })}
        onNewConsultant={() => setShowNewConsultantDialog(true)}
        onNewGroup={() => setShowNewGroupDialog(true)}
      />

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onSave={(newProject) => {
          addProjectMutation.mutate(newProject);
          setShowNewProjectDialog(false);
        }}
      />

      <NewConsultantDialog
        open={showNewConsultantDialog}
        onOpenChange={setShowNewConsultantDialog}
        groups={consultantGroups}
        onSave={(newConsultant) => {
          addConsultantMutation.mutate(newConsultant);
          setShowNewConsultantDialog(false);
        }}
      />

      <NewGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        onSave={(groupName) => {
          addGroupMutation.mutate(groupName);
          setShowNewGroupDialog(false);
        }}
      />
    </div>
  );
}