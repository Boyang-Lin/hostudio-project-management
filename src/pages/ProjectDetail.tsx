import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import ConsultantsList from "@/components/ConsultantsList";
import ConsultantGroupSelect from "@/components/ConsultantGroupSelect";
import ConsultantTasks from "@/components/ConsultantTasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EngagementTabContent from "@/components/EngagementTabContent";
import PaymentManagement from "@/components/PaymentManagement";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transformDatabaseConsultant, transformToDatabase } from "../types/project";
import { BaseConsultant, ProjectConsultant } from "../types/consultant";

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

  const { data: project, isLoading: isLoadingProject } = useQuery(
    ["project", id],
    async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  );

  const { data: consultantsData, isLoading: isLoadingConsultants } = useQuery(
    ["consultants", id],
    async () => {
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .eq("project_id", id);
      if (error) throw new Error(error.message);
      return data.map(transformDatabaseConsultant);
    },
    {
      onSuccess: (data) => {
        setConsultants(data);
      },
    }
  );

  const mutation = useMutation(
    async (newConsultant: BaseConsultant) => {
      const { data, error } = await supabase
        .from("consultants")
        .insert([transformToDatabase(id!, newConsultant)]);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["consultants", id]);
        toast.success("Consultant added successfully!");
      },
    }
  );

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

  return (
    <div>
      <ProjectCard project={project} />
      <ConsultantGroupSelect
        consultants={consultants}
        selectedConsultant={selectedConsultant}
        setSelectedConsultant={setSelectedConsultant}
        onAddConsultant={handleAddConsultant}
      />
      <Tabs>
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="engagement">
          <EngagementTabContent consultants={consultants} tasks={tasks} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentManagement projectId={id!} />
        </TabsContent>
      </Tabs>
      <ConsultantsList consultants={consultants} />
      <ConsultantTasks tasks={tasks} />
    </div>
  );
};

export default ProjectDetail;
