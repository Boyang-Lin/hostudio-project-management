import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ConsultantCardHeader } from "./consultant/ConsultantCardHeader";
import { ConsultantCardContent } from "./consultant/ConsultantCardContent";
import { ConsultantGroup } from "../data/mockData";

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
  groups?: string[];
  consultantGroups?: Record<string, ConsultantGroup>;
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
}: ConsultantCardProps) {
  const cardContent = (
    <>
      <ConsultantCardHeader
        name={name}
        company={company}
        specialty={specialty}
        status={status}
        onStatusChange={onStatusChange}
        showStatus={showStatus}
      />
      <ConsultantCardContent
        email={email}
        phone={phone}
        company={company}
        address={address}
        quote={quote}
        showQuoteInput={showQuoteInput}
        onQuoteChange={onQuoteChange}
      />
    </>
  );

  // If the card is being used in a project context (has status or quote input), don't make it a link
  if (showStatus || showQuoteInput) {
    return <Card className="hover:shadow-lg transition-shadow">{cardContent}</Card>;
  }

  // Otherwise, make it a link to the consultant detail page
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link to={`/consultant/${email}`} className="block">
        {cardContent}
      </Link>
    </Card>
  );
}