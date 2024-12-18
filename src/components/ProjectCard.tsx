import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar, Users, Timer, CheckCircle2, Pause } from "lucide-react";
import { ProjectConsultant } from "../data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  id?: string;
  title: string;
  status: "active" | "completed" | "on-hold";
  dueDate: string;
  consultants: ProjectConsultant[];
  onStatusChange?: (status: "active" | "completed" | "on-hold") => void;
}

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        icon: Timer, 
        bg: 'bg-warning',
        text: 'In Progress'
      };
    case 'completed':
      return { 
        icon: CheckCircle2, 
        bg: 'bg-success',
        text: 'Completed'
      };
    case 'on-hold':
      return { 
        icon: Pause, 
        bg: 'bg-danger',
        text: 'On Hold'
      };
    default:
      return { 
        icon: Timer, 
        bg: 'bg-warning',
        text: 'In Progress'
      };
  }
};

export function ProjectCard({ title, status, dueDate, consultants, onStatusChange }: ProjectCardProps) {
  const currentStatus = getStatusDetails(status);

  const handleStatusSelect = (newStatus: "active" | "completed" | "on-hold") => {
    if (onStatusChange) {
      onStatusChange(newStatus);
      toast.success(`Project status updated to ${getStatusDetails(newStatus).text}`);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
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
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${currentStatus.bg} text-white w-full`}
            >
              <currentStatus.icon className="mr-2 h-4 w-4" />
              {currentStatus.text}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => handleStatusSelect('active')}>
              <Timer className="mr-2 h-4 w-4" />
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('completed')}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('on-hold')}>
              <Pause className="mr-2 h-4 w-4" />
              On Hold
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}