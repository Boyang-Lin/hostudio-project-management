import { BaseConsultant, ProjectConsultant } from './consultant';

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
}

export interface DatabaseConsultant {
  project_id: string;
  email: string;
  name: string;
  specialty: string;
  quote: number;
  status?: 'in-progress' | 'completed' | 'on-hold';
}

// Transform database consultant to frontend format
export const transformDatabaseConsultant = (consultant: DatabaseConsultant): ProjectConsultant => ({
  name: consultant.name,
  email: consultant.email,
  specialty: consultant.specialty,
  quote: consultant.quote || 0,
  status: consultant.status as 'in-progress' | 'completed' | 'on-hold' | undefined,
  phone: 'N/A', // Default value
  company: 'N/A', // Default value
  address: 'N/A' // Default value
});

// Transform frontend consultant to database format
export const transformToDatabase = (projectId: string, consultant: BaseConsultant): DatabaseConsultant => ({
  project_id: projectId,
  email: consultant.email,
  name: consultant.name,
  specialty: consultant.specialty,
  quote: 0, // Default value
  status: 'in-progress' // Default value
});