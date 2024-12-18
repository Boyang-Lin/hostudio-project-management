import { BaseConsultant, ProjectConsultant } from './consultant';

export type ProjectStatus = "active" | "completed" | "on-hold";
export type ConsultantStatus = "in-progress" | "completed" | "on-hold";

export interface DatabaseProject {
  id: string;
  title: string;
  status: ProjectStatus;
  client_name: string;
  client_email: string;
  client_phone: string;
  construction_cost: number;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface DatabaseConsultant {
  project_id: string;
  email: string;
  name: string;
  specialty: string;
  quote: number | null;
  status: ConsultantStatus;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  consultants: ProjectConsultant[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  constructionCost: number;
}

// Transform database project to frontend format
export const transformDatabaseProject = (dbProject: DatabaseProject, consultants: ProjectConsultant[]): Project => ({
  id: dbProject.id,
  title: dbProject.title,
  status: dbProject.status,
  consultants,
  clientName: dbProject.client_name,
  clientEmail: dbProject.client_email,
  clientPhone: dbProject.client_phone,
  constructionCost: dbProject.construction_cost
});

// Transform database consultant to frontend format
export const transformDatabaseConsultant = (consultant: DatabaseConsultant): ProjectConsultant => ({
  name: consultant.name,
  email: consultant.email,
  specialty: consultant.specialty,
  quote: consultant.quote || 0,
  status: consultant.status,
  phone: 'N/A',
  company: 'N/A',
  address: 'N/A'
});