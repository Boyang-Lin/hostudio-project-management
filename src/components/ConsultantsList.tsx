import { Consultant } from "@/data/mockData";
import { ConsultantCard } from "./ConsultantCard";
import { ConsultantEditDialog } from "./ConsultantEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "./ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NewConsultantDialog } from "./NewConsultantDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ConsultantsListProps {
  onNewConsultant: () => void;
  onNewGroup: () => void;
}

export function ConsultantsList({
  onNewConsultant,
  onNewGroup,
}: ConsultantsListProps) {
  const [editingConsultant, setEditingConsultant] = useState<{ consultant: Consultant; groupKey: string } | null>(null);
  const [deletingConsultant, setDeletingConsultant] = useState<{ consultant: Consultant; group: string } | null>(null);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: groupsData = {}, isLoading } = useQuery({
    queryKey: ['consultant-groups'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('No user found');
      }

      // First fetch all consultant groups
      const { data: groups, error: groupsError } = await supabase
        .from('consultant_groups')
        .select('*')
        .eq('user_id', user.user.id);

      if (groupsError) {
        toast.error('Failed to fetch consultant groups');
        throw groupsError;
      }

      // Then fetch all consultants
      const { data: consultants, error: consultantsError } = await supabase
        .from('consultants')
        .select('*')
        .eq('user_id', user.user.id);

      if (consultantsError) {
        toast.error('Failed to fetch consultants');
        throw consultantsError;
      }

      // Transform the data into the expected format
      const groupedData: Record<string, { title: string; consultants: Consultant[] }> = {};
      
      groups.forEach((group: any) => {
        groupedData[group.id] = {
          title: group.title,
          consultants: []
        };
      });

      // Add consultants to their respective groups
      consultants.forEach((consultant: any) => {
        Object.keys(groupedData).forEach(groupId => {
          groupedData[groupId].consultants.push({
            name: consultant.name,
            email: consultant.email,
            phone: consultant.phone,
            specialty: consultant.specialty,
            company: consultant.company,
            address: consultant.address
          });
        });
      });

      return groupedData;
    }
  });

  const handleConsultantUpdate = async (updatedConsultant: Consultant, newGroupKey: string) => {
    if (!editingConsultant) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error('No user found');
      return;
    }

    const { error } = await supabase
      .from('consultants')
      .update({
        name: updatedConsultant.name,
        email: updatedConsultant.email,
        phone: updatedConsultant.phone,
        specialty: updatedConsultant.specialty,
        company: updatedConsultant.company,
        address: updatedConsultant.address
      })
      .eq('email', editingConsultant.consultant.email);

    if (error) {
      toast.error('Failed to update consultant');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['consultant-groups'] });
    setEditingConsultant(null);
    toast.success("Consultant updated successfully");
  };

  const handleDeleteConsultant = async () => {
    if (!deletingConsultant) return;

    const { error } = await supabase
      .from('consultants')
      .delete()
      .eq('email', deletingConsultant.consultant.email);

    if (error) {
      toast.error('Failed to delete consultant');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['consultant-groups'] });
    setDeletingConsultant(null);
    toast.success("Consultant deleted successfully");
  };

  const handleNewConsultant = async (data: Consultant & { group: string }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error('No user found');
      return;
    }

    const { error } = await supabase
      .from('consultants')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        company: data.company,
        address: data.address,
        user_id: user.user.id
      });

    if (error) {
      toast.error('Failed to add consultant');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['consultant-groups'] });
    setShowNewConsultantDialog(false);
    toast.success("Consultant added successfully");
  };

  if (isLoading) {
    return <div>Loading consultants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Consultants</h2>
        <div className="space-x-2">
          <Button variant="ghost" onClick={onNewGroup}>
            <Plus className="mr-2 h-4 w-4" /> New Group
          </Button>
          <Button variant="ghost" onClick={() => setShowNewConsultantDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Consultant
          </Button>
        </div>
      </div>

      {Object.entries(groupsData).map(([key, group]) => (
        <div key={key} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{group.title}</h3>
            <Button variant="ghost" size="sm" onClick={() => {
              const newTitle = prompt("Enter new group title:", group.title);
              if (newTitle && newTitle !== group.title) {
                supabase
                  .from('consultant_groups')
                  .update({ title: newTitle })
                  .eq('id', key)
                  .then(({ error }) => {
                    if (error) {
                      toast.error('Failed to update group title');
                    } else {
                      queryClient.invalidateQueries({ queryKey: ['consultant-groups'] });
                      toast.success("Group title updated successfully");
                    }
                  });
              }
            }}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.consultants.map((consultant) => (
              <div key={consultant.email} className="relative group">
                <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingConsultant({ consultant, groupKey: key })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeletingConsultant({ consultant, group: key })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ConsultantCard {...consultant} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <ConsultantEditDialog
        consultant={editingConsultant?.consultant || null}
        currentGroup={editingConsultant?.groupKey || ''}
        groups={groupsData}
        open={!!editingConsultant}
        onOpenChange={(open) => !open && setEditingConsultant(null)}
        onSave={handleConsultantUpdate}
      />

      <DeleteConfirmDialog
        open={!!deletingConsultant}
        onOpenChange={(open) => !open && setDeletingConsultant(null)}
        onConfirm={handleDeleteConsultant}
        title="Delete Consultant"
        description="Are you sure you want to delete this consultant? This action cannot be undone."
      />

      <NewConsultantDialog
        open={showNewConsultantDialog}
        onOpenChange={setShowNewConsultantDialog}
        onSave={handleNewConsultant}
        groups={groupsData}
      />
    </div>
  );
}