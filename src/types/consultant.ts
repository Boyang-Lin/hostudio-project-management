export interface BaseConsultant {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
  address?: string;
}

export interface ProjectConsultant extends BaseConsultant {
  quote: number;
  status?: 'in-progress' | 'completed' | 'on-hold';
}

export interface ConsultantGroup {
  title: string;
  consultants: BaseConsultant[];
}

// Move consultantGroups from mockData to here since it's being used in ProjectDetail
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