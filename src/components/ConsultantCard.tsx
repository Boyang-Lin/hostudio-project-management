import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, DollarSign, CheckCircle2, Pause, Timer, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConsultantCardProps {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
  address?: string;
  quote?: number;
  status?: 'in-progress' | 'completed' | 'on-hold';
  onQuoteChange?: (value: number) => void;
  onStatusChange?: (status: 'in-progress' | 'completed' | 'on-hold') => void;
  showQuoteInput?: boolean;
  showStatus?: boolean;
  group?: string;
  onGroupChange?: (newGroup: string) => void;
  groups?: Record<string, { title: string; consultants: any[] }>;
}

export function ConsultantCard({ 
  name, 
  email, 
  phone, 
  specialty,
  company,
  address,
  quote, 
  status,
  onQuoteChange,
  onStatusChange,
  showQuoteInput,
  showStatus,
  group,
  onGroupChange,
  groups
}: ConsultantCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow">
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
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="mr-2 h-4 w-4" />
            {email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="mr-2 h-4 w-4" />
            {phone}
          </div>
          {address && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="mr-2 h-4 w-4" />
              {address}
            </div>
          )}
          {(quote !== undefined || showQuoteInput) && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="mr-2 h-4 w-4" />
              {showQuoteInput ? (
                <Input
                  type="number"
                  value={quote || ''}
                  onChange={(e) => onQuoteChange?.(Number(e.target.value))}
                  placeholder="Enter quote amount"
                  className="w-full"
                />
              ) : (
                `Quote: $${quote?.toLocaleString()}`
              )}
            </div>
          )}
          {groups && onGroupChange && (
            <div className="flex items-center text-sm text-gray-600">
              <Select value={group} onValueChange={onGroupChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groups).map(([key, group]) => (
                    <SelectItem key={key} value={key}>
                      {group.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}