import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member, Organization } from "../types";

export function useOrganizationMembers(selectedOrg: Organization | null) {
  return useQuery({
    queryKey: ['organization-members', selectedOrg?.id],
    enabled: !!selectedOrg,
    queryFn: async () => {
      if (!selectedOrg) return [];

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          user_id,
          role,
          profiles:profiles!inner (
            username
          )
        `)
        .eq('organization_id', selectedOrg.id);

      if (error) throw error;

      return data.map(member => ({
        user_id: member.user_id,
        role: member.role,
        profile_username: member.profiles?.username || 'Unknown User'
      })) as Member[];
    }
  });
}