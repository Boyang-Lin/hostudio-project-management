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

// Transform database consultant to frontend consultant
export const transformDatabaseConsultant = (consultant: DatabaseProjectConsultant): ProjectConsultant => ({
  name: consultant.name,
  email: consultant.email,
  specialty: consultant.specialty,
  quote: consultant.quote || 0, // Ensure quote is always a number
  status: consultant.status as 'in-progress' | 'completed' | 'on-hold' | undefined,
  phone: 'N/A', // Default value
  company: 'N/A' // Default value
});

// Transform frontend consultant to database format
export const transformToDatabase = (projectId: string, consultant: ProjectConsultant) => ({
  project_id: projectId,
  email: consultant.email,
  name: consultant.name,
  specialty: consultant.specialty,
  quote: consultant.quote || 0,
  status: consultant.status || 'in-progress'
});