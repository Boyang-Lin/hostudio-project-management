import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { ConsultantTasks } from "@/components/ConsultantTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { consultantGroups, projects, ProjectConsultant, Consultant } from "../data/mockData";
import { PaymentManagement } from "@/components/PaymentManagement";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate: Date | undefined;
}

interface ConsultantTasks {
  [consultantEmail: string]: Task[];
}

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [selectedConsultants, setSelectedConsultants] = useState<ProjectConsultant[]>(
    project?.consultants || []
  );
  const [activeTab, setActiveTab] = useState("details");
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [consultantTasks, setConsultantTasks] = useState<ConsultantTasks>({});
  const [quotes, setQuotes] = useState<{ [email: string]: number }>(() => {
    const initialQuotes: { [email: string]: number } = {};
    project?.consultants.forEach(consultant => {
      initialQuotes[consultant.email] = consultant.quote;
    });
    return initialQuotes;
  });

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleConsultantToggle = (consultant: Consultant) => {
    setSelectedConsultants((prev) => {
      if (prev.some(c => c.email === consultant.email)) {
        return prev.filter((c) => c.email !== consultant.email);
      } else {
        const newConsultant: ProjectConsultant = {
          ...consultant,
          quote: quotes[consultant.email] || 0
        };
        return [...prev, newConsultant];
      }
    });
  };

  const handleQuoteChange = (email: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setQuotes(prev => ({
        ...prev,
        [email]: numValue
      }));
      
      setSelectedConsultants(prev => 
        prev.map(consultant => 
          consultant.email === email 
            ? { ...consultant, quote: numValue }
            : consultant
        )
      );
    }
  };

  const handleConsultantClick = (consultant: Consultant) => {
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
          <TabsTrigger value="payments">Payments</TabsTrigger>
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
                    <div key={consultant.email} className="space-y-2">
                      <div className="relative">
                        <div className="absolute top-4 right-4 z-10">
                          <Checkbox
                            checked={selectedConsultants.some(c => c.email === consultant.email)}
                            onCheckedChange={() => handleConsultantToggle(consultant)}
                          />
                        </div>
                        <ConsultantCard {...consultant} />
                      </div>
                      {selectedConsultants.some(c => c.email === consultant.email) && (
                        <div className="px-4">
                          <Input
                            type="number"
                            placeholder="Quote amount"
                            value={quotes[consultant.email] || ''}
                            onChange={(e) => handleQuoteChange(consultant.email, e.target.value)}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button 
            className="w-full md:w-auto"
            onClick={() => toast.success("Assignments saved successfully")}
          >
            Save Assignments
          </Button>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Selected Consultants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedConsultants.map((consultant) => (
                <div
                  key={consultant.email}
                  className="cursor-pointer"
                  onClick={() => handleConsultantClick(consultant)}
                >
                  <ConsultantCard {...consultant} quote={quotes[consultant.email]} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement consultants={selectedConsultants} />
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