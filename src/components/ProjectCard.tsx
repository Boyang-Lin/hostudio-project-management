import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";

interface ProjectCardProps {
  id?: string;
  title: string;
  status: "active" | "completed" | "on-hold";
  dueDate: string;
  consultants: string[];
  quote: string;
}

const statusColors = {
  active: "bg-success",
  completed: "bg-secondary",
  "on-hold": "bg-warning",
};

export function ProjectCard({ title, status, dueDate, consultants, quote }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Badge className={`${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            Due: {dueDate}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="mr-2 h-4 w-4" />
            {consultants.length} Consultant{consultants.length !== 1 ? "s" : ""}
          </div>
          <div className="mt-2 text-sm font-medium">
            Quote: {quote}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}