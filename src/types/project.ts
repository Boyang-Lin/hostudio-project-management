import { ProjectConsultant } from './consultant';

export interface Project {
  id: string;
  title: string;
  status: "active" | "completed" | "on-hold";
  consultants: ProjectConsultant[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  constructionCost: number;
}

export interface DatabaseProject {
  id: string;
  title: string;
  status: "active" | "completed" | "on-hold";
  client_name: string;
  client_email: string;
  client_phone: string;
  construction_cost: number;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface DatabaseProjectConsultant {
  project_id: string;
  email: string;
  name: string;
  specialty: string;
  quote: number | null;
  status: string | null;
  created_at: string;
}

// Utility function to transform database consultant to frontend consultant
export const transformDatabaseConsultant = (consultant: DatabaseProjectConsultant): ProjectConsultant => ({
  name: consultant.name,
  email: consultant.email,
  specialty: consultant.specialty,
  quote: consultant.quote || undefined,
  status: consultant.status as 'in-progress' | 'completed' | 'on-hold' | undefined,
  // Add default values for required fields that don't exist in database
  phone: 'N/A',
  company: 'N/A'
});

// Utility function to transform frontend consultant to database format
export const transformToDatabase = (projectId: string, consultant: BaseConsultant) => ({
  project_id: projectId,
  email: consultant.email,
  name: consultant.name,
  specialty: consultant.specialty
});