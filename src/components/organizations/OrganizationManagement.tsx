import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Settings, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function OrganizationManagement() {
  const [showNewOrgDialog, setShowNewOrgDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: organizations = [], isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: memberships, error: membershipError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', memberships?.map(m => m.organization_id) || []);

      if (orgsError) throw orgsError;
      return orgs;
    }
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['organization-members', selectedOrg?.id],
    enabled: !!selectedOrg,
    queryFn: async () => {
      if (!selectedOrg) return [];

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          user_id,
          role,
          profiles:user_id (
            username
          )
        `)
        .eq('organization_id', selectedOrg.id);

      if (error) throw error;
      return data;
    }
  });

  const createOrgMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name }])
        .select()
        .single();

      if (orgError) throw orgError;

      // Add creator as admin
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
      // For now, we'll just create the member directly
      // In a real app, you'd want to send an invitation email
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card 
            key={org.id} 
            className={`cursor-pointer transition-shadow hover:shadow-lg ${
              selectedOrg?.id === org.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedOrg(org)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{org.name}</span>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {members.length} members
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrg && (
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Members of {selectedOrg.name}</h3>
            <Button onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.user_id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <span>{member.profiles?.username}</span>
                    <Badge>{member.role}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <Input
              placeholder="Organization name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
            />
            <Button type="submit" className="w-full">Create</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteMember} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button type="submit" className="w-full">Send Invitation</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}