import { Consultant } from "@/data/mockData";
import { ConsultantCard } from "./ConsultantCard";
import { ConsultantEditDialog } from "./ConsultantEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ConsultantsListProps {
  consultantGroups: Record<string, { title: string; consultants: Consultant[] }>;
  onConsultantGroupsChange: (groups: Record<string, { title: string; consultants: Consultant[] }>) => void;
  onNewConsultant: () => void;
  onNewGroup: () => void;
}

export function ConsultantsList({
  consultantGroups,
  onConsultantGroupsChange,
  onNewConsultant,
  onNewGroup,
}: ConsultantsListProps) {
  const [editingConsultant, setEditingConsultant] = useState<{ consultant: Consultant; groupKey: string } | null>(null);
  const [deletingConsultant, setDeletingConsultant] = useState<{ consultant: Consultant; group: string } | null>(null);

  const handleConsultantUpdate = (updatedConsultant: Consultant, newGroupKey: string) => {
    const newGroups = { ...consultantGroups };
    
    // If group changed, remove from old group and add to new group
    if (editingConsultant && editingConsultant.groupKey !== newGroupKey) {
      newGroups[editingConsultant.groupKey].consultants = newGroups[editingConsultant.groupKey].consultants
        .filter(c => c.email !== editingConsultant.consultant.email);
      newGroups[newGroupKey].consultants.push(updatedConsultant);
    } else if (editingConsultant) {
      // Just update the consultant in the current group
      newGroups[editingConsultant.groupKey].consultants = newGroups[editingConsultant.groupKey].consultants
        .map(c => c.email === editingConsultant.consultant.email ? updatedConsultant : c);
    }
    
    onConsultantGroupsChange(newGroups);
    toast.success("Consultant updated successfully");
  };

  const handleDeleteConsultant = () => {
    if (deletingConsultant) {
      const newGroups = { ...consultantGroups };
      newGroups[deletingConsultant.group].consultants = newGroups[deletingConsultant.group].consultants
        .filter(c => c.email !== deletingConsultant.consultant.email);
      onConsultantGroupsChange(newGroups);
      setDeletingConsultant(null);
      toast.success("Consultant deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Consultants</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onNewGroup}>
            <Plus className="mr-2 h-4 w-4" /> New Group
          </Button>
          <Button onClick={onNewConsultant}>
            <Plus className="mr-2 h-4 w-4" /> Add Consultant
          </Button>
        </div>
      </div>

      {Object.entries(consultantGroups).map(([key, group]) => (
        <div key={key} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
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
        groups={consultantGroups}
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
    </div>
  );
}