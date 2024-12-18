import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Project, ProjectConsultant } from "../data/mockData";

// Temporary mock data
const projects: Project[] = [
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
        quote: 15000
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "(555) 234-5678",
        specialty: "Urban Planner",
        quote: 18000
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
        quote: 20000
      }
    ],
  },
];

const consultantGroups = {
  engineers: {
    title: "Engineers",
    consultants: [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        specialty: "UI/UX Design",
        quote: 15000,
      },
      {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "(555) 345-6789",
        specialty: "Civil Engineer",
        quote: 12000,
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
        quote: 18000,
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
        quote: 20000,
      },
    ],
  },
};

export default function Index() {
  const { toast } = useToast();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const handleNewProject = () => {
    toast({
      title: "Coming Soon",
      description: "New project creation functionality will be available soon.",
    });
  };

  const handleAddConsultant = () => {
    toast({
      title: "Coming Soon",
      description: "Consultant addition functionality will be available soon.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <Button onClick={handleNewProject}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <ProjectCard {...project} />
            </Link>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Consultants</h2>
          <Button onClick={handleAddConsultant}>
            <Plus className="mr-2 h-4 w-4" /> Add Consultant
          </Button>
        </div>
        {Object.entries(consultantGroups).map(([key, group]) => (
          <div key={key} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.consultants.map((consultant) => (
                <ConsultantCard key={consultant.email} {...consultant} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}