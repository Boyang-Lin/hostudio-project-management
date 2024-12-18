import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Member } from "./types";

interface MembersListProps {
  members: Member[];
}

export function MembersList({ members }: MembersListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card key={member.user_id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span>{member.profile_username}</span>
              <Badge>{member.role}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}