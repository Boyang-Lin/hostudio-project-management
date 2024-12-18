import { Consultant } from "@/data/mockData";
import { ConsultantCard } from "./ConsultantCard";
import { ConsultantEditDialog } from "./ConsultantEditDialog";
import { ConsultantGroupSelect } from "./ConsultantGroupSelect";
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
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(null);
  const [deletingConsultant, setDeletingConsultant] = useState<{ consultant: Consultant; group: string } | null>(null);

  const handleConsultantUpdate = (updatedConsultant: Consultant) => {
    const newGroups = { ...consultantGroups };
    Object.keys(newGroups).forEach(groupKey => {
      newGroups[groupKey].consultants = newGroups[groupKey].consultants.map(c =>
        c.email === editingConsultant?.email ? updatedConsultant : c
      );
    });
    onConsultantGroupsChange(newGroups);
    toast.success("Consultant updated successfully");
  };

  const handleGroupChange = (email: string, newGroup: string, oldGroup: string) => {
    const newGroups = { ...consultantGroups };
    const consultant = newGroups[oldGroup].consultants.find(c => c.email === email);
    if (consultant) {
      newGroups[oldGroup].consultants = newGroups[oldGroup].consultants.filter(
        c => c.email !== email
      );
      newGroups[newGroup].consultants.push(consultant);
      onConsultantGroupsChange(newGroups);
      toast.success("Consultant moved to new group");
    }
  };

  const handleDeleteConsultant = () => {
    if (deletingConsultant) {
      const newGroups = { ...consultantGroups };
      newGroups[deletingConsultant.group].consultants = newGroups[deletingConsultant.group].consultants.filter(
        c => c.email !== deletingConsultant.consultant.email
      );
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
                <div className="absolute top-2 right-2 z-10 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingConsultant(consultant)}
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
                <div className="mb-2">
                  <ConsultantGroupSelect
                    consultantEmail={consultant.email}
                    currentGroup={key}
                    groups={consultantGroups}
                    onGroupChange={handleGroupChange}
                  />
                </div>
                <ConsultantCard {...consultant} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <ConsultantEditDialog
        consultant={editingConsultant}
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