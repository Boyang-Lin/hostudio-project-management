import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserPlus, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationList } from "./OrganizationList";
import { MembersList } from "./MembersList";
import { Organization } from "./types";
import { useOrganizations } from "./hooks/useOrganizations";
import { useOrganizationMembers } from "./hooks/useOrganizationMembers";
import { NewOrgDialog, InviteMemberDialog } from "./dialogs/OrganizationDialogs";

export function OrganizationManagement() {
  const [showNewOrgDialog, setShowNewOrgDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const queryClient = useQueryClient();

  const { data: organizations = [], isLoading: orgsLoading } = useOrganizations();
  const { data: members = [], isLoading: membersLoading } = useOrganizationMembers(selectedOrg);

  const createOrgMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name }])
        .select()
        .single();

      if (orgError) throw orgError;

      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: org.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (memberError) throw memberError;
      return org;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setShowNewOrgDialog(false);
      setNewOrgName("");
      toast.success("Organization created successfully");
    },
    onError: (error) => {
      console.error('Error creating organization:', error);
      toast.error("Failed to create organization");
    }
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async ({ email, organizationId }: { email: string; organizationId: string }) => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();

      if (profileError) throw new Error('User not found');

      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: organizationId,
          user_id: profile.id,
          role: 'member'
        }]);

      if (memberError) throw memberError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      setShowInviteDialog(false);
      setInviteEmail("");
      toast.success("Member invited successfully");
    },
    onError: (error) => {
      console.error('Error inviting member:', error);
      toast.error("Failed to invite member");
    }
  });

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrgName.trim()) {
      createOrgMutation.mutate(newOrgName.trim());
    }
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim() && selectedOrg) {
      inviteMemberMutation.mutate({
        email: inviteEmail.trim(),
        organizationId: selectedOrg.id
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Organizations</h2>
        <Button onClick={() => setShowNewOrgDialog(true)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Organization
        </Button>
      </div>

      <OrganizationList
        organizations={organizations}
        selectedOrgId={selectedOrg?.id || null}
        membersCount={members.length}
        onSelectOrg={setSelectedOrg}
      />

      {selectedOrg && (
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Members of {selectedOrg.name}</h3>
            <Button onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
          <MembersList members={members} />
        </div>
      )}

      <NewOrgDialog
        open={showNewOrgDialog}
        onOpenChange={setShowNewOrgDialog}
        newOrgName={newOrgName}
        onNewOrgNameChange={setNewOrgName}
        onSubmit={handleCreateOrg}
      />

      <InviteMemberDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        inviteEmail={inviteEmail}
        onInviteEmailChange={setInviteEmail}
        onSubmit={handleInviteMember}
      />
    </div>
  );
}