import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, DollarSign, CheckCircle2, Pause, Timer } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ConsultantCardProps {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
  quote?: number;
  status?: 'in-progress' | 'completed' | 'on-hold';
  onQuoteChange?: (value: number) => void;
  onStatusChange?: (status: 'in-progress' | 'completed' | 'on-hold') => void;
  showQuoteInput?: boolean;
  showStatus?: boolean;
}

export function ConsultantCard({ 
  name, 
  email, 
  phone, 
  specialty,
  company,
  quote, 
  status,
  onQuoteChange,
  onStatusChange,
  showQuoteInput,
  showStatus
}: ConsultantCardProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'in-progress':
        return { 
          icon: Timer, 
          bg: 'bg-warning',
          text: 'In Progress',
          next: 'completed'
        };
      case 'completed':
        return { 
          icon: CheckCircle2, 
          bg: 'bg-success',
          text: 'Completed',
          next: 'on-hold'
        };
      case 'on-hold':
        return { 
          icon: Pause, 
          bg: 'bg-danger',
          text: 'On Hold',
          next: 'in-progress'
        };
      default:
        return { 
          icon: Timer, 
          bg: 'bg-warning',
          text: 'In Progress',
          next: 'completed'
        };
    }
  };

  const handleStatusClick = () => {
    if (!status || !onStatusChange) return;
    const nextStatus = getStatusDetails(status).next as 'in-progress' | 'completed' | 'on-hold';
    onStatusChange(nextStatus);
    toast.success(`Status updated to ${getStatusDetails(nextStatus).text}`);
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
          <Button
            variant="outline"
            size="sm"
            className={`${currentStatus.bg} text-white`}
            onClick={handleStatusClick}
          >
            <currentStatus.icon className="mr-2 h-4 w-4" />
            {currentStatus.text}
          </Button>
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
        </div>
      </CardContent>
    </Card>
  );
}