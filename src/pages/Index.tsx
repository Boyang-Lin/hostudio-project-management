import { useState, useEffect } from "react";
import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { NewConsultantDialog } from "@/components/NewConsultantDialog";
import { NewGroupDialog } from "@/components/NewGroupDialog";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Index() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        toast.success("Successfully signed in!");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              view="sign_in"
            />
          </div>
          <div className="p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              view="sign_up"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectsList
        projects={[]}
        onProjectsChange={() => {}}
        onNewProject={() => {}}
      />

      <ConsultantsList
        consultantGroups={{}}
        onConsultantGroupsChange={() => {}}
        onNewConsultant={() => {}}
        onNewGroup={() => {}}
      />
    </div>
  );
}