import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ConsultantCardProps {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  quote?: number;
}

export function ConsultantCard({ name, email, phone, specialty, quote }: ConsultantCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <p className="text-sm text-gray-600">{specialty}</p>
        </div>
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
          {quote !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="mr-2 h-4 w-4" />
              Quote: ${quote.toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}