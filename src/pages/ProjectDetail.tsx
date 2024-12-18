import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { ConsultantTasks } from "@/components/ConsultantTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Temporary mock data (in a real app, this would come from a database)
const consultantGroups = {
  engineers: {
    title: "Engineers",
    consultants: [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        specialty: "Structural Engineer",
      },
      {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "(555) 345-6789",
        specialty: "Civil Engineer",
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
      },
    ],
  },
};

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

interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate: Date | undefined;
  relatedTasks: string[];
}

interface ConsultantTasks {
  [consultantEmail: string]: Task[];
}

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>(
    project?.consultants || []
  );
  const [activeTab, setActiveTab] = useState("details");
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [consultantTasks, setConsultantTasks] = useState<ConsultantTasks>({});

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

  const handleConsultantClick = (consultant: any) => {
    setSelectedConsultant(consultant);
  };

  const handleTasksUpdate = (tasks: Task[]) => {
    if (selectedConsultant) {
      setConsultantTasks(prev => ({
        ...prev,
        [selectedConsultant.email]: tasks
      }));
    }
  };

  // Get all tasks from all consultants for linking
  const allTasks = Object.values(consultantTasks).flat();

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="space-y-6">
            {Object.entries(consultantGroups).map(([key, group]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">{group.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.consultants.map((consultant) => (
                    <div key={consultant.email} className="relative">
                      <div className="absolute top-4 right-4 z-10">
                        <Checkbox
                          checked={selectedConsultants.includes(consultant.name)}
                          onCheckedChange={() =>
                            handleConsultantToggle(consultant.name)
                          }
                        />
                      </div>
                      <ConsultantCard {...consultant} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full md:w-auto">Save Assignments</Button>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Selected Consultants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedConsultants.map((consultantName) => {
                const consultant = Object.values(consultantGroups)
                  .flatMap((group) => group.consultants)
                  .find((c) => c.name === consultantName);

                if (consultant) {
                  return (
                    <div
                      key={consultant.email}
                      className="cursor-pointer"
                      onClick={() => handleConsultantClick(consultant)}
                    >
                      <ConsultantCard {...consultant} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedConsultant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl">
            <ConsultantTasks
              consultant={selectedConsultant}
              onClose={() => setSelectedConsultant(null)}
              onTasksUpdate={handleTasksUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
