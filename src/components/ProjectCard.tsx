import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Timer, CheckCircle2, Pause, Mail, Phone, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
        text: 'In Progress'
      };
    case 'completed':
      return { 
        icon: CheckCircle2, 
        color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        text: 'Completed'
      };
    case 'on-hold':
      return { 
        icon: Pause, 
        color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
        text: 'On Hold'
      };
    default:
      return { 
        icon: Timer, 
        color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
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
  const StatusIcon = currentStatus.icon;

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
    <Card className="group hover:shadow-lg transition-all duration-300 relative flex flex-col h-full border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-primary line-clamp-1">{title}</CardTitle>
        <Badge 
          variant="outline" 
          className={cn("transition-colors", currentStatus.color)}
        >
          <StatusIcon className="mr-1 h-4 w-4" />
          {currentStatus.text}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4" />
            <span className="line-clamp-1">{client_name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
            <a 
              href={`mailto:${client_email}`} 
              className="hover:text-primary transition-colors line-clamp-1"
              onClick={(e) => e.stopPropagation()}
            >
              {client_email}
            </a>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
            <a 
              href={`tel:${client_phone}`} 
              className="hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {client_phone}
            </a>
          </div>
          <div className="flex items-center text-sm font-medium">
            <DollarSign className="mr-2 h-4 w-4" />
            {formatCurrency(construction_cost)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full group-hover:border-primary/50 transition-colors"
            >
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