import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

// Temporary mock data (in a real app, this would come from a database)
const allConsultants = [
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

const projects = [
  {
    id: "1",
    title: "Website Redesign",
    status: "active" as const,
    dueDate: "2024-04-30",
    consultants: ["John Doe"],
    quote: "$15,000",
  },
  {
    id: "2",
    title: "Mobile App Development",
    status: "on-hold" as const,
    dueDate: "2024-05-15",
    consultants: ["Jane Smith"],
    quote: "$25,000",
  },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>(
    project?.consultants || []
  );

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleConsultantToggle = (consultantName: string) => {
    setSelectedConsultants((prev) =>
      prev.includes(consultantName)
        ? prev.filter((name) => name !== consultantName)
        : [...prev, consultantName]
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Link to="/" className="flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Project Details</h1>
        <ProjectCard {...project} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Assign Consultants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allConsultants.map((consultant) => (
            <div key={consultant.email} className="relative">
              <div className="absolute top-4 right-4 z-10">
                <Checkbox
                  checked={selectedConsultants.includes(consultant.name)}
                  onCheckedChange={() => handleConsultantToggle(consultant.name)}
                />
              </div>
              <ConsultantCard {...consultant} />
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full md:w-auto">Save Assignments</Button>
    </div>
  );
}