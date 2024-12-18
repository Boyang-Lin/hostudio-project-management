import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantsList } from "@/components/ConsultantsList";
import { ConsultantGroupSelect } from "@/components/ConsultantGroupSelect";
import { ConsultantTasks } from "@/components/ConsultantTasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EngagementTabContent } from "@/components/EngagementTabContent";
import { PaymentManagement } from "@/components/PaymentManagement";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseConsultant, ProjectConsultant } from "../types/consultant";
import { consultantGroups as initialConsultantGroups } from "../data/mockData";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface ConsultantTasks {
  [email: string]: Task[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [consultants, setConsultants] = useState<ProjectConsultant[]>([]);
  const [tasks, setTasks] = useState<ConsultantTasks>({});
  const [selectedConsultant, setSelectedConsultant] = useState<BaseConsultant | null>(null);
  const [consultantGroups, setConsultantGroups] = useState(initialConsultantGroups);

  // Fetch project details
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch project consultants
  const { data: consultantsData, isLoading: isLoadingConsultants } = useQuery({
    queryKey: ["project_consultants", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_consultants")
        .select("*")
        .eq("project_id", id);
      
      if (error) throw error;
      return data.map((consultant) => ({
        name: consultant.name,
        email: consultant.email,
        phone: "N/A", // Default value since it's not in the database
        specialty: consultant.specialty,
        company: "N/A", // Default value since it's not in the database
        address: "N/A", // Default value since it's not in the database
        quote: consultant.quote || 0,
        status: consultant.status as 'in-progress' | 'completed' | 'on-hold' || 'in-progress'
      }));
    }
  });

  useEffect(() => {
    if (consultantsData) {
      setConsultants(consultantsData);
    }
  }, [consultantsData]);

  // Add consultant mutation
  const mutation = useMutation({
    mutationFn: async (newConsultant: BaseConsultant) => {
      const { error } = await supabase
        .from("project_consultants")
        .insert([{
          project_id: id,
          email: newConsultant.email,
          name: newConsultant.name,
          specialty: newConsultant.specialty,
          quote: 0,
          status: 'in-progress'
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_consultants", id] });
      toast.success("Consultant added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add consultant: " + error.message);
    }
  });

  const handleAddConsultant = () => {
    if (selectedConsultant) {
      mutation.mutate(selectedConsultant);
      setSelectedConsultant(null);
    }
  };

  useEffect(() => {
    if (consultantsData) {
      const tasksMap: ConsultantTasks = {};
      consultantsData.forEach((consultant) => {
        tasksMap[consultant.email] = [];
      });
      setTasks(tasksMap);
    }
  }, [consultantsData]);

  if (isLoadingProject || isLoadingConsultants) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <ProjectCard 
        title={project.title}
        status={project.status}
        consultants={consultants}
        clientName={project.client_name}
        clientEmail={project.client_email}
        clientPhone={project.client_phone}
        constructionCost={project.construction_cost}
      />
      <ConsultantGroupSelect
        selectedConsultant={selectedConsultant}
        setSelectedConsultant={setSelectedConsultant}
        onAddConsultant={handleAddConsultant}
      />
      <Tabs defaultValue="engagement">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="engagement">
          <EngagementTabContent 
            selectedConsultants={consultants}
            quotes={{}}
            onConsultantClick={() => {}}
            onStatusChange={() => {}}
          />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentManagement consultants={consultants} />
        </TabsContent>
      </Tabs>
      <ConsultantsList
        consultantGroups={consultantGroups}
        onConsultantGroupsChange={setConsultantGroups}
        onNewConsultant={() => {}}
        onNewGroup={() => {}}
      />
      <ConsultantTasks 
        consultant={selectedConsultant || {
          name: '',
          email: '',
          phone: '',
          specialty: '',
          company: '',
          address: ''
        }}
        onClose={() => {}}
      />
    </div>
  );
};

export default ProjectDetail;