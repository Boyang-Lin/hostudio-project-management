import { Users } from "lucide-react";
import { ConsultantCard } from "./ConsultantCard";
import { ProjectConsultant } from "../data/mockData";
import { groupConsultantsBySpecialty } from "../utils/consultantGrouping";

interface EngagementTabContentProps {
  selectedConsultants: ProjectConsultant[];
  quotes: { [email: string]: number };
  onConsultantClick: (consultant: ProjectConsultant) => void;
  onStatusChange: (email: string, status: 'in-progress' | 'completed' | 'on-hold') => void;
}

export function EngagementTabContent({
  selectedConsultants,
  quotes,
  onConsultantClick,
  onStatusChange
}: EngagementTabContentProps) {
  const groupedConsultants = groupConsultantsBySpecialty(selectedConsultants);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Selected Consultants</h2>
      {Object.entries(groupedConsultants).map(([groupName, consultants]) => (
        <div key={groupName} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <h3 className="text-xl font-semibold">{groupName}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((consultant) => (
              <div
                key={consultant.email}
                className="cursor-pointer"
                onClick={() => onConsultantClick(consultant)}
              >
                <ConsultantCard 
                  {...consultant} 
                  quote={quotes[consultant.email]}
                  showStatus={true}
                  onStatusChange={(status) => onStatusChange(consultant.email, status)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}