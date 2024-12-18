import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings } from "lucide-react";
import { Organization } from "./types";

interface OrganizationListProps {
  organizations: Organization[];
  selectedOrgId: string | null;
  membersCount: number;
  onSelectOrg: (org: Organization) => void;
}

export function OrganizationList({ 
  organizations, 
  selectedOrgId, 
  membersCount,
  onSelectOrg 
}: OrganizationListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizations.map((org) => (
        <Card 
          key={org.id} 
          className={`cursor-pointer transition-shadow hover:shadow-lg ${
            selectedOrgId === org.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectOrg(org)}
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
                {membersCount} members
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}