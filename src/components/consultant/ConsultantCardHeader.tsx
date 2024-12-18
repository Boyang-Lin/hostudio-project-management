import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Timer, CheckCircle2, Pause } from "lucide-react";
import { toast } from "sonner";

interface ConsultantCardHeaderProps {
  name: string;
  company: string;
  specialty: string;
  status?: 'in-progress' | 'completed' | 'on-hold';
  onStatusChange?: (status: 'in-progress' | 'completed' | 'on-hold') => void;
  showStatus?: boolean;
}

export function ConsultantCardHeader({
  name,
  company,
  specialty,
  status,
  onStatusChange,
  showStatus,
}: ConsultantCardHeaderProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'in-progress':
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

  const handleStatusSelect = (newStatus: 'in-progress' | 'completed' | 'on-hold') => {
    if (onStatusChange) {
      onStatusChange(newStatus);
      toast.success(`Status updated to ${getStatusDetails(newStatus).text}`);
    }
  };

  const currentStatus = status ? getStatusDetails(status) : null;

  return (
    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <p className="text-sm text-gray-600">{company}</p>
        <p className="text-sm text-gray-600">{specialty}</p>
      </div>
      {showStatus && currentStatus && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${currentStatus.bg} text-white`}
            >
              <currentStatus.icon className="mr-2 h-4 w-4" />
              {currentStatus.text}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusSelect('in-progress')}>
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
      )}
    </CardHeader>
  );
}