import { useState } from "react";
import { projects as initialProjects } from "../data/mockData";
import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";

export default function Index() {
  const [localProjects, setLocalProjects] = useState(initialProjects);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectsList
        projects={localProjects}
        onProjectsChange={setLocalProjects}
        onNewProject={() => {
          const newProject = {
            id: (localProjects.length + 1).toString(),
            title: "New Project",
            status: "active",
            consultants: [],
            clientName: "",
            clientEmail: "",
            clientPhone: "",
            constructionCost: 0,
          };
          setLocalProjects([...localProjects, newProject]);
        }}
      />

      <ConsultantsList />
    </div>
  );
}