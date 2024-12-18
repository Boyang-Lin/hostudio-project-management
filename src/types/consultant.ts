export interface BaseConsultant {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
  address: string;
}

export interface ProjectConsultant extends BaseConsultant {
  quote: number; // Changed from optional to required
  status?: 'in-progress' | 'completed' | 'on-hold';
}

export interface ConsultantGroup {
  title: string;
  consultants: BaseConsultant[];
}