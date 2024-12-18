import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConsultantGroup } from "../data/mockData";
import { toast } from "sonner";
import { BaseConsultant } from "@/types/consultant";
import { Dispatch, SetStateAction } from "react";

interface ConsultantGroupSelectProps {
  selectedConsultant: BaseConsultant | null;
  setSelectedConsultant: Dispatch<SetStateAction<BaseConsultant | null>>;
  onAddConsultant: () => void;
}

export function ConsultantGroupSelect({
  selectedConsultant,
  setSelectedConsultant,
  onAddConsultant,
}: ConsultantGroupSelectProps) {
  const handleGroupChange = () => {
    onAddConsultant();
    toast.success("Consultant added successfully");
  };

  return (
    <Select onValueChange={handleGroupChange} defaultValue={selectedConsultant?.email}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select consultant" />
      </SelectTrigger>
      <SelectContent>
        {selectedConsultant && (
          <SelectItem value={selectedConsultant.email}>
            {selectedConsultant.name}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}