import { useState, useEffect } from "react";
import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { NewConsultantDialog } from "@/components/NewConsultantDialog";
import { NewGroupDialog } from "@/components/NewGroupDialog";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export default function Index() {
  const [session, setSession] = useState(null);
  const [projects, setProjects] = useState([]);
  const [consultantGroups, setConsultantGroups] = useState({});
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchData();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*');
      
      if (projectsError) throw projectsError;
      setProjects(projectsData);

      // Fetch consultants and groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('consultant_groups')
        .select(`
          *,
          consultants:consultants(*)
        `);
      
      if (groupsError) throw groupsError;

      // Transform groups data into the expected format
      const groupsObject = {};
      groupsData.forEach(group => {
        groupsObject[group.id] = {
          title: group.title,
          consultants: group.consultants || []
        };
      });
      
      setConsultantGroups(groupsObject);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto max-w-md py-8">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
        />
      </div>
    );
  }

  const handleNewProject = async (newProject) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...newProject,
          status: 'active',
          user_id: session.user.id
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
      
      // Insert new consultant
      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert([{
          ...consultantData,
          user_id: session.user.id
        }])
        .select()
        .single();

      if (consultantError) throw consultantError;

      // Update state
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
          user_id: session.user.id
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
}