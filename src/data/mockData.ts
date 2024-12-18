export interface Consultant {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
}

export interface ProjectConsultant extends Consultant {
  quote: number;
  status?: 'in-progress' | 'completed' | 'on-hold';
}

export interface ConsultantGroup {
  title: string;
  consultants: Consultant[];
}

export interface Project {
  id: string;
  title: string;
  status: "active" | "completed" | "on-hold";
  dueDate: string;
  consultants: ProjectConsultant[];
}

export interface Payment {
  consultantEmail: string;
  amount: number;
  status: 'pending' | 'paid';
  invoiceDate: string;
  paidDate?: string;
  invoiceName: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    status: "active",
    dueDate: "2024-04-30",
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
    dueDate: "2024-05-15",
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
        company: "Tech Solutions Inc"
      },
      {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "(555) 345-6789",
        specialty: "Civil Engineer",
        company: "Build Better Ltd"
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
        company: "Urban Planning Co"
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
        company: "Green Spaces Design"
      },
    ],
  },
};
