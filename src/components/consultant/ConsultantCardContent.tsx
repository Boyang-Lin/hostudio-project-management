import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, DollarSign, MapPin, Building } from "lucide-react";

interface ConsultantCardContentProps {
  email: string;
  phone: string;
  company: string;
  address?: string;
  quote?: number;
  showQuoteInput?: boolean;
  onQuoteChange?: (value: number) => void;
}

export function ConsultantCardContent({
  email,
  phone,
  company,
  address,
  quote,
  showQuoteInput,
  onQuoteChange,
}: ConsultantCardContentProps) {
  return (
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
        <div className="flex items-center text-sm text-gray-600">
          <Building className="mr-2 h-4 w-4" />
          {company}
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
      </div>
    </CardContent>
  );
}