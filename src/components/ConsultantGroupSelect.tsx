import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConsultantGroup } from "../data/mockData";
import { toast } from "sonner";

interface ConsultantGroupSelectProps {
  consultantEmail: string;
  currentGroup: string;
  groups: Record<string, ConsultantGroup>;
  onGroupChange: (email: string, newGroup: string, oldGroup: string) => void;
}

export function ConsultantGroupSelect({
  consultantEmail,
  currentGroup,
  groups,
  onGroupChange,
}: ConsultantGroupSelectProps) {
  const handleGroupChange = (newGroup: string) => {
    onGroupChange(consultantEmail, newGroup, currentGroup);
    toast.success("Consultant group updated successfully");
  };

  return (
    <Select onValueChange={handleGroupChange} defaultValue={currentGroup}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select group" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(groups).map((groupKey) => (
          <SelectItem key={groupKey} value={groupKey}>
            {groups[groupKey].title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}