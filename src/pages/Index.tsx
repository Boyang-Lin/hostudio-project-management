import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { Plus } from "lucide-react";

// Temporary mock data
const projects = [
  {
    title: "Website Redesign",
    status: "active" as const,
    dueDate: "2024-04-30",
    consultants: ["John Doe", "Jane Smith"],
    quote: "$15,000",
  },
  {
    title: "Mobile App Development",
    status: "on-hold" as const,
    dueDate: "2024-05-15",
    consultants: ["Mike Johnson"],
    quote: "$25,000",
  },
];

const consultants = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    specialty: "UI/UX Design",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 234-5678",
    specialty: "Full Stack Development",
  },
];

export default function Index() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Consultants</h2>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Consultant
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((consultant) => (
            <ConsultantCard key={consultant.email} {...consultant} />
          ))}
        </div>
      </div>
    </div>
  );
}