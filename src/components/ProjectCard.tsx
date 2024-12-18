import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, Timer, CheckCircle2, Pause, Mail, Phone, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  id?: string;
  title: string;
  status: "active" | "completed" | "on-hold";
  client_name: string;
  client_email: string;
  client_phone: string;
  construction_cost: number;
  onStatusChange?: (status: "active" | "completed" | "on-hold") => void;
}

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        icon: Timer, 
        bg: 'bg-yellow-500',
        text: 'In Progress'
      };
    case 'completed':
      return { 
        icon: CheckCircle2, 
        bg: 'bg-green-500',
        text: 'Completed'
      };
    case 'on-hold':
      return { 
        icon: Pause, 
        bg: 'bg-red-500',
        text: 'On Hold'
      };
    default:
      return { 
        icon: Timer, 
        bg: 'bg-yellow-500',
        text: 'In Progress'
      };
  }
};

export function ProjectCard({ 
  title, 
  status, 
  client_name,
  client_email,
  client_phone,
  construction_cost,
  onStatusChange 
}: ProjectCardProps) {
  const currentStatus = getStatusDetails(status);

  const handleStatusSelect = (newStatus: "active" | "completed" | "on-hold", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(newStatus);
      toast.success(`Project status updated to ${getStatusDetails(newStatus).text}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-primary">{title}</CardTitle>
        <Badge variant="outline" className={`${currentStatus.bg} text-white`}>
          <currentStatus.icon className="mr-1 h-4 w-4" />
          {currentStatus.text}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="mr-2 h-4 w-4" />
            {client_name}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="mr-2 h-4 w-4" />
            <a href={`mailto:${client_email}`} className="hover:text-primary">
              {client_email}
            </a>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="mr-2 h-4 w-4" />
            <a href={`tel:${client_phone}`} className="hover:text-primary">
              {client_phone}
            </a>
          </div>
          <div className="flex items-center text-sm font-semibold">
            <DollarSign className="mr-2 h-4 w-4" />
            {formatCurrency(construction_cost)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className="w-full">
              Change Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={(e) => handleStatusSelect('active', e)}>
              <Timer className="mr-2 h-4 w-4" />
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleStatusSelect('completed', e)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleStatusSelect('on-hold', e)}>
              <Pause className="mr-2 h-4 w-4" />
              On Hold
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}