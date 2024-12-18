import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { ConsultantTasks } from "@/components/ConsultantTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { consultantGroups } from "@/data/mockData";
import { PaymentManagement } from "@/components/PaymentManagement";
import { EngagementTabContent } from "@/components/EngagementTabContent";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transformDatabaseConsultant, transformToDatabase } from "../types/project";
import { BaseConsultant, ProjectConsultant } from "../types/consultant";

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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [selectedConsultant, setSelectedConsultant] = useState<BaseConsultant | null>(null);
  const [consultantTasks, setConsultantTasks] = useState<ConsultantTasks>({});

  // Fetch project data
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) {
        toast.error('Error loading project');
        throw projectError;
      }

      const { data: consultantsData, error: consultantsError } = await supabase
        .from('project_consultants')
        .select('*')
        .eq('project_id', id);

      if (consultantsError) {
        toast.error('Error loading consultants');
        throw consultantsError;
      }

      return {
        ...projectData,
        project_consultants: consultantsData.map(transformDatabaseConsultant)
      };
    }
  });

  // Update project status mutation
  const updateProjectStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: "active" | "completed" | "on-hold" }) => {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Project status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update project status');
    }
  });

  // Add consultant mutation
  const addConsultant = useMutation({
    mutationFn: async (consultant: ProjectConsultant) => {
      if (!id) throw new Error('Project ID is required');
      const { error } = await supabase
        .from('project_consultants')
        .insert([transformToDatabase(id, consultant)]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Consultant added successfully');
    },
    onError: () => {
      toast.error('Failed to add consultant');
    }
  });

  // Update consultant status mutation
  const updateConsultantStatus = useMutation({
    mutationFn: async ({ projectId, email, status }: { projectId: string, email: string, status: string }) => {
      const { error } = await supabase
        .from('project_consultants')
        .update({ status })
        .eq('project_id', projectId)
        .eq('email', email);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Consultant status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update consultant status');
    }
  });

  // Update consultant quote mutation
  const updateConsultantQuote = useMutation({
    mutationFn: async ({ projectId, email, quote }: { projectId: string, email: string, quote: number }) => {
      const { error } = await supabase
        .from('project_consultants')
        .update({ quote })
        .eq('project_id', projectId)
        .eq('email', email);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Quote updated successfully');
    },
    onError: () => {
      toast.error('Failed to update quote');
    }
  });

  // Remove consultant mutation
  const removeConsultant = useMutation({
    mutationFn: async ({ projectId, email }: { projectId: string, email: string }) => {
      const { error } = await supabase
        .from('project_consultants')
        .delete()
        .eq('project_id', projectId)
        .eq('email', email);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Consultant removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove consultant');
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleProjectStatusChange = (newStatus: "active" | "completed" | "on-hold") => {
    updateProjectStatus.mutate({ id: project.id, status: newStatus });
  };

  const handleConsultantToggle = (consultant: BaseConsultant) => {
    const isSelected = project.project_consultants.some(c => c.email === consultant.email);
    
    if (isSelected) {
      removeConsultant.mutate({ projectId: project.id, email: consultant.email });
    } else {
      addConsultant.mutate({
        ...consultant,
        quote: 0 // Set default quote when adding a consultant
      });
    }
  };

  const handleQuoteChange = (email: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateConsultantQuote.mutate({
        projectId: project.id,
        email,
        quote: numValue
      });
    }
  };

  const handleStatusChange = (email: string, status: 'in-progress' | 'completed' | 'on-hold') => {
    updateConsultantStatus.mutate({
      projectId: project.id,
      email,
      status
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Link to="/" className="flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Project Details</h1>
        <ProjectCard 
          id={project.id}
          title={project.title}
          status={project.status}
          consultants={project.project_consultants}
          clientName={project.client_name}
          clientEmail={project.client_email}
          clientPhone={project.client_phone}
          constructionCost={project.construction_cost}
          onStatusChange={handleProjectStatusChange}
        />
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
                    <div key={consultant.email} className="relative">
                      <div className="absolute top-4 right-4 z-10">
                        <Checkbox
                          checked={project.project_consultants.some(c => c.email === consultant.email)}
                          onCheckedChange={() => handleConsultantToggle(consultant)}
                        />
                      </div>
                      <ConsultantCard 
                        {...consultant}
                        showQuoteInput={project.project_consultants.some(c => c.email === consultant.email)}
                        quote={project.project_consultants.find(c => c.email === consultant.email)?.quote}
                        onQuoteChange={(value) => handleQuoteChange(consultant.email, value.toString())}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <EngagementTabContent
            selectedConsultants={project.project_consultants}
            quotes={Object.fromEntries(
              project.project_consultants.map(c => [c.email, c.quote])
            )}
            onConsultantClick={setSelectedConsultant}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement consultants={project.project_consultants} />
        </TabsContent>
      </Tabs>

      {selectedConsultant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl">
            <ConsultantTasks
              consultant={selectedConsultant}
              onClose={() => setSelectedConsultant(null)}
              onTasksUpdate={(tasks) => {
                setConsultantTasks(prev => ({
                  ...prev,
                  [selectedConsultant.email]: tasks
                }));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
