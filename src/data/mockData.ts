export interface Consultant {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
  address?: string;
}

export interface ProjectConsultant extends Consultant {
  quote: number;
  status?: 'in-progress' | 'completed' | 'on-hold';
}

export interface ConsultantGroup {
  title: string;
  consultants: Consultant[];
}

export interface Payment {
  consultantEmail: string;
  amount: number;
  status: 'pending' | 'paid';
  invoiceDate: string;
  paidDate?: string;
  invoiceName: string;
}

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

export const projects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    status: "active",
    clientName: "John Client",
    clientEmail: "john.client@example.com",
    clientPhone: "(555) 987-6543",
    constructionCost: 1500000,
    consultants: [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        specialty: "UI/UX Design",
        company: "Tech Solutions Inc",
        quote: 15000,
        status: 'in-progress'
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "(555) 234-5678",
        specialty: "Urban Planner",
        company: "Urban Planning Co",
        quote: 18000,
        status: 'completed'
      }
    ],
  },
  {
    id: "2",
    title: "Mobile App Development",
    status: "on-hold",
    clientName: "Sarah Client",
    clientEmail: "sarah.client@example.com",
    clientPhone: "(555) 876-5432",
    constructionCost: 2500000,
    consultants: [
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "(555) 456-7890",
        specialty: "Landscape Architect",
        company: "Green Spaces Design",
        quote: 20000,
        status: 'on-hold'
      }
    ],
  },
];

export const consultantGroups: Record<string, ConsultantGroup> = {
  engineers: {
    title: "Engineers",
    consultants: [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        specialty: "UI/UX Design",
        company: "Tech Solutions Inc",
        address: "123 Main St, City, State"
      },
      {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "(555) 345-6789",
        specialty: "Civil Engineer",
        company: "Build Better Ltd",
        address: "456 Oak Ave, City, State"
      },
    ],
  },
  planners: {
    title: "Planners",
    consultants: [
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "(555) 234-5678",
        specialty: "Urban Planner",
        company: "Urban Planning Co",
        address: "789 Pine Rd, City, State"
      },
    ],
  },
  landscapeArchitects: {
    title: "Landscape Architects",
    consultants: [
      {
        name: "Mike Brown",
        email: "mike@example.com",
        phone: "(555) 456-7890",
        specialty: "Landscape Architect",
        company: "Green Spaces Design",
        address: "321 Elm St, City, State"
      },
    ],
  },
};
